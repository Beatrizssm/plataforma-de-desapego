/**
 * Tela Home - Listagem de Itens
 * Design conforme Figma
 */

import { useEffect, useState, useRef } from "react";
import { AppLayout } from "../../layout/AppLayout";
import { ItemCard } from "../../components/ItemCard";
import { CategoryFilter } from "../../components/CategoryFilter";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Compass, ChevronLeft, ChevronRight, Shirt, Sun, Sparkles, Footprints, ShoppingBag, Monitor, Sofa, WashingMachine } from "lucide-react";
import { itemService, Item } from "../../services/itemService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryScrollPosition, setCategoryScrollPosition] = useState(0);

  // Categorias disponíveis (pode vir do backend no futuro)
  const categories = ["Roupas", "Eletrônicos", "Móveis", "Livros", "Outros"];

  // Categorias com ícones para a barra horizontal
  const categoryItems = [
    { id: "roupa", name: "Roupa", icon: Shirt },
    { id: "acessorios", name: "Acessórios", icon: Sun },
    { id: "beleza", name: "Beleza", icon: Sparkles },
    { id: "calcados", name: "Calçados", icon: Footprints },
    { id: "bolsas", name: "Bolsas", icon: ShoppingBag },
    { id: "eletronicos", name: "Eletrônicos", icon: Monitor },
    { id: "moveis", name: "Móveis", icon: Sofa },
    { id: "eletro", name: "Eletro", icon: WashingMachine },
  ];

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      const newPosition = direction === "left" 
        ? categoryScrollPosition - scrollAmount 
        : categoryScrollPosition + scrollAmount;
      categoryScrollRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
      setCategoryScrollPosition(newPosition);
    }
  };

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const fetchedItems = await itemService.getAllItems();
        setItems(fetchedItems);
        setFilteredItems(fetchedItems);
      } catch (error: any) {
        toast.error("Erro ao carregar itens: " + (error.message || "Erro desconhecido"));
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...items];

    // Filtro de busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    // Filtro de categoria
    if (selectedCategory !== "all" && selectedCategory !== "available" && selectedCategory !== "unavailable") {
      // Aqui você pode implementar o filtro por categoria quando o backend suportar
      // Por enquanto, apenas filtra por disponibilidade
    }

    // Filtro de disponibilidade
    if (selectedCategory === "available") {
      filtered = filtered.filter((item) => item.available);
    } else if (selectedCategory === "unavailable") {
      filtered = filtered.filter((item) => !item.available);
    }

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedCategory]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Categorias */}
        <div className="mb-6 flex flex-col items-center">
          <h2 className="text-[#3A3A3A] text-lg font-semibold mb-2 text-center">Categorias</h2>
          <div className="border-t border-gray-300 mb-4 w-full max-w-4xl"></div>
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => scrollCategories("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div
              ref={categoryScrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide px-12 py-2 justify-center"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categoryItems.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(isSelected ? "all" : category.id)}
                    className={`flex flex-col items-center gap-2 min-w-[90px] p-2 rounded-lg transition-all ${
                      isSelected 
                        ? 'bg-[#5941F2] text-white shadow-md' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-white/20' : 'bg-white border border-gray-200'
                    }`}>
                      <IconComponent className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => scrollCategories("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-muted-foreground text-xs">
            {filteredItems.length} {filteredItems.length === 1 ? "item encontrado" : "itens encontrados"}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
          </div>
        )}

        {/* Items Grid */}
        {!loading && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm mb-3">
              Nenhum item encontrado com os filtros selecionados.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              variant="outline"
              className="border-primary-300 text-foreground hover:bg-muted"
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

