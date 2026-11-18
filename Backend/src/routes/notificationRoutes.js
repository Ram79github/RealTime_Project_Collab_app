import express from "express";
import notificationController from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", notificationController.getNotifications);
router.get("/pending", notificationController.getPendingNotifications);
router.get("/unread-count", notificationController.getUnreadNotificationCount);
router.patch("/read-all", notificationController.markAllNotificationsRead);
router.patch("/:id/read", notificationController.markNotificationRead);

export default router;
