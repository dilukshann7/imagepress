import { contextBridge, ipcRenderer, webUtils } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  compressImages: (
    filePaths: string[],
    quality: number,
    outputFormat: string,
    resizeEnabled: boolean,
    maxWidth: number,
  ) =>
    ipcRenderer.invoke(
      "images:compress",
      filePaths,
      quality,
      outputFormat,
      resizeEnabled,
      maxWidth,
    ),
  getPathForFile: (file: File) => webUtils.getPathForFile(file),
});
