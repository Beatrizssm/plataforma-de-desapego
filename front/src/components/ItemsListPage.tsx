// src/components/ItemsListPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CardItem } from "./CardItem";
import { Badge } from "./ui/badge";
import { Sidebar } from "./Sidebar";
import { itemService, Item } from "../services/itemService";
import { toast } from "sonner";

// Lista de itens fixos
const fixedItems = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1626477357166-ed26f0e3f1cc",
    title: "Camisetas Variadas",
    description: "Lote de camisetas em ótimo estado, diversas cores e tamanhos.",
    status: "available" as const,
    category: "Roupas",
    location: "São Paulo, SP",
    postedDate: "10 de Janeiro, 2025",
    donor: {
      name: "João Silva",
      email: "joao.silva@email.com",
    },
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1654360057953-81305834dd30",
    title: "Laptop Dell Inspiron",
    description: "Laptop Dell i5, 8GB RAM, funcionando perfeitamente.",
    status: "reserved" as const,
    category: "Eletrônicos",
    location: "Rio de Janeiro, RJ",
    postedDate: "08 de Janeiro, 2025",
    donor: {
      name: "Ana Costa",
      email: "ana.costa@email.com",
    },
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1702018706865-e5306a8fa007",
    title: "Cadeira de Madeira Artesanal",
    description: "Linda cadeira de madeira maciça, feita artesanalmente.",
    status: "available" as const,
    category: "Móveis",
    location: "São Paulo, SP",
    postedDate: "05 de Outubro, 2024",
    donor: {
      name: "Maria Silva",
      email: "maria.silva@email.com",
    },
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1680537250732-6835b59c937e",
    title: "Coleção de Livros Clássicos",
    description: "Diversos livros de literatura clássica brasileira e mundial.",
    status: "donated" as const,
    category: "Livros",
    location: "Belo Horizonte, MG",
    postedDate: "15 de Dezembro, 2024",
    donor: {
      name: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
    },
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1733809701005-0b1c0ad53c90",
    title: "Itens de Decoração",
    description: "Vários itens de decoração vintage para sua casa.",
    status: "available" as const,
    category: "Outros",
    location: "Curitiba, PR",
    postedDate: "20 de Janeiro, 2025",
    donor: {
      name: "Patricia Santos",
      email: "patricia.santos@email.com",
    },
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1662070027900-7844087ea06d",
    title: "Almofadas e Mantas",
    description: "Conjunto de almofadas e mantas confortáveis para decorar sua casa.",
    status: "available" as const,
    category: "Outros",
    location: "Porto Alegre, RS",
    postedDate: "12 de Janeiro, 2025",
    donor: {
      name: "Roberto Lima",
      email: "roberto.lima@email.com",
    },
  },
];

export function ItemsListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar itens do backend
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const fetchedItems = await itemService.getAllItems();
        setAllItems(fetchedItems);
      } catch (error: any) {
        toast.error("Erro ao carregar itens: " + (error.message || "Erro desconhecido"));
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Aplicar filtros e busca
  useEffect(() => {
    let filtered = [...allItems];

    // Filtro de disponibilidade
    if (statusFilter === "available") {
      filtered = filtered.filter(item => item.available);
    } else if (statusFilter === "reserved") {
      filtered = filtered.filter(item => !item.available);
    }

    // Filtro de categoria (se implementado no backend)
    // Por enquanto, não há categoria no backend, então ignoramos

    // Busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    setItems(filtered);
  }, [allItems, statusFilter, categoryFilter, searchQuery]);

  return (
    <div className="flex min-h-screen bg-[#F8F3E7]">
      <Sidebar currentPage="items" onNavigate={(page) => navigate(`/${page}`)} />
      <div className="flex-1 p-6 md:p-8">
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
                    <SelectItem value="sold">Vendido</SelectItem>
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
            {items.length} {items.length === 1 ? "item encontrado" : "itens encontrados"}
          </Badge>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-[#8B5E3C] text-lg">Carregando itens...</p>
          </div>
        )}

        {/* Items Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <CardItem
                key={item.id}
                id={item.id.toString()}
                image={item.imageUrl || "https://via.placeholder.com/300"}
                title={item.title}
                description={item.description}
                status={item.available ? "available" : "reserved"}
                category=""
                location=""
                postedDate={new Date(item.createdAt).toLocaleDateString("pt-BR")}
                donor={item.owner}
                onClick={() => navigate(`/item/${item.id}`)}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && items.length === 0 && (
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
