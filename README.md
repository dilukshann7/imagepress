# ImagePress

<p align="center">
  <img src="assets/icon.png" alt="ImagePress Logo" width="120" />
</p>

<p align="center">
  A powerful desktop image compression tool built with Electron and React.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/electron-40.x-47848F?style=flat-square&logo=electron&logoColor=white" alt="Electron" />
  <img src="https://img.shields.io/badge/react-19.x-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/typescript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/tailwindcss-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey?style=flat-square" alt="Platform" />
</p>

---

## Overview

**ImagePress** is a cross-platform desktop application for compressing images with ease. It provides a clean, intuitive interface powered by React and shadcn/ui components, packaged as a native desktop app via Electron.

## Features

- Batch image compression
- Multiple format support
- Adjustable compression quality
- Real-time compression preview
- Native desktop experience across Windows, macOS, and Linux

## Tech Stack

| Layer      | Technology                                                                           |
| ---------- | ------------------------------------------------------------------------------------ |
| Shell      | [Electron](https://www.electronjs.org/) 40.x                                         |
| UI         | [React](https://react.dev/) 19.x + [TypeScript](https://www.typescriptlang.org/) 5.x |
| Styling    | [Tailwind CSS](https://tailwindcss.com/) 4.x                                         |
| Components | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)          |
| Icons      | [Lucide React](https://lucide.dev/)                                                  |
| Bundler    | [Webpack](https://webpack.js.org/) 5.x                                               |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm 9 or later

### Installation

```bash
git clone https://github.com/dilukshan-niranjan/imagepress.git
cd imagepress
npm install
```

### Running in Development

```bash
npm run start
```

### Building for Production

```bash
npm run build
```

Distributable packages will be generated in the `dist/` directory.

### Compile Only

```bash
npm run compile
```

## Project Structure

```
imagepress/
├── assets/               # App icons and static assets
├── src/
│   ├── main.ts           # Electron main process
│   ├── index.html        # Main window HTML
│   ├── about.html        # About window HTML
│   ├── renderer/         # React renderer process
│   │   ├── index.tsx
│   │   ├── about.tsx
│   │   ├── components/   # UI components
│   │   └── lib/          # Utilities
│   └── styles/
│       └── globals.css
├── package.json
├── tsconfig.json
├── webpack.config.js
└── tailwind.config.js
```

## License

Distributed under the [MIT](https://opensource.org/licenses/MIT) license.

## Author

**Dilukshan Niranjan**
