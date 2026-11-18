import React from "react";
import { ArrowRight, CalendarDays, CheckCheck, ListTodo, Plus, Sparkles, Target, Users, MoreHorizontal } from "lucide-react";
import { people } from "../data/mockData.js";
import { Avatar, AvatarStack } from "../components/common/Avatar.jsx";

function Overview({ projects, tasks, activity, onOpenBoard, onCreate, onSelectTask }) {
  const inProgress = tasks.filter((task) => task.status === "In progress").length;
  const complete = tasks.filter((task) => task.status === "Done").length;
  return <div className="page-content overview-page">
    <div className="welcome-row"><div><p className="eyebrow">FRIDAY, JUNE 14, 2024</p><h1>Good morning, Olivia <span>✦</span></h1><p className="muted">Here’s what’s happening across your workspace today.</p></div><button className="button button-primary" onClick={onCreate}><Plus size={16} />New project</button></div>
    <section className="stat-grid"><Stat icon={<Target size={17} />} label="Active projects" value={projects.length} foot="Across your workspace" tint="lavender" /><Stat icon={<ListTodo size={17} />} label="Tasks in progress" value={inProgress} foot="+2 from last week" tint="mint" /><Stat icon={<CheckCheck size={17} />} label="Tasks completed" value={complete} foot="This week" tint="peach" /><Stat icon={<Users size={17} />} label="Team members" value="8" foot="Across 3 projects" tint="butter" /></section>
    <div className="overview-grid"><section className="panel projects-panel"><div className="panel-heading"><div><h2>Your projects</h2><p>Keep an eye on what your team is building.</p></div><button className="text-button" onClick={() => onOpenBoard(projects[0]?.id)}>View all <ArrowRight size={15} /></button></div><div className="project-cards">{projects.slice(0, 3).map((item) => <button className="project-card" key={item.id} onClick={() => onOpenBoard(item.id)}><div className="project-card-top"><span className={`project-icon ${item.color}`}>{item.icon}</span><span className="icon-button card-menu" aria-hidden="true"><MoreHorizontal size={18} /></span></div><h3>{item.name}</h3><p>{item.description}</p><div className="progress-meta"><span>Progress</span><strong>{item.progress}%</strong></div><div className="progress-track"><span style={{ width: `${item.progress}%` }} /></div><div className="project-card-footer"><AvatarStack ids={item.members} /><span><ListTodo size={14} />{item.tasks} tasks</span><span><CalendarDays size={14} />{item.due}</span></div></button>)}</div></section>
      <section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>The latest from your team.</p></div><button className="icon-button" aria-label="More activity"><MoreHorizontal size={18} /></button></div><div className="activity-list">{activity.slice(0, 4).map((item, index) => <button className="activity-item" key={`${item.target}-${index}`} onClick={() => { const task = tasks.find((entry) => entry.title === item.target); if (task) onSelectTask(task); }}><Avatar person={item.person} /><div className="activity-copy"><p><strong>{people[item.person].name.split(" ")[0]}</strong> {item.text} <b>{item.target}</b></p><span>{item.time}</span></div></button>)}</div><button className="activity-link" onClick={() => onOpenBoard()}>See all activity <ArrowRight size={14} /></button></section>
    </div>
    <section className="panel focus-panel"><div><span className="focus-icon"><Sparkles size={16} /></span><div><h3>A little focus goes a long way</h3><p>You have <strong>{tasks.filter((task) => task.status !== "Done").length} open tasks</strong> across your projects. Pick one and make some progress.</p></div></div><button className="button button-dark button-small" onClick={() => onSelectTask(tasks.find((task) => task.status !== "Done"))}>View my tasks <ArrowRight size={14} /></button></section>
  </div>;
}

function Stat({ icon, label, value, foot, tint }) {
  return <div className="stat-card"><span className={`stat-icon ${tint}`}>{icon}</span><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-foot">{foot}</span></div>;
}

export default Overview;
