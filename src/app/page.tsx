"use client";

import React, { useState } from "react";
import { FileSystemProvider } from "@/context/FileSystemContext";
import Sidebar from "@/components/Sidebar/Sidebar";
import MainPanel from "@/components/MainPanel/MainPanel";
import TextEditor from "@/components/Editor/TextEditor";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <FileSystemProvider>
      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <MainPanel onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <TextEditor />
      </div>
    </FileSystemProvider>
  );
}
