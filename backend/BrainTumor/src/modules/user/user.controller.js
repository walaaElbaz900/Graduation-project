import { profile } from "console";
import { Router } from "express";
const router = Router();
router.get("/profile" , profile)
export default router