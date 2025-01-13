import { Router } from "express";
import {
  getRecipe,
  getRecipeRecent,
  getRecipeFilter,
  createRecipe,
} from "../handlers/recipe";
import { verifyPasskey } from "../utils/authentication";

const router = Router();

router.get("/recipe", verifyPasskey, getRecipe);
router.get("/recipe/recent", verifyPasskey, getRecipeRecent);
router.get("/recipe/filter", verifyPasskey, getRecipeFilter);

router.post("/recipe", verifyPasskey, createRecipe);

export default router;
