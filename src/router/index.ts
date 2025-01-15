import { Router } from "express";
import {
  getRecipe,
  getRecipeRecent,
  getRecipeFilter,
  updateRecipe,
  createRecipe,
} from "../handlers/recipe";
import { verifyPasskey } from "../handlers/authentication";

const router = Router();

router.get("/recipe", verifyPasskey, getRecipe);
router.get("/recipe/recent", verifyPasskey, getRecipeRecent);
router.get("/recipe/filter", verifyPasskey, getRecipeFilter);

router.patch("/recipe/update/:id", verifyPasskey, updateRecipe);

router.post("/recipe", verifyPasskey, createRecipe);

export default router;
