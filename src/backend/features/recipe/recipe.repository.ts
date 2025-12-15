import { injectable } from "tsyringe";
import { DBInstance } from "@/backend/config/dbConnect";
import { IRecipe, RecipeModel } from "./recipe.model";
import { Types } from "mongoose";

export interface IRecipeRepository {
  create(recipeData: Partial<IRecipe>): Promise<IRecipe>;
  findByUserId(userId: string): Promise<IRecipe[]>;
  findById(recipeId: string): Promise<IRecipe | null>;
  deleteById(recipeId: string, userId: string): Promise<IRecipe | null>;
}

@injectable()
export class RecipeRepository implements IRecipeRepository {
  async create(recipeData: Partial<IRecipe>): Promise<IRecipe> {
    await DBInstance.getConnection();
    const recipe = new RecipeModel(recipeData);
    return await recipe.save();
  }

  async findByUserId(userId: string): Promise<IRecipe[]> {
    await DBInstance.getConnection();
    return await RecipeModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findById(recipeId: string): Promise<IRecipe | null> {
    await DBInstance.getConnection();
    return await RecipeModel.findById(recipeId).exec();
  }

  async deleteById(recipeId: string, userId: string): Promise<IRecipe | null> {
    await DBInstance.getConnection();
    return await RecipeModel.findOneAndDelete({
      _id: recipeId,
      userId,
    }).exec();
  }
}
