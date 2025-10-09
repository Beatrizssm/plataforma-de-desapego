import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CardItem } from "./CardItem";
import { Badge } from "./ui/badge";

interface ItemsListPageProps {
  onNavigate: (page: string) => void;
}

export function ItemsListPage({ onNavigate }: ItemsListPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const items = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1626477357166-ed26f0e3f1cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2xvdGhpbmclMjByYWNrfGVufDF8fHx8MTc1OTk2MzAyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Camisetas Variadas",
      description: "Lote de camisetas em ótimo estado, diversas cores e tamanhos",
      status: "available" as const,
      category: "Roupas",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1654360057953-81305834dd30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwZGV2aWNlcyUyMGxhcHRvcHxlbnwxfHx8fDE3NTk5NjMwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Laptop Dell Inspiron",
      description: "Laptop Dell i5, 8GB RAM, funcionando perfeitamente",
      status: "reserved" as const,
      category: "Eletrônicos",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1702018706865-e5306a8fa007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBmdXJuaXR1cmUlMjBjaGFpcnxlbnwxfHx8fDE3NTk5NjMwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Cadeira de Madeira Artesanal",
      description: "Linda cadeira de madeira maciça, artesanal",
      status: "available" as const,
      category: "Móveis",
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1680537250732-6835b59c937e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFjayUyMGJvb2tzJTIwbGlicmFyeXxlbnwxfHx8fDE3NTk5NjMwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Coleção de Livros Clássicos",
      description: "Diversos livros de literatura clássica brasileira e mundial",
      status: "donated" as const,
      category: "Livros",
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1733809701005-0b1c0ad53c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGRvbmF0aW9uJTIwaXRlbXN8ZW58MXx8fHwxNzU5OTYzMDIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Itens de Decoração",
      description: "Vários itens de decoração vintage para sua casa",
      status: "available" as const,
      category: "Outros",
    },
    {
      id: "6",
      image: "https://images.unsplash.com/photo-1662070027900-7844087ea06d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwaG9tZSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTkyNDIxMHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Almofadas e Mantas",
      description: "Conjunto de almofadas e mantas confortáveis",
      status: "available" as const,
      category: "Outros",
    },
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category.toLowerCase() === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8F3E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-[#5A3825] mb-2">Explorar Itens</h1>
          <p className="text-[#8B5E3C]">
            Descubra itens disponíveis para doação e adoção
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl border-2 border-[#C9A77A] shadow-md mb-8">
          {/* Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E3C]" />
              <Input
                type="text"
                placeholder="Buscar itens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D]"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#EADDC7]"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#EADDC7]">
              <div>
                <label className="text-[#3A2B1D] text-sm mb-2 block">Categoria</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-[#F8F3E7] border-[#C9A77A]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="roupas">Roupas</SelectItem>
                    <SelectItem value="eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="móveis">Móveis</SelectItem>
                    <SelectItem value="livros">Livros</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[#3A2B1D] text-sm mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-[#F8F3E7] border-[#C9A77A]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="reserved">Reservado</SelectItem>
                    <SelectItem value="donated">Doado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <Badge className="bg-[#8B5E3C] text-white">
            {filteredItems.length} {filteredItems.length === 1 ? "item encontrado" : "itens encontrados"}
          </Badge>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <CardItem
              key={item.id}
              {...item}
              onClick={() => onNavigate("item-details")}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#8B5E3C] text-lg">
              Nenhum item encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
