/**
 * Página Fale conosco
 * Design conforme imagem
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";

export function SupportPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !description) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    toast.success("Mensagem enviada com sucesso!");
    setName("");
    setEmail("");
    setDescription("");
  };

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
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-[#3A3A3A] text-center mb-8">
          Fale conosco
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#3A3A3A] mb-2">
              Nome
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-[#3A3A3A]"
              required
            />
          </div>

          {/* E-mail */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#3A3A3A] mb-2">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-[#3A3A3A]"
              required
            />
          </div>

          {/* Descrição do problema */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#3A3A3A] mb-2">
              Descrição do problema
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=""
              rows={6}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-[#3A3A3A]"
              required
            />
          </div>

          {/* Botão Enviar */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-[#5941F2] hover:bg-[#4a35d1] text-white px-8 py-3 rounded-lg text-sm font-medium"
            >
              Enviar
            </Button>
          </div>
        </form>
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

            {/* Espaço vazio no meio */}
            <div></div>

            {/* Logo e Copyright */}
            <div className="flex flex-col items-center md:items-end -mt-4">
              <img 
                src="/ativo-1-10-1.png" 
                alt="DESAPEGA" 
                className="h-16 w-auto mb-4"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
              <p className="text-sm text-center md:text-right">
                © 2025 Beatriz. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
