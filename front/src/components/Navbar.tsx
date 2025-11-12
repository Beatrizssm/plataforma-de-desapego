import { Menu, X, Leaf } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface NavbarProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Início", value: "home" },
    { label: "Itens", value: "items" },
    { label: "Login", value: "login" },
    { label: "Cadastrar-se", value: "register" },
  ];

  const handleNavigation = (page: string) => {
    onNavigate?.(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b-2 border-[#C9A77A] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation("home")}>
            <div className="bg-[#5A3825] p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-[#F8F3E7]" />
            </div>
            <span className="text-[#5A3825] font-semibold text-lg">
              Plataforma de Desapegos
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavigation(item.value)}
                className={`text-[#3A2B1D] hover:text-[#8B5E3C] transition-colors ${
                  currentPage === item.value ? "text-[#8B5E3C] font-semibold" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#5A3825]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#EADDC7]">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavigation(item.value)}
                className={`block w-full text-left px-4 py-2 text-[#3A2B1D] hover:bg-[#F8F3E7] transition-colors ${
                  currentPage === item.value ? "bg-[#EADDC7] font-semibold" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
