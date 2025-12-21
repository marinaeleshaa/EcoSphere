import { Schema, model, models, Document, Types } from "mongoose";

export interface IRecipe extends Document {
  userId: Types.ObjectId;
  ingredients: string[];
  recipeName: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prepTime: string;
  cookTime: string;
  steps: string[];
  tips: string;
  storage: string;
  sustainabilityNote: string;
  createdAt: Date;
}

const recipeSchema = new Schema<IRecipe>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ingredients: { type: [String], required: true },
    recipeName: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    prepTime: { type: String, required: true },
    cookTime: { type: String, required: true },
    steps: { type: [String], required: true },
    tips: { type: String, required: false },
    storage: { type: String, required: false },
    sustainabilityNote: { type: String, required: true },
  },
  { timestamps: true }
);

export const RecipeModel =
  models.Recipe || model<IRecipe>("Recipe", recipeSchema);
