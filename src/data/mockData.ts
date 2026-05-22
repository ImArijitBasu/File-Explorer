import { FileNode } from "@/types";

export const mockNodes: Record<string, FileNode> = {
  "root-1": {
    id: "root-1",
    name: "Documents",
    type: "folder",
    parentId: null,
    children: ["doc-1", "doc-2", "doc-3", "doc-4"],
  },
  "doc-1": {
    id: "doc-1",
    name: "Work",
    type: "folder",
    parentId: "root-1",
    children: ["work-1", "work-2"],
  },
  "work-1": {
    id: "work-1",
    name: "meeting-notes.txt",
    type: "text",
    parentId: "doc-1",
    content:
      "Meeting Notes — Q2 Planning\n\nDate: May 2025\nAttendees: Team Alpha\n\nAgenda:\n1. Review Q1 performance\n2. Set Q2 goals\n3. Allocate resources\n\nAction Items:\n- Finalize the roadmap by Friday\n- Schedule stakeholder demos",
  },
  "work-2": {
    id: "work-2",
    name: "project-plan.txt",
    type: "text",
    parentId: "doc-1",
    content:
      "Project Plan: Mini File Explorer\n\nPhase 1: Core Architecture\n- Set up Next.js with TypeScript\n- Design component hierarchy\n- Implement state management\n\nPhase 2: UI Development\n- Build sidebar tree view\n- Create main panel with file cards\n- Add text editor\n\nPhase 3: Polish\n- Animations and transitions\n- Responsive design\n- Testing",
  },
  "doc-2": {
    id: "doc-2",
    name: "Personal",
    type: "folder",
    parentId: "root-1",
    children: ["personal-1"],
  },
  "personal-1": {
    id: "personal-1",
    name: "todo-list.txt",
    type: "text",
    parentId: "doc-2",
    content:
      "My Todo List\n\n☐ Buy groceries\n☐ Schedule dentist appointment\n☑ Finish reading 'Clean Code'\n☐ Plan weekend trip\n☐ Update resume",
  },
  "doc-3": {
    id: "doc-3",
    name: "readme.txt",
    type: "text",
    parentId: "root-1",
    content:
      "Welcome to Mini File Explorer!\n\nThis is a simple file manager built with Next.js and TypeScript.\n\nFeatures:\n- Create, rename, and delete folders & files\n- Edit text files inline\n- Tree view navigation\n- Persistent storage via localStorage",
  },
  "doc-4": {
    id: "doc-4",
    name: "Archives",
    type: "folder",
    parentId: "root-1",
    children: [],
  },
  "root-2": {
    id: "root-2",
    name: "Pictures",
    type: "folder",
    parentId: null,
    children: ["pic-1"],
  },
  "pic-1": {
    id: "pic-1",
    name: "Vacation",
    type: "folder",
    parentId: "root-2",
    children: [],
  },
  "root-3": {
    id: "root-3",
    name: "Projects",
    type: "folder",
    parentId: null,
    children: ["proj-1", "proj-2"],
  },
  "proj-1": {
    id: "proj-1",
    name: "website-redesign",
    type: "folder",
    parentId: "root-3",
    children: ["proj-1-1"],
  },
  "proj-1-1": {
    id: "proj-1-1",
    name: "notes.txt",
    type: "text",
    parentId: "proj-1",
    content:
      "Website Redesign Notes\n\nColor Palette:\n- Primary: #6366f1 (Indigo)\n- Secondary: #8b5cf6 (Violet)\n- Accent: #06b6d4 (Cyan)\n\nTypography:\n- Headings: Inter Bold\n- Body: Inter Regular\n\nLayout:\n- Dark mode first\n- Glassmorphism cards\n- Smooth transitions",
  },
  "proj-2": {
    id: "proj-2",
    name: "config.txt",
    type: "text",
    parentId: "root-3",
    content: '{\n  "name": "my-project",\n  "version": "1.0.0",\n  "framework": "Next.js",\n  "language": "TypeScript"\n}',
  },
};

export const mockRootIds = ["root-1", "root-2", "root-3"];
