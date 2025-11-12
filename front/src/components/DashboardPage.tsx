// src//DashboardPage.tsx
import { Sidebar } from "./Sidebar";
import { CardItem } from "./CardItem";
import { StatsCard } from "./StatsCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar itens do localStorage
    const items = JSON.parse(localStorage.getItem("myItems") || "[]");
    setMyItems(items);
    setLoading(false);
  }, []);

  const stats = [
    { title: "Itens Cadastrados", value: myItems.length, icon: "📦" },
    { title: "Reservados", value: myItems.filter(i => i.status === "reserved").length, icon: "📌" },
    { title: "Vendidos", value: myItems.filter(i => i.status === "sold").length, icon: "💰" },
    { title: "Doados", value: myItems.filter(i => i.status === "donated").length, icon: "✅" },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myItems.map(item => (
            <CardItem
              key={item.id}
              {...item}
              onClick={() => navigate(`/item/${item.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
