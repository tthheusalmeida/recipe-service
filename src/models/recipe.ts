import { Schema, model, Document } from "mongoose";

enum RECIPE {
  BREAKFAST = "breakfast",
  ELEVENSENS = "elevensens",
  LUNCH = "lunch",
  TEA_TIME = "tea_time",
  DINNER = "dinner",
  SUPPER = "supper",
}

enum DIFFICULTY {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

interface IRecipe extends Document {
  name: string;
  images: string[];
  ingredients: string[];
  howToMake: string[];
  type:
    | RECIPE.BREAKFAST
    | RECIPE.ELEVENSENS
    | RECIPE.LUNCH
    | RECIPE.TEA_TIME
    | RECIPE.DINNER
    | RECIPE.SUPPER;
  difficulty: DIFFICULTY.EASY | DIFFICULTY.MEDIUM | DIFFICULTY.HARD;
  createdAt?: Date;
  updatedAt?: Date;
}

const recipeSchema = new Schema<IRecipe>(
  {
    name: { type: String, required: true },
    images: { type: [String], required: true },
    ingredients: { type: [String], required: true },
    howToMake: { type: [String], required: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(RECIPE),
    },
    difficulty: {
      type: String,
      enum: Object.values(DIFFICULTY),
    },
  },
  { timestamps: true }
);

const Recipe = model<IRecipe>("Recipe", recipeSchema);

export default Recipe;
