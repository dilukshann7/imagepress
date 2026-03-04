import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";
const isMac = process.platform === "darwin";

let mainWindow: BrowserWindow | null = null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: isDev,
    icon: path.join(__dirname, "../assets/icon.png"),
  });

  mainWindow.loadFile(path.join(__dirname, "../src/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createAboutWindow(): void {
  const aboutWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: "About",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
    icon: path.join(__dirname, "../assets/icon.png"),
    backgroundColor: "#222222",
  });

  aboutWindow.removeMenu();
  aboutWindow.loadFile(path.join(__dirname, "../src/about.html"));
}

app.on("ready", () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
});

const menu: MenuItemConstructorOptions[] = [
  ...(isMac
    ? [
        {
          label: "About",
          submenu: [{ label: "About ImagePress", click: createAboutWindow }],
        },
      ]
    : []),
  {
    role: "fileMenu" as const,
  },
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [{ label: "About ImagePress", click: createAboutWindow }],
        },
      ]
    : []),
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
