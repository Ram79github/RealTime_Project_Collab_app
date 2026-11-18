import React from "react";
import { CalendarDays, CheckCheck, LayoutGrid } from "lucide-react";
import { Tag } from "../components/common/Tag.jsx";

export default function MyTasks({ tasks, onSelectTask, onOpenBoard }) {
  return <div className="page-content simple-page"><div className="welcome-row"><div><p className="eyebrow">YOUR WORK, AT A GLANCE</p><h1>My tasks</h1><p className="muted">Everything you’re working on, all in one place.</p></div><button className="button button-primary" onClick={() => onOpenBoard()}><LayoutGrid size={15} />Open board</button></div><div className="panel my-task-panel"><div className="my-task-header"><span>Task</span><span>Project</span><span>Priority</span><span>Due date</span></div>{tasks.length === 0 ? <div className="empty-state"><CheckCheck size={24} /><h3>All caught up</h3><p>You don’t have any open tasks assigned to you.</p></div> : tasks.filter((task) => task.status !== "Done").map((task) => <button className="my-task-row" key={task.id} onClick={() => onSelectTask(task)}><span><span className={`column-status-dot ${task.status.toLowerCase().replace(" ", "-")}`} /><strong>{task.title}</strong></span><Tag>{task.tag}</Tag><span className={`priority priority-${task.priority.toLowerCase()}`}><i />{task.priority}</span><span className="task-date"><CalendarDays size={14} />{task.due}</span></button>)}</div></div>;
}
