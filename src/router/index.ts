import { Router } from "express";
import { getRecipe, createRecipe } from "../handlers/recipe";
import { verifyPasskey } from "../utils/authentication";

const router = Router();

router.get("/recipe", verifyPasskey, getRecipe);

router.post("/recipe", verifyPasskey, createRecipe);

export default router;
