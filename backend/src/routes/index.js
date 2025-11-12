import { Router } from "express";
import userRoutes from "./userRoutes.js";
import itemRoutes from "./itemRoutes.js";
import authRoutes from "./authRoutes.js";
import chatRoutes from "./chatRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/items", itemRoutes);
router.use("/chat", chatRoutes);

export default router;

