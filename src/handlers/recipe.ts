import { Request, Response } from "express-serve-static-core";
import { RESPONSE_STATUS_CODE } from "../utils/constants";
import Recipe from "../models/recipe";

export async function getRecipe(req: Request, res: Response) {
  try {
    const recipes = await Recipe.find();

    res.status(200).json(recipes);
  } catch (error) {
    console.log("❌ Error: ", error);

    res.status(500).json({ error: "Is there something wrong!" });
  }
}

export async function createRecipe(req: Request, res: Response) {
  if (!req.body) {
    res.sendStatus(RESPONSE_STATUS_CODE.BAD_REQUEST);
  }

  try {
    const recipe = new Recipe(req.body);
    await recipe.save();

    console.log("✅ Recipe created.");

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      result: "Recipe created!",
    };

    res.status(RESPONSE_STATUS_CODE.OK).send(jsonResult);
  } catch (error) {
    console.log("❌ Error: ", error);

    res
      .status(RESPONSE_STATUS_CODE.BAD_REQUEST)
      .json({ error: "Is there something wrong!" });
  }
}
