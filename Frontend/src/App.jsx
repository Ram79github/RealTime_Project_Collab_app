import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Check, LogOut } from "lucide-react";
import { api, clearSession, getToken, setSession, socketUrl, toApiStatus, toUiProject, toUiTask } from "./lib/api.js";
import { readStorage } from "./lib/storage.js";
import Dashboard from "./pages/Dashboard.jsx";
import Board from "./components/board/KanbanBoard.jsx";
import MyTasks from "./pages/MyTasks.jsx";
import ActivityPage from "./pages/Activity.jsx";
import SearchPage from "./pages/Search.jsx";
import ProfilePage from "./pages/Profile.jsx";
import AuthPage from "./pages/auth/AuthPage.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import Topbar from "./components/layout/Topbar.jsx";
import TaskDrawer from "./components/task/TaskDrawer.jsx";
import ActionModals from "./components/project/ActionModals.jsx";

function App() {
  const [page, setPage] = useState("Overview");
  const [activeProject, setActiveProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activity] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All tasks");
  const [toast, setToast] = useState("");
  const [menu, setMenu] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [token, setToken] = useState(() => getToken());
  const [authenticated, setAuthenticated] = useState(() => Boolean(getToken()));
  const [user, setUser] = useState(() => readStorage("orbit-user", null));
  const [profile, setProfile] = useState(() => readStorage("orbit-profile", { name: "Team member", email: "", role: "Member" }));
  const [profileImage, setProfileImage] = useState(() => readStorage("orbit-avatar", ""));

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(notify.timeout);
    notify.timeout = window.setTimeout(() => setToast(""), 3000);
  };

  const projectsWithStats = useMemo(() => projects.map((item) => {
    const projectTasks = tasks.filter((task) => task.projectId === item.id);
    const completed = projectTasks.filter((task) => task.status === "Done").length;
    return {
      ...item,
      tasks: projectTasks.length,
      progress: projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0,
    };
  }), [projects, tasks]);

  const project = projectsWithStats.find((item) => item.id === activeProject) || projectsWithStats[0] || {
    id: "",
    name: "Your projects",
    description: "Create a project to get started.",
    color: "violet",
    icon: "✳",
    members: [],
  };

  useEffect(() => {
    if (!authenticated || !token) return undefined;
    let active = true;
    setToast("");

    const loadWorkspace = async () => {
      try {
        const [profileRecord, projectRows] = await Promise.all([
          api.profile.get(),
          api.projects.list(),
        ]);
        if (!active) return;
        const memberGroups = await Promise.all(projectRows.map((item) => api.projects.members(item.id)));
        if (!active) return;
        const nextProjects = projectRows.map((item, index) => ({
          ...toUiProject(item, index),
          members: memberGroups[index].map((member) => {
            const name = member.full_name || member.email;
            return {
              id: member.user_id,
              name,
              initials: name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
              color: "lilac",
            };
          }),
        }));
        setProjects(nextProjects);
        setActiveProject((current) => nextProjects.some((item) => item.id === current) ? current : (nextProjects[0]?.id || ""));

        const taskGroups = await Promise.all(projectRows.map((item) => api.tasks.list(item.id)));
        if (!active) return;
        setTasks(taskGroups.flat().map((item) => toUiTask(item, profileRecord.id)));
        const nextUser = { ...user, ...profileRecord };
        setUser(nextUser);
        setProfile({
          name: profileRecord.full_name || "Team member",
          email: profileRecord.email || "",
          role: "Member",
        });
        setProfileImage(profileRecord.avatar_url || "");
      } catch (error) {
        if (!active) return;
        if (error.status === 401) {
          clearSession();
          setToken(null);
          setAuthenticated(false);
          setUser(null);
        } else {
          setToast(`Unable to load your workspace: ${error.message}`);
        }
      }
    };

    loadWorkspace();
    return () => {
      active = false;
    };
  }, [authenticated, token, user?.id]);

  useEffect(() => {
    if (!authenticated || !token || !activeProject) return undefined;
    const socket = io(socketUrl, { auth: { token } });
    const upsertTask = (record) => {
      const task = toUiTask(record, user?.id);
      setTasks((current) => [...current.filter((item) => item.id !== task.id), task]);
      setSelectedTask((current) => current?.id === task.id ? task : current);
    };

    socket.on("connect", () => socket.emit("join_project", activeProject));
    socket.on("task_created", upsertTask);
    socket.on("task_updated", upsertTask);
    socket.on("task_deleted", (record) => {
      setTasks((current) => current.filter((item) => item.id !== record.id));
      setSelectedTask((current) => current?.id === record.id ? null : current);
    });
    socket.on("comment_added", (comment) => {
      setComments((current) => {
        const taskComments = current[comment.task_id] || [];
        return taskComments.some((item) => item.id === comment.id)
          ? current
          : { ...current, [comment.task_id]: [...taskComments, comment] };
      });
    });
    socket.on("notification_created", () => setUnreadCount((count) => count + 1));
    socket.on("notifications_read_all", () => setUnreadCount(0));

    return () => {
      socket.emit("leave_project", activeProject);
      socket.disconnect();
    };
  }, [authenticated, token, activeProject, user?.id]);

  const handleAuthenticated = (session) => {
    setSession(session);
    setToken(session.token);
    setUser(session.user);
    setProfile({
      name: session.user.full_name || session.user.name || "Team member",
      email: session.user.email || "",
      role: "Member",
    });
    setAuthenticated(true);
  };

  const signOut = () => {
    clearSession();
    localStorage.removeItem("orbit-auth");
    setToken(null);
    setUser(null);
    setProjects([]);
    setTasks([]);
    setComments({});
    setUnreadCount(0);
    setSelectedTask(null);
    setAuthenticated(false);
  };

  const openBoard = (id = activeProject) => {
    if (!id) {
      notify("Create a project before opening a board.");
      return;
    }
    setActiveProject(id);
    setPage("Board");
    setMobileOpen(false);
  };

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const matchesSearch = `${task.title} ${task.tag} ${task.status}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All tasks" || task.priority === filter;
    return matchesSearch && matchesFilter;
  }), [tasks, search, filter]);
  const projectTasks = filteredTasks.filter((task) => task.projectId === activeProject);
  const showNotifications = async () => {
    try {
      const { count } = await api.notifications.unreadCount();
      setUnreadCount(count);
      notify(count ? `You have ${count} unread notification${count === 1 ? "" : "s"}.` : "You're all caught up.");
    } catch (error) {
      notify(`Unable to load notifications: ${error.message}`);
    }
  };

  if (!authenticated) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  const moveTask = async (id, status) => {
    try {
      const record = await api.tasks.update(id, { status: toApiStatus(status) });
      const updated = toUiTask(record, user?.id);
      setTasks((current) => current.map((task) => task.id === id ? updated : task));
      setSelectedTask((current) => current?.id === id ? updated : current);
    } catch (error) {
      notify(`Unable to update task: ${error.message}`);
    }
  };

  const addTask = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title")?.toString().trim();
    if (!title || !activeProject) {
      notify(activeProject ? "Enter a task name." : "Create a project before adding tasks.");
      return;
    }

    try {
      const record = await api.tasks.create({
        project_id: activeProject,
        title,
        description: form.get("description")?.toString() || "",
        status: toApiStatus(form.get("status")?.toString() || "To do"),
        priority: (form.get("priority")?.toString() || "Medium").toLowerCase(),
        due_date: form.get("due")?.toString() || null,
      });
      const task = toUiTask(record, user?.id);
      setTasks((current) => [task, ...current]);
      setModal(null);
      notify("Task added to your board");
    } catch (error) {
      notify(`Unable to create task: ${error.message}`);
    }
  };

  const addProject = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name")?.toString().trim();
    if (!name) {
      notify("Enter a project name.");
      return;
    }

    try {
      const record = await api.projects.create({
        name,
        description: form.get("description")?.toString() || "",
      });
      const created = {
        ...toUiProject(record),
        members: [{
          id: user?.id,
          name: profile.name,
          initials: profile.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
          color: "lilac",
        }],
      };
      setProjects((current) => [created, ...current]);
      setActiveProject(created.id);
      setModal(null);
      notify("Project created");
    } catch (error) {
      notify(`Unable to create project: ${error.message}`);
    }
  };

  const inviteMember = async (event) => {
    event.preventDefault();
    if (!activeProject) {
      notify("Create a project before adding members.");
      return;
    }
    const form = new FormData(event.currentTarget);
    try {
      await api.projects.addMember(activeProject, {
        email: form.get("email")?.toString().trim(),
        role: form.get("role")?.toString(),
      });
      const members = await api.projects.members(activeProject);
      setProjects((current) => current.map((item) => item.id === activeProject ? {
        ...item,
        members: members.map((member) => {
          const name = member.full_name || member.email;
          return {
            id: member.user_id,
            name,
            initials: name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
            color: "lilac",
          };
        }),
      } : item));
      setModal(null);
      notify("Project member added");
    } catch (error) {
      notify(`Unable to add member: ${error.message}`);
    }
  };

  const saveProfile = async (nextProfile) => {
    const record = await api.profile.update(nextProfile.name.trim());
    const nextUser = { ...user, full_name: record.full_name };
    setUser(nextUser);
    setSession({ token, user: nextUser });
    const updatedProfile = { ...profile, ...nextProfile, name: record.full_name };
    setProfile(updatedProfile);
    localStorage.setItem("orbit-profile", JSON.stringify(updatedProfile));
    notify("Profile saved");
  };

  const uploadAvatar = async (file) => {
    const record = await api.profile.uploadAvatar(file);
    setProfileImage(record.avatar_url || "");
    notify("Profile photo updated");
  };

  const openTask = async (task) => {
    setSelectedTask(task);
    setCommentText("");
    try {
      const items = await api.comments.list(task.id);
      setComments((current) => ({ ...current, [task.id]: items }));
    } catch (error) {
      notify(`Unable to load comments: ${error.message}`);
    }
  };

  const addComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim() || !selectedTask) return;

    try {
      const comment = await api.comments.create(selectedTask.id, commentText.trim());
      setComments((current) => {
        const items = current[selectedTask.id] || [];
        return items.some((item) => item.id === comment.id)
          ? current
          : { ...current, [selectedTask.id]: [...items, comment] };
      });
      setTasks((current) => current.map((task) => task.id === selectedTask.id
        ? { ...task, comments: task.comments + 1 }
        : task));
      setSelectedTask((current) => current ? { ...current, comments: current.comments + 1 } : current);
      setCommentText("");
    } catch (error) {
      notify(`Unable to send comment: ${error.message}`);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} menu={menu} setMenu={setMenu} notify={notify} setModal={setModal} page={page} setPage={setPage} projects={projectsWithStats} activeProject={activeProject} openBoard={openBoard} profile={profile} onSignOut={signOut} />

      <main className="main-area">
        <Topbar page={page} project={project} search={search} setSearch={setSearch} unreadCount={unreadCount} onNotificationsClick={showNotifications} menu={menu} setMenu={setMenu} setMobileOpen={setMobileOpen} />

        {page === "Overview" && <Dashboard projects={projectsWithStats} tasks={tasks} activity={activity} onOpenBoard={openBoard} onCreate={() => setModal("project")} onSelectTask={openTask} />}
        {page === "Board" && <Board project={project} tasks={projectTasks} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} onAdd={() => setModal("task")} onSelectTask={openTask} onMoveTask={moveTask} />}
        {page === "My tasks" && <MyTasks tasks={filteredTasks.filter((task) => task.assignedToCurrentUser)} onSelectTask={openTask} onOpenBoard={openBoard} />}
        {page === "Activity" && <ActivityPage activity={activity} tasks={tasks} onSelectTask={openTask} />}
        {page === "Search" && <SearchPage tasks={filteredTasks} projects={projectsWithStats} query={search} onSelectTask={openTask} onOpenBoard={openBoard} />}
        {page === "Profile" && <ProfilePage profile={profile} onSaveProfile={saveProfile} profileImage={profileImage} onUploadAvatar={uploadAvatar} />}
      </main>

      <TaskDrawer selectedTask={selectedTask} close={() => setSelectedTask(null)} setSelectedTask={setSelectedTask} comments={comments} commentText={commentText} setCommentText={setCommentText} addComment={addComment} moveTask={moveTask} notify={notify} />
      <ActionModals modal={modal} setModal={setModal} addTask={addTask} addProject={addProject} onInvite={inviteMember} notify={notify} />
      {menu === "top-profile" && <div className="floating-profile"><strong>{profile.name}</strong><span>{profile.email}</span><button onClick={() => { setMenu(""); setPage("Profile"); }}>Manage profile</button><button onClick={signOut}><LogOut size={14} />Sign out</button></div>}
      {toast && <div className="toast"><Check size={16} />{toast}</div>}
    </div>
  );
}

export default App;
