/**
 * Filtro de Categorias
 * Design conforme Figma
 */

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === "all" ? "default" : "outline"}
        onClick={() => onSelectCategory("all")}
        className={
          selectedCategory === "all"
            ? "bg-primary-400 text-primary-50"
            : "border-border text-foreground hover:bg-muted"
        }
      >
        Todos
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
          className={
            selectedCategory === category
              ? "bg-primary-400 text-primary-50"
              : "border-border text-foreground hover:bg-muted"
          }
        >
          {category}
        </Button>
      ))}
    </div>
  );
}

