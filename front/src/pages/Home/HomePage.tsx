/**
 * Tela Home - Listagem de Itens
 * Design conforme Figma
 */

import { useEffect, useState } from "react";
import { AppLayout } from "../../layout/AppLayout";
import { ItemCard } from "../../components/ItemCard";
import { CategoryFilter } from "../../components/CategoryFilter";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { itemService, Item } from "../../services/itemService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Categorias disponíveis (pode vir do backend no futuro)
  const categories = ["Roupas", "Eletrônicos", "Móveis", "Livros", "Outros"];

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

    // Filtro de categoria (se implementado no backend)
    // Por enquanto, não há categoria no backend

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground text-3xl font-bold mb-2">
            Explorar Itens
          </h1>
          <p className="text-muted-foreground">
            Descubra itens disponíveis para doação e adoção
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-2xl border-2 border-border shadow-soft p-6 mb-8">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-300" />
              <Input
                type="text"
                placeholder="Buscar itens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-primary-300 text-foreground placeholder:text-muted-foreground focus:border-primary-400 focus:ring-primary-400"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-primary-300 text-foreground hover:bg-muted"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Category Filter */}
          {showFilters && (
            <div className="pt-4 border-t border-border">
              <CategoryFilter
                categories={["available", "unavailable", ...categories]}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground text-sm">
            {filteredItems.length} {filteredItems.length === 1 ? "item encontrado" : "itens encontrados"}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
          </div>
        )}

        {/* Items Grid */}
        {!loading && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
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

