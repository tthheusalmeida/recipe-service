import { Request, Response } from "express-serve-static-core";
import { RESPONSE_STATUS_CODE, MAX_RATING } from "../utils/constants";
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

export async function getRecipeRecent(req: Request, res: Response) {
  try {
    const { limit } = req.body;

    const recipes = await Recipe.find().sort({ createdAt: -1 }).limit(limit);

    res.status(200).json(recipes);
  } catch (error) {
    console.log("❌ Error: ", error);

    res.status(500).json({ error: "Is there something wrong!" });
  }
}

interface IRecipeFilter {
  type?: string;
  rating?: number;
  difficulty?: string;
}

export async function getRecipeFilter(
  req: Request<{}, {}, IRecipeFilter>,
  res: Response
) {
  try {
    const { type, rating, difficulty } = req.body;
    const query: any = {};

    if (type) {
      query.type = type;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    query.rating = { $lte: rating || MAX_RATING };

    const recipes = await Recipe.find(query);

    res.status(200).json(recipes);
  } catch (error) {
    console.error("❌ Error on filter:", error);

    res.status(500).json({ error: "Is there something wrong with filter!" });
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
