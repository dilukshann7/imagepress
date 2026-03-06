import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  compressImages: (filePaths: string[], quality: number) =>
    ipcRenderer.invoke("images:compress", filePaths, quality),
});
