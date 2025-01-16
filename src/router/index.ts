import { Router } from "express";
import {
  getRecipe,
  getRecipeRecent,
  getRecipeFilter,
  updateRecipe,
  createRecipe,
} from "../handlers/recipe";
import { rateLimiterUser, authUser } from "../handlers/login";
import { verifyPasskey } from "../handlers/authentication";

const router = Router();

router.get("/recipe", verifyPasskey, getRecipe);
router.get("/recipe/recent", verifyPasskey, getRecipeRecent);
router.get("/recipe/filter", verifyPasskey, getRecipeFilter);

router.patch("/recipe/update/:id", verifyPasskey, updateRecipe);

router.post("/recipe/create", verifyPasskey, createRecipe);
router.post("/login", verifyPasskey, rateLimiterUser, authUser);

export default router;
