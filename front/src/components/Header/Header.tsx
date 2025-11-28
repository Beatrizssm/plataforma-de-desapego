/**
 * Header/Navbar principal
 * Design conforme imagem
 */

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Search, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logout realizado com sucesso!");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar busca se necessário
    if (searchQuery.trim()) {
      navigate(`/home?search=${searchQuery}`);
    }
  };

  return (
    <header className="bg-[#5941F2] text-white shadow-medium sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/home" className="flex items-center no-underline hover:no-underline flex-shrink-0">
            <img 
              src="/Captura de tela 2025-11-28 005239.png" 
              alt="DESAPEGA" 
              className="h-14 w-auto"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
          </Link>

          {/* Barra de Busca - Centro */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-gray-900 placeholder:text-gray-400 border-0 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5941F2] hover:text-[#4a35d1] transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Links de Navegação - Direita */}
          <nav className="hidden md:flex items-center gap-4 flex-shrink-0">
            <Link
              to="/profile"
              className="text-white hover:text-white/80 transition-colors no-underline text-sm font-medium"
            >
              Perfil
            </Link>
            <Link
              to="/my-sales"
              className="text-white hover:text-white/80 transition-colors no-underline text-sm font-medium"
            >
              Minhas Compras
            </Link>
            <Link
              to="/my-sales"
              className="text-white hover:text-white/80 transition-colors no-underline text-sm font-medium"
            >
              Minhas Vendas
            </Link>
            <Link
              to="/support"
              className="text-white hover:text-white/80 transition-colors no-underline text-sm font-medium"
            >
              Suporte
            </Link>
            <button
              onClick={handleLogout}
              className="text-white hover:text-white/80 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => navigate("/profile")}
            className="md:hidden p-2 rounded-lg hover:bg-white/20"
          >
            <span className="text-sm">Menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
