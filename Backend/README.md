# Done 


# Task attachments and notifications

These endpoints use the existing PostgreSQL connection and Cloudinary credentials.
No database migration is included; create or verify the tables below before enabling
the feature.

## Task attachments

- `GET /api/tasks/:taskId/attachments`
- `POST /api/tasks/:taskId/attachments` — multipart form field `files`, up to five
  files, 10 MB per file
- `DELETE /api/tasks/:taskId/attachments/:attachmentId` — uploader only

Allowed types: JPEG, PNG, WebP, AVIF, PDF, TXT, CSV, DOC/DOCX, XLS/XLSX, and
PPT/PPTX. Attachments are stored in Cloudinary's `task-attachments` folder.

Expected `task_attachments` columns: `id`, `task_id`, `uploaded_by`,
`original_name`, `file_url`, `public_id`, `mime_type`, `file_size`,
`resource_type`, and `created_at`. `id` is returned by inserts; `task_id` and
`uploaded_by` must reference existing tasks and users.

## Pending notifications

- `GET /api/notifications?limit=20&offset=0` — current user's notifications
- `GET /api/notifications/pending?limit=20&offset=0` — unread notifications
- `GET /api/notifications/unread-count`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`

Notifications are created when a task is assigned to another user or reassigned.
Expected `notifications` columns: `id`, `user_id`, `actor_id`, `task_id`,
`project_id`, `type`, `message`, `is_read`, and `created_at`. The user-scoped
routes do not expose another user's notifications.

## Socket.IO events

Connect with the user's JWT in Socket.IO `auth.token` to receive user-scoped
notifications. Existing project room behavior is unchanged.

- `task_created`, `task_updated`, `task_deleted`
- `comment_added`, `comment_updated`, `comment_deleted`
- `member_added`, `member_updated`, `member_removed`
- `notification_created`, `notification_read`, `notifications_read_all`
- `attachment_added`, `attachment_deleted` (sent to the task's project room)