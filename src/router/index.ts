import { Router } from "express";
import { test } from "../handlers/test";

const router = Router();

router.get("/", test);

export default router;
