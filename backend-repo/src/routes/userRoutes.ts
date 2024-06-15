import { Router } from "express";
import {
  addData,
  fetchUserData,
  fetchUserDataById,
  loginUser,
  updateUserData,
} from "../controller/api";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.post("/login", loginUser)

router.post("/register", addData);

router.get("/fetch-user-data", fetchUserData);

router.get("/getData/:id", fetchUserDataById);

router.put('/update-user-data/:id', authMiddleware, updateUserData);

export default router;
