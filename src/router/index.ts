import { Router } from "express";
import { getRecipe, createRecipe } from "../handlers/recipe";

const router = Router();

router.get("/recipe", getRecipe);

router.post("/recipe", createRecipe);

export default router;
