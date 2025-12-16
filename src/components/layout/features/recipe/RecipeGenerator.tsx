"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { Loader2, Sparkles, ChefHat } from "lucide-react";
import { toast } from "sonner";
import RecipeCard from "./RecipeCard";
import { IRecipe } from "@/backend/features/recipe/recipe.model";

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: IRecipe) => void;
}

export default function RecipeGenerator({
  onRecipeGenerated,
}: Readonly<RecipeGeneratorProps>) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<IRecipe | null>(null);

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const tRecipes = useTranslations("Recipes");

  const handleGenerate = async () => {
    if (!input.trim()) return;

    // Convert comma-separated or newline-separated string to array
    const ingredients = input
      .split(/[\n,]/)
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    if (ingredients.length === 0) {
      toast.error(tRecipes("generator.toasts.emptyInput"));
      return;
    }

    try {
      setLoading(true);
      setGeneratedRecipe(null);

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const data = await res.json();
      setGeneratedRecipe(data.data);
      onRecipeGenerated(data.data);
      toast.success(tRecipes("generator.toasts.success"));
      setInput("");
    } catch (error) {
      toast.error(tRecipes("generator.toasts.error"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-card text-card-foreground border-border border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ChefHat className="text-primary w-6 h-6" />
          <h2 className="text-xl font-semibold">
            {tRecipes("generator.title")}
          </h2>
        </div>
        <p className="text-muted-foreground mb-4">
          {tRecipes("generator.description")}
        </p>

        <Textarea
          placeholder={tRecipes("generator.placeholder")}
          className="min-h-[100px] text-base resize-none bg-input text-input-foreground focus:ring-primary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="myBtnPrimary w-full md:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tRecipes("generator.generatingBtn")}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {tRecipes("generator.generateBtn")}
              </>
            )}
          </Button>
        </div>
      </div>

      {generatedRecipe && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-semibold mb-4">
            {tRecipes("generator.justForYou")}
          </h3>
          <RecipeCard recipe={generatedRecipe} />
        </div>
      )}
    </div>
  );
}
