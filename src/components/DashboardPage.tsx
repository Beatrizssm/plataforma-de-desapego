import { Sidebar } from "./Sidebar";
import { StatsCard } from "./StatsCard";
import { Package, CheckCircle, BookmarkCheck, TrendingUp } from "lucide-react";
import { CardItem } from "./CardItem";

interface DashboardPageProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function DashboardPage({ currentPage, onNavigate }: DashboardPageProps) {
  const stats = [
    {
      icon: Package,
      title: "Itens Cadastrados",
      value: 12,
      color: "#8B5E3C",
    },
    {
      icon: BookmarkCheck,
      title: "Itens Reservados",
      value: 5,
      color: "#C9A77A",
    },
    {
      icon: CheckCircle,
      title: "Itens Doados",
      value: 8,
      color: "#5A3825",
    },
    {
      icon: TrendingUp,
      title: "Impacto Total",
      value: "25",
      color: "#EADDC7",
    },
  ];

  const myItems = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1626477357166-ed26f0e3f1cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2xvdGhpbmclMjByYWNrfGVufDF8fHx8MTc1OTk2MzAyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Camisetas Variadas",
      description: "Lote de camisetas em ótimo estado",
      status: "available" as const,
      category: "Roupas",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1654360057953-81305834dd30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwZGV2aWNlcyUyMGxhcHRvcHxlbnwxfHx8fDE3NTk5NjMwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Laptop Dell",
      description: "Laptop Dell i5, 8GB RAM",
      status: "reserved" as const,
      category: "Eletrônicos",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1680537250732-6835b59c937e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFjayUyMGJvb2tzJTIwbGlicmFyeXxlbnwxfHx8fDE3NTk5NjMwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Livros Clássicos",
      description: "Diversos títulos da literatura",
      status: "donated" as const,
      category: "Livros",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F3E7]">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      
      <main className="flex-1 md:ml-0">
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-[#5A3825] mb-2">Meu Painel</h1>
            <p className="text-[#8B5E3C]">
              Bem-vindo de volta! Veja suas estatísticas e itens.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* My Items */}
          <div className="mb-8">
            <h2 className="text-[#5A3825] mb-6">Meus Itens Recentes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map((item) => (
                <CardItem
                  key={item.id}
                  {...item}
                  onClick={() => onNavigate("item-details")}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
