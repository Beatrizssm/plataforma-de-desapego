import { Package, PlusCircle, BookmarkCheck, History, User, Menu } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Package, label: "Meus Itens", value: "my-items" },
    { icon: PlusCircle, label: "Cadastrar Item", value: "add-item" },
    { icon: BookmarkCheck, label: "Reservas", value: "reservations" },
    { icon: History, label: "Histórico", value: "history" },
    { icon: User, label: "Perfil", value: "profile" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-20 left-4 z-40 bg-[#5A3825] text-[#F8F3E7] p-2 rounded-lg shadow-lg"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen bg-[#5A3825] text-[#F8F3E7] transition-all duration-300 z-30 ${
          isCollapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "translate-x-0 w-64"
        }`}
      >
        <div className="flex flex-col h-full pt-20 md:pt-4">
          {/* Toggle Button Desktop */}
          <button
            className="hidden md:flex justify-end px-4 py-2"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Menu Items */}
          <nav className="flex-1 px-3 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.value;

              return (
                <button
                  key={item.value}
                  onClick={() => onNavigate(item.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#8B5E3C] text-[#F8F3E7]"
                      : "hover:bg-[#8B5E3C]/50"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}
