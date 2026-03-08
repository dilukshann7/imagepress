import { app, BrowserWindow, ipcMain, Menu, dialog } from "electron";
import { stat } from "fs/promises";
import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";
import sharp from "sharp";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";
const isMac = process.platform === "darwin";

let mainWindow: BrowserWindow | null = null;

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "gif"] }],
  });

  if (!canceled) {
    return Promise.all(
      filePaths.map(async (filePath) => {
        const fileStats = await stat(filePath);
        return {
          filePath,
          originalSize: fileStats.size,
        };
      }),
    );
  } else {
    return undefined;
  }
}

async function handleCompressImages(
  _event: Electron.IpcMainInvokeEvent,
  filePaths: string[],
  quality: number,
  outputFormat: string,
  resizeEnabled: boolean,
  maxWidth: number,
) {
  return Promise.all(
    filePaths.map(async (filePath) => {
      const buffer = await processImage(
        filePath,
        quality,
        outputFormat,
        resizeEnabled,
        maxWidth,
      );
      await saveProcessedImage(filePath, buffer, outputFormat);
      return { filePath, compressedSize: buffer.length };
    }),
  );
}

function getFormatFromPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase().replace(".", "");
  const map: Record<string, string> = {
    jpg: "jpeg",
    jpeg: "jpeg",
    png: "png",
    webp: "webp",
    avif: "avif",
    gif: "png",
  };
  return map[ext] ?? "jpeg";
}

async function processImage(
  filePath: string,
  quality: number,
  outputFormat: string,
  resizeEnabled: boolean,
  maxWidth: number,
): Promise<Buffer> {
  try {
    const format =
      outputFormat === "original" ? getFormatFromPath(filePath) : outputFormat;
    let pipeline = sharp(filePath);

    if (resizeEnabled) {
      pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
    }

    switch (format) {
      case "jpeg":
        return pipeline.jpeg({ quality }).toBuffer();
      case "png":
        return pipeline.png({ quality }).toBuffer();
      case "webp":
        return pipeline.webp({ quality }).toBuffer();
      case "avif":
        return pipeline.avif({ quality }).toBuffer();
      default:
        return pipeline.jpeg({ quality }).toBuffer();
    }
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}

async function saveProcessedImage(
  filePath: string,
  buffer: Buffer,
  outputFormat: string,
): Promise<void> {
  const dir = path.dirname(filePath);
  const origExt = path.extname(filePath);
  const baseName = path.basename(filePath, origExt);
  const outExt =
    outputFormat === "original"
      ? origExt
      : `.${outputFormat === "jpeg" ? "jpg" : outputFormat}`;
  const defaultPath = path.join(dir, `${baseName}-compressed${outExt}`);

  try {
    await fs.writeFile(defaultPath, buffer);
  } catch (error) {
    console.error("Error saving processed image:", error);
    throw error;
  }
}

function createMainWindow(): void {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, "icon.png")
    : path.join(__dirname, "../assets/icon.png");

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    resizable: isDev,
    icon: iconPath,
  });

  mainWindow.loadFile(path.join(__dirname, "../src/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  app.setAppUserModelId("com.dilukshan.imagepress");
  createMainWindow();
  Menu.setApplicationMenu(null);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });

  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.handle("images:compress", handleCompressImages);
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
