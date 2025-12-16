"use client";
import { useState } from "react";
import { IRecipe } from "@/backend/features/recipe/recipe.model";
import RecipeGenerator from "./RecipeGenerator";
import RecipeCard from "./RecipeCard";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { Button } from "@/components/ui/button";

interface RecipesClientProps {
  initialRecipes: IRecipe[];
  userId: string;
}

const ITEMS_PER_PAGE = 2;

export default function RecipesClient({
  initialRecipes,
}: Readonly<RecipesClientProps>) {
  const [recipes, setRecipes] = useState<IRecipe[]>(initialRecipes);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCookbookOpen, setIsCookbookOpen] = useState(true);

  const totalPages = Math.ceil(recipes.length / ITEMS_PER_PAGE);
  const currentRecipes = recipes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRecipeGenerated = (newRecipe: IRecipe) => {
    setRecipes((prev) => [newRecipe, ...prev]);
    setCurrentPage(1);
    setIsCookbookOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/recipes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setRecipes((prev) => {
        const newRecipes = prev.filter((r) => String(r._id) !== id);
        // Adjust current page if empty
        if (
          currentPage > 1 &&
          Math.ceil(newRecipes.length / ITEMS_PER_PAGE) < currentPage
        ) {
          setCurrentPage((p) => p - 1);
        }
        return newRecipes;
      });
      toast.success("Recipe deleted");
    } catch (error) {
      toast.error("Could not delete recipe");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container py-10 max-w-5xl mx-auto space-y-12">
      {/* Hero / Generator Section */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Zero-Waste Chef 🍳
        </h1>
        <p className="text-lg text-muted-foreground">
          Turn your leftovers into gourmet meals. Save money, save the planet.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <RecipeGenerator onRecipeGenerated={handleRecipeGenerated} />
      </div>

      {/* Saved Recipes List - Collapsible Cookbook */}
      <div className="border rounded-2xl bg-card text-card-foreground shadow-sm overflow-hidden">
        <div
          className="p-6 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
          onClick={() => setIsCookbookOpen(!isCookbookOpen)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsCookbookOpen(!isCookbookOpen);
            }
          }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Your Cookbook</h2>
              <p className="text-sm text-muted-foreground">
                {recipes.length} recipes saved
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            tabIndex={-1}
          >
            {isCookbookOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>

        <AnimatePresence initial={false}>
          {isCookbookOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0 border-t">
                {recipes.length === 0 ? (
                  <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed mt-6">
                    <p className="text-muted-foreground">
                      No recipes yet. Start cooking above! 👆
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AnimatePresence mode="wait">
                        {currentRecipes.map((recipe) => (
                          <motion.div
                            key={String(recipe._id)}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="relative"
                          >
                            <RecipeCard
                              recipe={recipe}
                              onDelete={
                                deletingId === String(recipe._id)
                                  ? undefined
                                  : handleDelete
                              }
                            />
                            {deletingId === String(recipe._id) && (
                              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-xl z-10 backdrop-blur-sm">
                                <Loader2 className="w-8 h-8 animate-spin text-destructive" />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
