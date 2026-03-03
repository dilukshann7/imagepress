import { app, BrowserWindow } from "electron";
import path from "path";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const isDev = process.env.NODE_ENV === "development";
const isMac = process.platform === "darwin";

function createMainWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: isDev,
    icon: path.join(__dirname, "../assets/icon.png"),
  });

  mainWindow.loadFile(path.join(__dirname, "../src/index.html"));
}

app.on("ready", createMainWindow);
