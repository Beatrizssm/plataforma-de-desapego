import { Router } from "express";
import { register, login, changePasswordController } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", authenticateToken, changePasswordController);

export default router;

