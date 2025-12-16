import { getCurrentUser } from "@/backend/utils/authHelper";
import RecipesClient from "@/components/layout/features/recipe/RecipesClient";
import { redirect } from "next/navigation";
import { rootContainer } from "@/backend/config/container";
import RecipeController from "@/backend/features/recipe/recipe.controller";

export default async function RecipesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth"); // Or standard unauthorized page
  }

  // Fetch initial data directly from controller (Server Action style) to avoid HTTP loop
  const controller = rootContainer.resolve(RecipeController);
  const recipes = await controller.getAll(user.id);

  // Deep-clone data to make it safe for passing to a Client Component
  // structuredClone fails with Mongoose documents, so we use JSON serialization
  const serializedRecipes = JSON.parse(JSON.stringify(recipes));

  return <RecipesClient initialRecipes={serializedRecipes} userId={user.id} />;
}
