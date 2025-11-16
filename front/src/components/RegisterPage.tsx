import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Leaf, Mail, Lock, User, Phone, CreditCard, Home } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !email || !cpf || !password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    const cpfNumbers = cpf.replace(/\D/g, "");
    if (cpfNumbers.length !== 11) {
      toast.error("CPF inválido");
      return;
    }

    setLoading(true);
    try {
      // Registrar no backend (phone e cpf são opcionais no backend)
      await register(name, email, password);
      navigate("/dashboard");
    } catch (error: any) {
      // Erro já foi tratado no useAuth
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F3E7]">
      <Sidebar currentPage="register" onNavigate={(page) => navigate(`/${page}`)} />

      <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 border-2 border-[#C9A77A] shadow-md">
          <div className="mb-4">
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#EADDC7]"
            >
              <Home className="mr-2 h-4 w-4" />
              Voltar à página inicial
            </Button>
          </div>
          <div className="flex justify-center mb-6">
            <div className="bg-[#5A3825] p-4 rounded-full">
              <Leaf className="h-10 w-10 text-[#F8F3E7]" />
            </div>
          </div>

          <h2 className="text-center text-[#3A2B1D] mb-2">Crie sua conta</h2>
          <p className="text-center text-[#8B5E3C] mb-8">
            Junte-se à nossa comunidade sustentável
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-[#3A2B1D]">Nome completo</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E3C]" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D] placeholder:text-[#C9A77A]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-[#3A2B1D]">Telefone</Label>
              <div className="relative mt-2">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E3C]" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  maxLength={15}
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
              <Label htmlFor="cpf" className="text-[#3A2B1D]">CPF</Label>
              <div className="relative mt-2">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E3C]" />
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  maxLength={14}
                  className="pl-10 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D] placeholder:text-[#C9A77A]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-[#3A2B1D]">Senha</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E3C]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D] placeholder:text-[#C9A77A]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-[#3A2B1D]">Confirmar senha</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E3C]" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D] placeholder:text-[#C9A77A]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5A3825] hover:bg-[#3A2B1D] text-[#F8F3E7] py-6 rounded-xl disabled:opacity-50"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#3A2B1D]">
              Já tem uma conta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#5A3825] hover:underline"
              >
                Entrar
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
