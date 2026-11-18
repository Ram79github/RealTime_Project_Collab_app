const configuredApiUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const API_BASE_URL = /\/api$/i.test(configuredApiUrl) ? configuredApiUrl : `${configuredApiUrl}/api`;
const API_ORIGIN = API_BASE_URL.replace(/\/api$/i, "");
const TOKEN_KEY = "orbit-token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setSession = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem("orbit-user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("orbit-user");
};

export const socketUrl = API_ORIGIN;

async function request(path, { method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  const token = getToken();
  const isFormData = body instanceof FormData;

  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined && !isFormData) headers["Content-Type"] = "application/json";

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch {
    throw new Error("Cannot reach the API. Make sure the backend is running.");
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`The API returned an invalid response (${response.status}).`);
  }

  if (!response.ok || payload.success === false) {
    const error = new Error(payload.message || payload.errors?.[0]?.message || "The request failed.");
    error.status = response.status;
    throw error;
  }

  return payload.data;
}

const statusToApi = {
  "To do": "todo",
  "In progress": "in_progress",
  "In review": "review",
  Done: "done",
};

const statusToUi = {
  todo: "To do",
  in_progress: "In progress",
  review: "In review",
  done: "Done",
};

export const toUiProject = (project, index = 0) => {
  const colors = ["violet", "coral", "green", "blue"];
  const icons = ["✳", "◈", "✦", "◇"];
  return {
    ...project,
    id: project.id,
    name: project.name,
    description: project.description || "",
    color: colors[index % colors.length],
    icon: icons[index % icons.length],
    due: "—",
    progress: 0,
    members: [],
    tasks: 0,
  };
};

export const toUiTask = (task, userId) => ({
  ...task,
  id: task.id,
  projectId: task.project_id,
  title: task.title,
  status: statusToUi[task.status] || task.status,
  tag: "General",
  priority: task.priority ? task.priority[0].toUpperCase() + task.priority.slice(1) : "Medium",
  due: task.due_date
    ? new Date(`${String(task.due_date).slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—",
  assignees: task.assignee_id && String(task.assignee_id) === String(userId) ? [0] : [],
  assignedToCurrentUser: Boolean(task.assignee_id && String(task.assignee_id) === String(userId)),
  comments: Number(task.comment_count || 0),
  checklist: "",
  description: task.description || "",
});

export const toApiStatus = (status) => statusToApi[status] || status;

export const api = {
  login: (credentials) => request("/auth/login", { method: "POST", body: credentials }),
  register: (credentials) => request("/auth/register", { method: "POST", body: credentials }),
  projects: {
    list: () => request("/projects"),
    create: (project) => request("/projects", { method: "POST", body: project }),
    members: (projectId) => request(`/projects/${encodeURIComponent(projectId)}/members`),
    addMember: (projectId, member) => request(`/projects/${encodeURIComponent(projectId)}/members`, {
      method: "POST",
      body: member,
    }),
  },
  tasks: {
    list: (projectId) => request(`/tasks/project/${encodeURIComponent(projectId)}`),
    create: (task) => request("/tasks", { method: "POST", body: task }),
    update: (taskId, changes) => request(`/tasks/${encodeURIComponent(taskId)}`, { method: "PUT", body: changes }),
  },
  comments: {
    list: (taskId) => request(`/tasks/${encodeURIComponent(taskId)}/comments`),
    create: (taskId, content) => request(`/tasks/${encodeURIComponent(taskId)}/comments`, {
      method: "POST",
      body: { content },
    }),
  },
  profile: {
    get: () => request("/users/me"),
    update: (fullName) => request("/users/me", {
      method: "PUT",
      body: { full_name: fullName },
    }),
    uploadAvatar: (file) => {
      const body = new FormData();
      body.append("avatar", file);
      return request("/users/avatar", { method: "POST", body });
    },
  },
  notifications: {
    unreadCount: () => request("/notifications/unread-count"),
  },
};
