// Sidebar.tsx
import { Page } from "./types"; 
import { useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, PlusCircle, Package, History, BarChart3, User, Leaf, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const menuItems = [
  { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
  { id: "add-item" as Page, label: "Adicionar Item", icon: PlusCircle },
  { id: "items" as Page, label: "Meus Itens", icon: Package },
  { id: "history" as Page, label: "Histórico", icon: History },
  { id: "stats" as Page, label: "Estatísticas", icon: BarChart3 },
  { id: "profile" as Page, label: "Perfil", icon: User },
  { id: "support" as Page, label: "Suporte", icon: HelpCircle },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpar qualquer estado de autenticação do localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r-2 border-[#C9A77A] p-6 flex flex-col h-screen shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b-2 border-[#EADDC7]">
        <div className="bg-[#5A3825] p-2 rounded-lg">
          <Leaf className="h-6 w-6 text-[#F8F3E7]" />
        </div>
        <div>
          <h2 className="text-[#5A3825] font-bold text-lg">Desapego</h2>
          <p className="text-[#8B5E3C] text-xs">Plataforma</p>
        </div>
      </div>

      {/* Menu Items */}
      <ul className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#5A3825] text-[#F8F3E7] shadow-md"
                    : "text-[#3A2B1D] hover:bg-[#EADDC7] hover:text-[#5A3825]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      
      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t-2 border-[#EADDC7]">
        <Button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 py-3 rounded-xl"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
