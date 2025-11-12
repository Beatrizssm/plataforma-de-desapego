import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { HelpCircle, Mail, User, FileText } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function SupportPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !description) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, insira um email válido");
      return;
    }

    setLoading(true);
    try {
      // Obter solicitações existentes
      const requests = JSON.parse(localStorage.getItem("supportRequests") || "[]");
      
      // Criar nova solicitação
      const newRequest = {
        id: Date.now().toString(),
        name,
        email,
        description,
        status: "pendente",
        createdAt: new Date().toISOString(),
      };

      // Adicionar solicitação
      requests.push(newRequest);
      localStorage.setItem("supportRequests", JSON.stringify(requests));

      toast.success("Solicitação de suporte enviada com sucesso! Entraremos em contato em breve.");
      
      // Limpa o formulário
      setName("");
      setEmail("");
      setDescription("");
    } catch (error: any) {
      toast.error("Erro ao enviar solicitação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F3E7]">
      <Sidebar currentPage="support" onNavigate={(page) => navigate(`/${page}`)} />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border-2 border-[#C9A77A] shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#5A3825] p-3 rounded-full">
                <HelpCircle className="h-6 w-6 text-[#F8F3E7]" />
              </div>
              <div>
                <h1 className="text-[#3A2B1D] text-2xl font-bold">Suporte</h1>
                <p className="text-[#8B5E3C] text-sm">Entre em contato conosco</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-[#3A2B1D]">Nome</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E3C]" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D] placeholder:text-[#C9A77A]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-[#3A2B1D]">E-mail</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E3C]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D] placeholder:text-[#C9A77A]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-[#3A2B1D]">Descrição</Label>
                <div className="relative mt-2">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-[#8B5E3C]" />
                  <Textarea
                    id="description"
                    placeholder="Descreva sua dúvida ou problema..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="pl-10 pt-3 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D] placeholder:text-[#C9A77A] min-h-[150px]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5A3825] hover:bg-[#3A2B1D] text-[#F8F3E7] py-6 rounded-xl disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

