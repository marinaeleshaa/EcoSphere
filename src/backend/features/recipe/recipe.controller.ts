import { injectable, inject } from "tsyringe";
import type { IRecipeService } from "./recipe.service";
import { IRecipe } from "./recipe.model";

@injectable()
export default class RecipeController {
  constructor(
    @inject("RecipeService") private readonly recipeService: IRecipeService
  ) {}

  async generate(userId: string, ingredients: string[]): Promise<IRecipe> {
    return await this.recipeService.generateAndSaveRecipe(userId, ingredients);
  }

  async getAll(userId: string): Promise<IRecipe[]> {
    return await this.recipeService.getUserRecipes(userId);
  }

  async delete(recipeId: string, userId: string): Promise<boolean> {
    return await this.recipeService.deleteRecipe(recipeId, userId);
  }
}
