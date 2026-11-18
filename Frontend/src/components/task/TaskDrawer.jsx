import React from "react";
import { CalendarDays, CheckCheck, MessageCircle, Plus } from "lucide-react";
import { Avatar, AvatarStack } from "../common/Avatar.jsx";
import { Tag } from "../common/Tag.jsx";
import Modal from "../ui/Modal.jsx";

export default function TaskDrawer({ selectedTask, close, setSelectedTask, comments, commentText, setCommentText, addComment, moveTask, notify }) {
  if (!selectedTask) return null;
  return <Modal title="Task details" onClose={close} wide>
        <div className="task-detail">
          <div className="task-detail-main"><div className="detail-eyebrow"><Tag>{selectedTask.tag}</Tag><span className={`priority priority-${selectedTask.priority.toLowerCase()}`}><span />{selectedTask.priority} priority</span></div><h2 className="detail-title">{selectedTask.title}</h2><p className="detail-description">{selectedTask.description || "No description yet. Add some context to help your team move this task forward."}</p>
            <div className="detail-section"><h3>Activity <span>{(comments[selectedTask.id] || []).length}</span></h3><div className="comment-list">{(comments[selectedTask.id] || []).map((comment) => <div className="comment-item" key={comment.id}><Avatar person={0} /><div><p><strong>{comment.full_name || "Team member"}</strong><span> · {comment.created_at ? new Date(comment.created_at).toLocaleString() : "just now"}</span></p><div className="comment-bubble">{comment.content}</div></div></div>)}{(comments[selectedTask.id] || []).length === 0 && <p className="muted">No comments yet. Start the conversation.</p>}</div>
              <form className="comment-form" onSubmit={addComment}><Avatar person={0} /><input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Leave a comment..." aria-label="Leave a comment" /><button className="button button-dark button-small" type="submit">Send</button></form></div>
          </div><aside className="detail-sidebar"><label>Status<select value={selectedTask.status} onChange={(event) => { moveTask(selectedTask.id, event.target.value); setSelectedTask({ ...selectedTask, status: event.target.value }); }}><option>To do</option><option>In progress</option><option>In review</option><option>Done</option></select></label><label>Assignees<div className="assignee-detail"><AvatarStack ids={selectedTask.assignees} /><button className="tiny-button" onClick={() => notify("Invite teammates to assign them")} aria-label="Add assignee"><Plus size={14} /></button></div></label><label>Due date<div className="detail-value"><CalendarDays size={15} />{selectedTask.due}</div></label><label>Priority<div className={`priority priority-${selectedTask.priority.toLowerCase()}`}><span />{selectedTask.priority}</div></label><label>Checklist<div className="detail-value"><CheckCheck size={15} />{selectedTask.checklist || "No checklist"}</div></label></aside>
        </div>
      </Modal>;
}
