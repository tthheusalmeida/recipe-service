import { Request, Response } from "express-serve-static-core";
import { RESPONSE_STATUS_CODE, MAX_RATING } from "../utils/constants";
import Recipe from "../models/recipe";

export async function getRecipe(req: Request, res: Response) {
  try {
    const recipes = await Recipe.find();

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      recipes,
    };

    res.status(RESPONSE_STATUS_CODE.OK).json(jsonResult);
  } catch (error) {
    console.log("❌ Error: ", error);

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      error: "Há algo errado!",
    };

    res.status(RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR).json(jsonResult);
  }
}

export async function getRecipeRecent(req: Request, res: Response) {
  try {
    const { limit } = req.query;

    const recipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      recipes,
    };

    res.status(RESPONSE_STATUS_CODE.OK).json(jsonResult);
  } catch (error) {
    console.log("❌ Error: ", error);

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      error: "Há algo errado!",
    };

    res.status(RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR).json(jsonResult);
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
    const { type, rating, difficulty } = req.query;
    const query: any = {};

    if (type) {
      query.type = type;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    query.rating = { $lte: rating || MAX_RATING };

    const recipes = await Recipe.find(query);

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      recipes,
    };

    res.status(RESPONSE_STATUS_CODE.OK).json(jsonResult);
  } catch (error) {
    console.error("❌ Error on filter:", error);

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      error: "Há algo errado com filtro!",
    };

    res.status(RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR).json(jsonResult);
  }
}

export async function updateRecipe(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      const jsonResult = {
        uri: `${req.baseUrl}${req.url}`,
        error: "Ausência do [id] da receita.",
      };

      res.sendStatus(RESPONSE_STATUS_CODE.BAD_REQUEST).json(jsonResult);
    }
    if (!req.body) {
      const jsonResult = {
        uri: `${req.baseUrl}${req.url}`,
        error: "Dados ausentes para atualização da receita",
      };

      res.sendStatus(RESPONSE_STATUS_CODE.BAD_REQUEST).json(jsonResult);
    }

    const currentRecipe: any = await Recipe.findById(id);

    if (!currentRecipe) {
      const jsonResult = {
        uri: `${req.baseUrl}${req.url}`,
        error: `Receita [${id}] não encontrada.`,
      };

      res.sendStatus(RESPONSE_STATUS_CODE.BAD_REQUEST).json(jsonResult);
    }

    Object.keys(req.body).forEach((key) => {
      if (Array.isArray(req.body[key])) {
        currentRecipe[key] = req.body[key];
      } else if (req.body[key] !== currentRecipe[key]) {
        currentRecipe[key] = req.body[key];
      }
    });

    await currentRecipe.save();

    console.log("✅ Recipe updated.");

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      message: "Receita atualizada",
    };

    res.status(RESPONSE_STATUS_CODE.OK).send(jsonResult);
  } catch (error) {
    console.error("Error trying to update recipe:", error);

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      error: "Erro ao atualizar a receita.",
    };

    res.status(RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR).send(jsonResult);
    throw error;
  }
}

export async function createRecipe(req: Request, res: Response) {
  if (!req.body) {
    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      error: "Ausência do [body]",
    };

    res.sendStatus(RESPONSE_STATUS_CODE.BAD_REQUEST).json(jsonResult);
  }

  try {
    const recipe = new Recipe(req.body.recipe);
    await recipe.save();

    console.log("✅ Recipe created.");

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      message: "Receita criada.",
    };

    res.status(RESPONSE_STATUS_CODE.OK).send(jsonResult);
  } catch (error) {
    console.log("❌ Error: ", error);

    const jsonResult = {
      uri: `${req.baseUrl}${req.url}`,
      error: "Erro ao tentar criar receita.",
    };

    res.status(RESPONSE_STATUS_CODE.BAD_REQUEST).json(jsonResult);
  }
}
