const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
  packagerConfig: {
    asar: {
      unpack: "**/node_modules/{sharp,@img}/**/*",
    },
    name: "ImagePress",
    executableName: "imagepress",
    icon: "assets/icon",
    extraResource: ["assets/icon.png"],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      platforms: ["win32"],
      config: {
        name: "imagepress",
        setupExe: "ImagePress-Setup.exe",
        setupIcon: "assets/icon.ico",
        shortcutLocations: ["StartMenu", "Desktop"],
        shortcutName: "ImagePress",
      },
    },
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {
        format: "ULFO",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
      config: {},
    },
    {
      name: "@electron-forge/maker-deb",
      platforms: ["linux"],
      config: {
        options: {
          name: "imagepress",
          productName: "ImagePress",
          genericName: "Image Compressor",
          maintainer: "Dilukshan Niranjan",
          description:
            "A powerful image compression tool built with Electron and React.",
          categories: ["Graphics", "Utility"],
          icon: "assets/icon.png",
          homepage: "https://github.com/dilukshan7/imagepress",
        },
      },
    },
    {
      name: "@electron-forge/maker-rpm",
      platforms: ["linux"],
      config: {
        options: {
          name: "imagepress",
          productName: "ImagePress",
          genericName: "Image Compressor",
          maintainer: "Dilukshan Niranjan",
          description:
            "A powerful image compression tool built with Electron and React.",
          categories: ["Graphics", "Utility"],
          icon: "assets/icon.png",
          homepage: "https://github.com/dilukshan7/imagepress",
        },
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
