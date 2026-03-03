import {
  app,
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  globalShortcut,
} from "electron";
import path from "path";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const isDev = process.env.NODE_ENV === "development";
const isMac = process.platform === "darwin";

let mainWindow: BrowserWindow | null = null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: isDev,
    icon: path.join(__dirname, "../assets/icon.png"),
    backgroundColor: "#222222",
  });

  mainWindow.loadFile(path.join(__dirname, "../src/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  globalShortcut.register("CmdOrCtrl+R", () => {
    if (mainWindow) {
      mainWindow.reload();
    }
  });

  globalShortcut.register("CmdOrCtrl+Shift+I", () => {
    if (mainWindow) {
      mainWindow.webContents.openDevTools();
    }
  });
});

const menu: MenuItemConstructorOptions[] = [
  ...(isMac ? [{ role: "fileMenu" as const }] : []),
  {
    role: "fileMenu" as const,
  },
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" as const },
            { role: "forceReload" as const },
            { role: "toggleDevTools" as const },
          ],
        },
      ]
    : []),
];

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
