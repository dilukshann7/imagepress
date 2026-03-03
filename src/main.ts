import { app, BrowserWindow } from "electron";

function createMainWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
}

app.on("ready", createMainWindow);
