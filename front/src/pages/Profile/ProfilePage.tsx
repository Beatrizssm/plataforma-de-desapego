/**
 * Tela de Perfil
 * Design conforme imagem
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { User, FileText, Clock, Plus, Headphones, Edit2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { itemService, Item } from "../../services/itemService";
import { toast } from "sonner";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const allItems = await itemService.getAllItems();
        const userItems = allItems.filter((item) => item.ownerId === user?.id);
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

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logout realizado com sucesso!");
  };

  const actionCards = [
    {
      id: 1,
      icon: FileText,
      title: "Informações pessoais",
      description: "Informações sobre seus documentos e sua conta.",
      onClick: () => navigate("/account-data"),
    },
    {
      id: 2,
      icon: Clock,
      title: "Histórico de itens",
      description: "Itens que você comprou, doou, trocou ou recebeu.",
      onClick: () => navigate("/my-sales"),
    },
    {
      id: 3,
      icon: Plus,
      title: "Adicionar item",
      description: "Adicione novos itens para venda, doação ou troca.",
      onClick: () => navigate("/add-item"),
    },
    {
      id: 4,
      icon: Headphones,
      title: "Suporte",
      description: "Como podemos te ajudar?",
      onClick: () => navigate("/support"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Header */}
      <header className="bg-[#5941F2] text-white shadow-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <img 
              src="/Captura de tela 2025-11-28 005239.png" 
              alt="DESAPEGA" 
              className="h-16 w-auto"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="text-white hover:text-white/80 transition-colors text-sm"
              >
                Voltar
              </button>
              <button
                onClick={handleLogout}
                className="text-white hover:text-white/80 transition-colors text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Summary */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#5941F2] flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
              <Edit2 className="h-4 w-4 text-[#5941F2]" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#3A3A3A] mb-1">
              {user?.name || "Nome Completo"}
            </h1>
            <p className="text-base text-[#3A3A3A]">
              {user?.email || "hotmail@hotmail.com"}
            </p>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {actionCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Card
                key={card.id}
                onClick={card.onClick}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#F5F5F5] p-3 rounded-lg">
                    <IconComponent className="h-6 w-6 text-[#5941F2]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#3A3A3A] mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-[#3A3A3A]">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#5941F2] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Conheça-nos */}
            <div>
              <h3 className="font-semibold mb-4">Conheça-nos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-white hover:underline">Sobre nós</a>
                </li>
                <li>
                  <a href="#" className="text-white hover:underline">Sobre o Criador</a>
                </li>
              </ul>
            </div>

            {/* Ajuda */}
            <div>
              <h3 className="font-semibold mb-4">Ajuda</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-white hover:underline">Suporte</a>
                </li>
              </ul>
            </div>

            {/* Logo */}
            <div className="flex items-center justify-center md:justify-end -mt-4">
              <img 
                src="/ativo-1-10-1.png" 
                alt="DESAPEGA" 
                className="h-16 w-auto"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-[#4a35d1] text-center text-sm">
            <p>© 2025 Beatriz. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
