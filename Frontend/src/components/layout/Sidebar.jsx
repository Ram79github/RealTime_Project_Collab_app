import React from "react";
import { Activity, ChevronDown, CircleHelp, Command, LayoutGrid, ListTodo, LogOut, MoreHorizontal, Plus, Search, Settings2, Sparkles, X } from "lucide-react";
import { Avatar } from "../common/Avatar.jsx";

export default function Sidebar({ mobileOpen, setMobileOpen, menu, setMenu, notify, setModal, page, setPage, projects, activeProject, openBoard, profile, onSignOut }) {
  return <>
<aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row"><div className="brand-mark"><Sparkles size={18} fill="currentColor" /></div><span className="brand-name">orbit</span><button className="mobile-close icon-button" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18} /></button></div>
        <button className="workspace-picker" onClick={() => setMenu(menu === "workspace" ? "" : "workspace")}><span className="workspace-avatar">S</span><span className="workspace-copy"><strong>Studio North</strong><small>Free workspace</small></span><ChevronDown size={16} /></button>
        {menu === "workspace" && <div className="workspace-menu"><strong>Studio North</strong><button onClick={() => { setMenu(""); notify("Workspace settings opened"); }}>Workspace settings</button><button onClick={() => { setMenu(""); setModal("invite"); }}>Invite your team</button></div>}
        <button className="search-trigger" onClick={() => { setPage("Search"); setMobileOpen(false); }}><Search size={16} /><span>Search anything</span><kbd><Command size={11} /> K</kbd></button>

        <div className="nav-section"><p className="nav-label">WORKSPACE</p>
          <button className={`nav-link ${page === "Overview" ? "active" : ""}`} onClick={() => { setPage("Overview"); setMobileOpen(false); }}><LayoutGrid size={17} />Overview</button>
          <button className={`nav-link ${page === "My tasks" ? "active" : ""}`} onClick={() => { setPage("My tasks"); setMobileOpen(false); }}><ListTodo size={17} />My tasks<span className="nav-count">5</span></button>
          <button className={`nav-link ${page === "Activity" ? "active" : ""}`} onClick={() => { setPage("Activity"); setMobileOpen(false); }}><Activity size={17} />Activity</button>
        </div>
        <div className="nav-section project-nav"><div className="nav-label-row"><p className="nav-label">YOUR PROJECTS</p><button className="tiny-button" onClick={() => setModal("project")} aria-label="Add project"><Plus size={15} /></button></div>
          {projects.map((item) => <button key={item.id} className={`nav-link project-link ${page === "Board" && item.id === activeProject ? "active" : ""}`} onClick={() => openBoard(item.id)}><span className={`project-dot ${item.color}`}>{item.icon}</span><span className="project-link-name">{item.name}</span><MoreHorizontal size={16} className="project-more" onClick={(event) => { event.stopPropagation(); setMenu(menu === item.id ? "" : item.id); }} /></button>)}
          <button className="nav-link add-project" onClick={() => setModal("project")}><Plus size={16} />Add a project</button>
        </div>
        <div className="sidebar-bottom">
          <button className="nav-link" onClick={() => notify("Settings are coming soon")}><Settings2 size={17} />Settings</button>
          <button className="nav-link" onClick={() => notify("Help center opened")}><CircleHelp size={17} />Help & support</button>
          <div className="profile-card"><Avatar person={0} size="profile-avatar" /><button className="profile-copy profile-open" onClick={() => { setPage("Profile"); setMobileOpen(false); }}><strong>{profile.name}</strong><small>{profile.email}</small></button><button className="icon-button profile-menu-button" onClick={() => setMenu(menu === "profile" ? "" : "profile")} aria-label="Profile menu"><MoreHorizontal size={18} /></button>{menu === "profile" && <div className="profile-menu"><button onClick={() => { setMenu(""); setPage("Profile"); }}>Your profile</button><button onClick={() => { setMenu(""); onSignOut(); }}><LogOut size={14} />Sign out</button></div>}</div>
        </div>
      </aside>
{mobileOpen && <button className="sidebar-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
  </>;
}
