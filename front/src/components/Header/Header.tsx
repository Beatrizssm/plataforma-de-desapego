/**
 * Header/Navbar principal
 * Design conforme Figma
 */

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { 
  Home, 
  Package, 
  MessageSquare, 
  User, 
  LogOut,
  Plus,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logout realizado com sucesso!");
  };

  const navItems = [
    { path: "/home", label: "Início", icon: Home },
    { path: "/items", label: "Itens", icon: Package },
    { path: "/profile", label: "Perfil", icon: User },
  ];

  return (
    <header className="bg-primary-400 text-primary-50 shadow-medium sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Package className="h-6 w-6 text-primary-50" />
            </div>
            <span className="font-bold text-xl">Desapego</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-300 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={() => navigate("/add-item")}
              className="bg-primary-500 hover:bg-primary-500/90 text-primary-50"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-300/20">
              <User className="h-5 w-5" />
              <span className="text-sm">{user?.name || "Usuário"}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-primary-50 hover:bg-primary-300"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-300"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-300">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-300 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Button
                onClick={() => {
                  navigate("/add-item");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-primary-500 hover:bg-primary-500/90 text-primary-50 mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full text-primary-50 hover:bg-primary-300 mt-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

