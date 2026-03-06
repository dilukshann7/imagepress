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
) {
  return Promise.all(
    filePaths.map(async (filePath) => {
      const compressedBuffer = await compressImage(filePath, quality);
      await saveCompressedImage(filePath, compressedBuffer);
      const compressedSize = compressedBuffer.length;
      return {
        filePath,
        compressedSize,
      };
    }),
  );
}

async function compressImage(
  filePath: string,
  quality: number,
): Promise<Buffer> {
  try {
    const compressedBuffer = await sharp(filePath).jpeg({ quality }).toBuffer();
    return compressedBuffer;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
}

async function saveCompressedImage(
  filePath: string,
  compressedBuffer: Buffer,
): Promise<void> {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const defaultName = `${baseName}-compressed${ext}`;
  const defaultPath = path.join(dir, defaultName);

  try {
    await fs.writeFile(defaultPath, compressedBuffer);
  } catch (error) {
    console.error("Error saving compressed image:", error);
    throw error;
  }
}

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    resizable: isDev,
    icon: path.join(__dirname, "../assets/icon.png"),
  });

  mainWindow.loadFile(path.join(__dirname, "../src/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
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
