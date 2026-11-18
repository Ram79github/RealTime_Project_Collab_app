# Frontend Design Document
## Real-time Project Collaboration App

> This document is written for an AI coding agent. Follow it strictly to build a clean, modern, and scalable frontend.

---

## 1. Project Overview

We are building a **Real-time Project Collaboration** application (similar to Trello + Linear).

### Core Features:
- User Authentication (Register / Login)
- User Profile + Avatar Upload
- Project Management (Create, View, Update, Delete)
- Project Members (Invite, Roles)
- Task Management (Kanban Board)
- Comments on Tasks
- Real-time updates using Socket.io

---

## 2. Recommended Tech Stack

| Purpose                  | Technology                        | Reason |
|-------------------------|-----------------------------------|--------|
| Framework               | **React + Vite**                  | Best for real-time dashboard apps |
| Language                | JavaScript (Plain)                | Keep it simple |
| Styling                 | **Tailwind CSS** + Shadcn/UI      | Fast & modern |
| Routing                 | React Router DOM v6               | Standard |
| HTTP Client             | Axios                             | Easy interceptors |
| Data Fetching           | TanStack Query (React Query)      | Best for API state |
| Forms                   | React Hook Form + Zod             | Excellent validation |
| Real-time               | socket.io-client                  | Matches our backend |
| Drag & Drop             | @dnd-kit/core + @dnd-kit/sortable | Modern & accessible |
| Icons                   | Lucide React                      | Clean icons |
| Toast Notifications     | Sonner or React Hot Toast         | For real-time feedback |
| State (Global)          | Zustand (light)                   | Auth + UI state |

> **Do NOT use Next.js** for this project.

---

## 3. Folder Structure

```bash
src/
├── api/                    # Axios instance + API functions
│   ├── axios.js
│   ├── auth.api.js
│   ├── project.api.js
│   ├── task.api.js
│   ├── member.api.js
│   └── comment.api.js
│
├── components/
│   ├── ui/                 # Shadcn components (Button, Input, Modal...)
│   ├── layout/             # Navbar, Sidebar, ProtectedRoute
│   ├── project/            # ProjectCard, CreateProjectModal
│   ├── board/              # KanbanBoard, Column, TaskCard
│   ├── task/               # TaskDrawer, TaskForm
│   ├── comment/            # CommentList, CommentInput
│   └── common/             # Avatar, Loader, EmptyState
│
├── hooks/                  # Custom hooks
│   ├── useAuth.js
│   ├── useSocket.js
│   └── useProject.js
│
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Dashboard.jsx
│   ├── ProjectBoard.jsx
│   └── Profile.jsx
│
├── store/                  # Zustand stores
│   ├── authStore.js
│   └── uiStore.js
│
├── lib/
│   ├── socket.js           # Socket.io setup
│   └── utils.js
│
├── App.jsx
├── main.jsx
└── index.css