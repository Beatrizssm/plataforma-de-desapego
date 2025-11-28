/**
 * Página "Minhas vendas / doações"
 * Design conforme imagem fornecida
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "../../components/ui/button";

interface SaleItem {
  id: string;
  date: string;
  type: "Doação" | "Venda";
  image: string;
  status: "Doado" | "Disponível";
  title: string;
  size?: string;
  buyer?: string;
}

export function MySalesPage() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<"sales" | "purchases">("sales");

  const items: SaleItem[] = [
    {
      id: "1",
      date: "7 de novembro",
      type: "Doação",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      status: "Doado",
      title: "Camisa Oversized | G",
      buyer: "Comprador"
    },
    {
      id: "2",
      date: "4 de setembro",
      type: "Venda",
      image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop",
      status: "Disponível",
      title: "Computador de mesa"
    }
  ];

  const handleViewChange = (view: "sales" | "purchases") => {
    setSelectedView(view);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
      {/* Header Customizado */}
      <header className="bg-[#5941F2] text-white shadow-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo no canto superior esquerdo */}
            <img 
              src="/Captura de tela 2025-11-28 005239.png" 
              alt="DESAPEGA" 
              className="h-16 w-auto"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />

            {/* Botão Voltar no canto superior direito */}
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="bg-white text-[#5941F2] border-white hover:bg-white/90"
            >
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Dropdown de Seleção */}
        <div className="mb-4 relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full max-w-md text-left text-xl font-bold text-[#3A3A3A] bg-transparent border-none cursor-pointer p-0"
          >
            <span>
              {selectedView === "sales" ? "Minhas vendas / doações" : "Minhas compras / trocas"}
            </span>
            {isDropdownOpen ? (
              <ChevronUp className="h-6 w-6 ml-2" />
            ) : (
              <ChevronDown className="h-6 w-6 ml-2" />
            )}
          </button>

          {/* Menu Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full max-w-md bg-white border-2 border-[rgba(48,48,48,0.2)] rounded-xl shadow-lg z-10">
              <button
                onClick={() => handleViewChange("purchases")}
                className={`w-full text-left px-3 py-2 text-sm ${
                  selectedView === "purchases"
                    ? "bg-[#F2F2F2] text-[#3A3A3A] font-semibold"
                    : "text-[#3A3A3A] hover:bg-gray-50"
                }`}
              >
                Minhas compras / trocas
              </button>
              <button
                onClick={() => handleViewChange("sales")}
                className={`w-full text-left px-3 py-2 text-sm border-t border-[rgba(48,48,48,0.1)] ${
                  selectedView === "sales"
                    ? "bg-[#F2F2F2] text-[#3A3A3A] font-semibold"
                    : "text-[#3A3A3A] hover:bg-gray-50"
                }`}
              >
                Minhas vendas / doações
              </button>
            </div>
          )}
        </div>

        {/* Cards de Itens */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border-2 border-[rgba(48,48,48,0.1)] shadow-sm p-4"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Informações da Data e Tipo */}
                <div className="flex items-center gap-2 text-xs text-[#3A3A3A] mb-3 md:mb-0 md:w-28">
                  <span>{item.date}</span>
                  <span className="text-[rgba(48,48,48,0.5)]">|</span>
                  <span>{item.type}</span>
                </div>

                {/* Imagem do Produto */}
                <div className="flex-shrink-0 flex items-center justify-center bg-white rounded-lg p-2">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-w-24 max-h-24 w-auto h-auto object-contain rounded-lg"
                  />
                </div>

                {/* Detalhes do Produto */}
                <div className="flex-1">
                  <div className="mb-2">
                    <span className={`text-[#5941F2] font-semibold mr-3`}>
                      {item.status}
                    </span>
                    <span className="text-[#3A3A3A] font-medium">
                      {item.title}
                    </span>
                  </div>

                  {item.buyer && (
                    <div className="text-xs text-[#3A3A3A] mb-3">
                      {item.buyer}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.status === "Doado" && (
                      <>
                        <button className="text-[#5941F2] hover:underline text-xs">
                          Enviar mensagem
                        </button>
                        <Button
                          variant="outline"
                          className="border-[#5941F2] text-[#5941F2] bg-white hover:bg-[#5941F2] hover:text-white"
                        >
                          Doar / Vender novamente
                        </Button>
                      </>
                    )}
                    {item.status === "Disponível" && (
                      <Button
                        variant="outline"
                        className="border-[#5941F2] text-[#5941F2] bg-white hover:bg-[#5941F2] hover:text-white"
                      >
                        Exibir produto
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer com logo no canto inferior direito */}
      <footer className="bg-[#5941F2] text-white mt-auto relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Conheça-nos */}
            <div>
              <h3 className="font-semibold mb-4">Conheça-nos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-white hover:underline transition-colors">
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:underline transition-colors">
                    Sobre o Criador
                  </a>
                </li>
              </ul>
            </div>

            {/* Ajuda */}
            <div>
              <h3 className="font-semibold mb-4">Ajuda</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-white hover:underline transition-colors">
                    Suporte
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Logo no canto inferior direito - posicionamento absoluto */}
          <div className="absolute bottom-12 right-4 sm:right-6 lg:right-8">
            <img 
              src="/ativo-1-10-1.png" 
              alt="DESAPEGA" 
              className="h-20 w-auto"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/90">
            <p>&copy; 2025 Beatriz. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

