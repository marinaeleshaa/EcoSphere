"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, Leaf, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IRecipe } from "@/backend/features/recipe/recipe.model";
import { motion } from "framer-motion";

interface RecipeCardProps {
  recipe: Partial<IRecipe>;
  onDelete?: (id: string) => void;
}

export default function RecipeCard({ recipe, onDelete }: Readonly<RecipeCardProps>) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow border-border bg-card text-card-foreground">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <Badge
              variant="outline"
              className={getDifficultyColor(recipe.difficulty)}
            >
              {recipe.difficulty}
            </Badge>
            {onDelete && recipe._id && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(String(recipe._id))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CardTitle className="text-xl mt-2">{recipe.recipeName}</CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Prep: {recipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span>Cook: {recipe.cookTime}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          {/* Sustainability Note */}
          <div className="bg-primary/10 p-3 rounded-lg flex gap-3 text-sm text-primary">
            <Leaf className="w-5 h-5 shrink-0" />
            <p>{recipe.sustainabilityNote}</p>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Instructions
            </h4>
            <ul className="space-y-2">
              {recipe.steps?.map((step, idx) => (
                <li
                  key={`${idx}-${step.substring(0, 10)}`}
                  className="text-sm leading-relaxed flex gap-2"
                >
                  <span className="font-bold text-primary shrink-0">
                    {idx + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Info */}
          <div className="mt-auto pt-4 flex gap-4 text-xs text-muted-foreground border-t">
            {recipe.tips && (
              <p>
                <strong>💡 Tip:</strong> {recipe.tips}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
