import React from "react";
import { Bell, ChevronRight, Search } from "lucide-react";
import { Avatar } from "../common/Avatar.jsx";

export default function Topbar({ page, project, search, setSearch, unreadCount, onNotificationsClick, menu, setMenu, setMobileOpen }) {
  return <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><span className="hamburger" /></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{page === "Board" ? project.name : page}</strong></div></div><div className="topbar-actions"><div className="top-search"><Search size={16} /><input placeholder="Search tasks..." value={search} onChange={(event) => { setSearch(event.target.value); if (event.target.value) setPage("Search"); }} /><kbd>⌘ K</kbd></div><button className="icon-button notification-button" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} onClick={onNotificationsClick}><Bell size={18} />{unreadCount > 0 && <i />}</button><button className="top-avatar-button" onClick={() => setMenu(menu === "top-profile" ? "" : "top-profile")}><Avatar person={0} /></button></div></header>;
}
