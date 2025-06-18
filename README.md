# cozy-ui

<div align="center">
  <h1>Cozy UI</h1>
  <p>A powerful visual storyboarding and workflow editor built with Electron, React, and TypeScript</p>

An Electron application with React and TypeScript
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)

## Recommended IDE Setup

</div>

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 🎨 Overview

## Project Setup

Cozy UI is a desktop application designed for visual storytelling and creative workflow management. It provides a node-based interface for creating storyboards, managing scenes, and organizing creative projects with an intuitive drag-and-drop system powered by React Flow.

````

Generates AppImage, Snap, and DEB packages.

## 🔐 Security & Code Signing

### ⚠️ Important Disclaimer

**This application is currently not code signed.** This means:

- **macOS**: You'll see a warning that the app is from an unidentified developer
- **Windows**: SmartScreen may block the installer
- **Antivirus**: Some antivirus software may flag the app as suspicious

This is normal for unsigned applications and does not indicate any security issue with the code itself.

### macOS Gatekeeper Bypass

Since the app is not notarized by Apple, macOS will prevent it from opening by default. To run the app on macOS:

1. **First attempt**: Try to open the app normally - it will be blocked
2. **Use this command** to remove the quarantine attribute:

```bash
sudo xattr -rd com.apple.quarantine /Applications/Сozy-ui.app
````

3. **Alternative method**:
   - Right-click the app and select "Open"
   - Click "Open" in the security dialog
   - This only needs to be done once

### Windows SmartScreen

On Windows, you may see a SmartScreen warning:

1. Click "More info"
2. Click "Run anyway"

### Future Plans

We plan to implement code signing in future releases:

- Apple Developer certificate for macOS signing and notarization
- Windows code signing certificate
- This will eliminate security warnings and provide a smoother installation experience

## 🚢 Release Process

### Install

### ✨ Key Features

- **Node-Based Editor**: Visual workflow creation with draggable nodes and connections
- **Multiple Node Types**:
  - 📝 Text Prompts
  - 🖼️ Image Input/Output
  - 🎬 Video Input/Output
  - 👥 Character Management
  - 💬 Dialogue Creation
  - 🎭 Scene Organization
  - 📋 Storyboard Layout
  - 🎨 Style References
  - 🔲 Panel Layouts
  - 🎞️ Sequence Management
- **Project Management**: Save and load multiple projects
- **Theme Support**: Dark and light mode with smooth transitions
- **Context Menus**: Right-click actions for quick node creation
- **Keyboard Shortcuts**: Efficient workflow with customizable shortcuts
- **Auto-save**: Never lose your work with persistent state management
- **Export Options**: Generate production-ready outputs

## 🛠️ Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/) - Cross-platform desktop apps
- **Frontend**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- **Node Editor**: [React Flow](https://reactflow.dev/) - Interactive node-based UIs
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with CSS variables
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icons
- **Build Tool**: [Electron Vite](https://electron-vite.org/) - Fast HMR for Electron
- **Package Manager**: [pnpm](https://pnpm.io/) - Fast, disk space efficient

## 📦 Installation

### Prerequisites

- Node.js 20 or higher
- pnpm 10.12.1 or higher

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cozy-ui.git
cd cozy-ui
```

2. Install dependencies:

```bash
pnpm install
```

3. Start development server:

```bash
pnpm dev
```

## 🚀 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server with hot reload
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm typecheck        # Run TypeScript type checking

# Building
pnpm build            # Build for current platform
pnpm build:win        # Build for Windows
pnpm build:mac        # Build for macOS (ARM64)
pnpm build:linux      # Build for Linux
```

### Project Structure

```
cozy-ui/
├── .github/          # GitHub Actions workflows
├── build/            # Build resources and configs
├── dist/             # Distribution files (generated)
├── out/              # Compiled output (generated)
├── resources/        # Application resources
├── src/
│   ├── main/         # Electron main process
│   ├── preload/      # Preload scripts
│   └── renderer/     # React application
│       ├── assets/   # Static assets
│       ├── components/
│       │   ├── canvas/    # Canvas-related components
│       │   ├── nodes/     # Node type components
│       │   ├── panels/    # Panel components
│       │   └── ui/        # shadcn/ui components
│       ├── contexts/      # React contexts
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Utility functions
│       ├── store/         # State management
│       └── types/         # TypeScript types
└── package.json
```

## 🏗️ Architecture

### Main Process

- Handles window management
- File system operations
- Native OS integrations
- IPC communication with renderer

### Renderer Process

- React application with node-based editor
- Component-based architecture
- Context-based state management
- Persistent storage via IndexedDB

### Component Library

The UI components are built using [shadcn/ui](https://ui.shadcn.com/), providing:

- Consistent design system
- Accessibility out of the box
- Customizable with Tailwind CSS
- Type-safe components

## 🎯 Usage

### Creating a Workflow

1. **Add Nodes**: Right-click on the canvas to open context menu
2. **Connect Nodes**: Drag from output handle to input handle
3. **Configure Nodes**: Click on a node to edit its properties
4. **Save Project**: Projects auto-save, or use Ctrl/Cmd+S

### Node Types

- **Input Nodes**: Import images, videos, or text
- **Processing Nodes**: Characters, dialogues, scenes
- **Layout Nodes**: Panel layouts, storyboards
- **Output Nodes**: Export final images or videos

## 🔧 Configuration

### Theme Configuration

Themes are configured in `src/renderer/src/assets/index.css` using CSS variables.

### shadcn/ui Configuration

Component configuration is in `components.json`:

- Style: New York
- Base Color: Neutral
- CSS Variables: Enabled
- Icons: Lucide

## 📄 Building for Production

### macOS

```bash
$ pnpm install
pnpm build:mac
```

### Development

Generates a DMG installer for ARM64 Macs.

### Windows

```bash
$ pnpm dev
pnpm build:win
```

### Build

Generates an NSIS installer (.exe).

### Linux

```bash
# For windows
$ pnpm build:win
pnpm build:linux
```

Generates AppImage, Snap, and DEB packages.

## 🚢 Release Process

# For macOS

$ pnpm build:mac
This project uses automated GitHub Actions for releases:

# For Linux

$ pnpm build:linux

### Automatic Releases

Every push to main branch triggers automatic versioning and release based on commit messages:

- `feat:` - Minor version bump
- `fix:` - Patch version bump
- `BREAKING CHANGE:` - Major version bump

### Manual Releases

```bash
git tag v1.0.0
git push origin v1.0.0
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Build process or auxiliary tool changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [React Flow](https://reactflow.dev/) for the node editor foundation
- [Electron Vite](https://electron-vite.org/) for the amazing development experience
- All contributors who have helped shape this project

## 📞 Support

- Create an [Issue](https://github.com/yourusername/cozy-ui/issues) for bug reports
- Start a [Discussion](https://github.com/yourusername/cozy-ui/discussions) for questions
- Check out the [Wiki](https://github.com/yourusername/cozy-ui/wiki) for detailed guides

---

<div align="center">
  Made with ❤️ by the Cozy UI Team
</div>
