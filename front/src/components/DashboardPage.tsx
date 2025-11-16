// src//DashboardPage.tsx
import { Sidebar } from "./Sidebar";
import { CardItem } from "./CardItem";
import { StatsCard } from "./StatsCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { itemService, Item } from "../services/itemService";
import { toast } from "sonner";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        // Buscar todos os itens e filtrar apenas os do usuário logado
        const allItems = await itemService.getAllItems();
        const userItems = allItems.filter(
          (item) => item.ownerId === user?.id
        );
        setMyItems(userItems);
      } catch (error: any) {
        toast.error("Erro ao carregar itens: " + (error.message || "Erro desconhecido"));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadItems();
    }
  }, [user]);

  const stats = [
    { title: "Itens Cadastrados", value: myItems.length, icon: "📦" },
    { title: "Disponíveis", value: myItems.filter(i => i.available).length, icon: "✅" },
    { title: "Indisponíveis", value: myItems.filter(i => !i.available).length, icon: "📌" },
    { title: "Total de Itens", value: myItems.length, icon: "💰" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F3E7]">
      <Sidebar currentPage="dashboard" onNavigate={(page) => navigate(`/${page}`)} />


      <main className="flex-1 p-6 md:p-8 relative">
        <h1 className="text-[#5A3825] text-3xl mb-2">Meu Painel</h1>
        <p className="text-[#8B5E3C] mb-8">Bem-vindo! Aqui estão suas estatísticas:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <StatsCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
          ))}
        </div>

        <h2 className="text-[#5A3825] text-xl mb-4">Meus Itens Recentes</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A3825]"></div>
          </div>
        ) : myItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#8B5E3C] mb-4">Você ainda não cadastrou nenhum item.</p>
            <button
              onClick={() => navigate("/add-item")}
              className="bg-[#5A3825] hover:bg-[#3A2B1D] text-[#F8F3E7] px-6 py-3 rounded-xl"
            >
              Criar Primeiro Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItems.map((item) => (
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
      </main>
    </div>
  );
}
