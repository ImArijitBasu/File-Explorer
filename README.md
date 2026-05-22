# 📂 Mini File Explorer

A modern, responsive, and beautiful **Mini File Explorer** web application designed to manage folders and text files in a nested hierarchical tree structure. Built specifically as a technical assignment for **Webbly Media** (Sweden).

Live Preview: [https://file-explorer-webbly.vercel.app/](https://file-explorer-webbly.vercel.app/)

---

## ✨ Features

### 📁 Folder & File Structure
- **Infinite Nesting:** Supports creating folders inside folders down to any depth.
- **Node Meta:** Every file and folder maintains a clean JSON structure with a unique ID, parent pointer, type metadata, and contents.
- **Prepopulated Content:** Boots up instantly with realistic sample data representing structured `Documents`, `Pictures`, and `Projects` folders.

### ⚙️ Core Operations
- **Create:** Instantly add new folders or text files inside the active directory using an intuitive modal dialog.
- **Rename:** Easily update file/folder names with single-click edit triggers.
- **Delete:** Safely remove files or entire directory trees. Removing a folder recursively deletes all of its nested children with a clean confirmation prompt.

### 🧭 Navigation & UI
- **Interactive Sidebar Tree:** A hierarchical tree explorer displaying nested directories, folders, and files. Folders can be dynamically expanded or collapsed.
- **Main View Grid:** A content workspace rendering folders and files inside the selected directory as beautiful, hoverable cards.
- **Breadcrumb Navigation:** Clickable trace path showing exactly where you are in the folder hierarchy and allowing fast navigation up the directory tree.
- **Hamburger Drawer Layout:** Fully optimized for mobile screens. The sidebar seamlessly transitions into an off-canvas drawer with a backdrop overlay.

### 📝 Text Editor
- **Full Workspace Editor:** Double-clicking text files launches a focused workspace overlay.
- **Auto-Save:** Auto-saves your progress automatically using a debounced write queue.
- **Manual Save & Shortcuts:** Quickly save with the visual toolbar button or standard `Ctrl + S` / `Cmd + S` keyboard commands.
- **Status Dashboard:** Shows real-time statistics including line counts, character counts, and the save state badge.

### 💾 Persistence
- **LocalStorage Sync:** Auto-saves all files, folder hierarchies, and text edits into browser storage. Everything is preserved across refreshes or tab closures.

---

## 🛠️ Tech Stack & Decisions

- **Framework:** Next.js 16 (React 19, App Router)
- **Language:** TypeScript (Fully typed interfaces for type safety and clean autocompletion)
- **Styling:** Tailwind CSS + custom CSS Variables (Vibrant modern dark theme utilizing deep slate colors, frosted-glass effects, smooth floating keyframes, and subtle micro-animations)
- **State Management:** Pure React Context + `useReducer` to achieve modular, predictable state flow without bringing in bulky external libraries.
- **Asset Overhead:** Zero external UI libraries or icon packages. Custom SVG vectors are embedded inline for incredibly fast page loads.

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── globals.css         # Custom animations, dark theme, and typography variables
│   ├── layout.tsx          # Font optimization, metadata setup, and root layout
│   └── page.tsx            # Main layout layout wiring Context + Sidebar + Workspace
├── components/
│   ├── ui/
│   │   └── Modal.tsx       # Reusable overlay wrapper with Esc and overlay close handlers
│   ├── Sidebar/
│   │   ├── Sidebar.tsx     # Sidebar wrapper and responsive drawers
│   │   └── TreeNode.tsx    # Recursive rendering node component for infinite nesting
│   ├── MainPanel/
│   │   ├── MainPanel.tsx   # Toolbar actions, grid states, and welcome panel
│   │   ├── FileCard.tsx    # Workspace file/folder cards with inline action menus
│   │   └── Breadcrumb.tsx  # Dynamic interactive parent folder link trace
│   ├── Editor/
│   │   └── TextEditor.tsx  # Debounced text workspace with quick keys
│   └── Modals/
│       ├── CreateModal.tsx     # Entity creation modal
│       ├── RenameModal.tsx     # Entity renaming modal
│       └── DeleteConfirmModal.tsx # Recursive deletion warnings modal
├── context/
│   └── FileSystemContext.tsx   # State reducer, hydration handlers, and localStorage sync
├── data/
│   └── mockData.ts         # Realistic pre-populated mock folders/files
└── types/
    └── index.ts            # TypeScript definitions (FileNode, State, Actions)
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18.x or higher) and npm installed.

### Installation
1. Clone the repository or open the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server
Run the local dev server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to see the app in action!

### Production Build
Validate the build correctness and create a production bundle:
```bash
npm run build
```

---

## 📝 Swedish Note for Webbly Media
Tack för möjligheten att göra det här arbetet! Detta projekt har skapats med stort fokus på kodkvalitet, en modern och minimalistisk design (glassmorphism), samt en felfri användarupplevelse på både dator och mobil.
