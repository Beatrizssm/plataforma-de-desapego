/**
 * Página de Dados da Conta
 * Design conforme imagem
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function AccountDataPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: user?.email || "hotmail@hotmail.com",
    phone: "(87) 99999-9999",
    password: "**********",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para salvar os dados
    toast.success("Dados salvos com sucesso!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Header */}
      <header className="bg-[#5941F2] text-white shadow-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <img 
              src="/Captura de tela 2025-11-28 005239.png" 
              alt="DESAPEGA" 
              className="h-14 w-auto"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-white/80 transition-colors text-sm"
            >
              Voltar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-[#F5F5F5]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-semibold text-[#3A3A3A] text-center mb-8">
            Dados da conta
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#3A3A3A] mb-2"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#5941F2] focus:border-transparent"
                placeholder="hotmail@hotmail.com"
              />
            </div>

            {/* Telefone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-[#3A3A3A] mb-2"
              >
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#5941F2] focus:border-transparent"
                placeholder="(87) 99999-9999"
              />
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#3A3A3A] mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#5941F2] focus:border-transparent"
                placeholder="**********"
              />
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-[#5941F2] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#4a35d1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5941F2] focus:ring-offset-2"
              >
                Salvar
              </button>
            </div>
          </form>
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
                  <Link to="/about" className="text-white hover:underline transition-colors">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link to="/creator" className="text-white hover:underline transition-colors">
                    Sobre o Criador
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ajuda */}
            <div>
              <h3 className="font-semibold mb-4">Ajuda</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/support" className="text-white hover:underline transition-colors">
                    Suporte
                  </Link>
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
          <div className="mt-6 pt-6 border-t border-white/20 text-center text-sm text-white/90">
            <p>© 2025 Beatriz. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

