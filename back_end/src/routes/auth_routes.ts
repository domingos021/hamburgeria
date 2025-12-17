import { Router } from "express";
import {
  register,
  login,
  listUsers,
  updatePassword,
} from "../controllers/auth_controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", listUsers);
router.patch("/update-password", updatePassword);

export default router;
