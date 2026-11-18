import React from "react";
import { ArrowRight } from "lucide-react";
import { people } from "../data/mockData.js";
import { Avatar } from "../components/common/Avatar.jsx";

export default function ActivityPage({ activity, tasks, onSelectTask }) {
  return <div className="page-content simple-page"><div className="welcome-row"><div><p className="eyebrow">KEEP UP WITH YOUR TEAM</p><h1>Activity</h1><p className="muted">A running feed of the latest project updates.</p></div></div><section className="panel full-activity"><div className="activity-list">{activity.map((item, index) => <button className="activity-item" key={`${item.target}-${index}`} onClick={() => { const task = tasks.find((entry) => entry.title === item.target); if (task) onSelectTask(task); }}><Avatar person={item.person} /><div className="activity-copy"><p><strong>{people[item.person].name}</strong> {item.text} <b>{item.target}</b></p><span>{item.time} · Website redesign</span></div><ArrowRight size={15} /></button>)}</div></section></div>;
}
