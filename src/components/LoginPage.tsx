import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Leaf, Mail, Lock } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    toast.success("Login realizado com sucesso!");
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F8F3E7] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#C9A77A] rounded-2xl shadow-2xl p-8 border-2 border-[#8B5E3C]">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#5A3825] p-4 rounded-full">
              <Leaf className="h-10 w-10 text-[#F8F3E7]" />
            </div>
          </div>

          <h2 className="text-center text-[#3A2B1D] mb-2">Bem-vindo de volta</h2>
          <p className="text-center text-[#5A3825] mb-8">
            Entre para continuar desapegando
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-[#3A2B1D]">
                E-mail
              </Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E3C]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white border-[#8B5E3C] text-[#3A2B1D] placeholder:text-[#C9A77A]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-[#3A2B1D]">
                Senha
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E3C]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="���•••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white border-[#8B5E3C] text-[#3A2B1D] placeholder:text-[#C9A77A]"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#5A3825] hover:bg-[#3A2B1D] text-[#F8F3E7] py-6 rounded-xl"
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#3A2B1D]">
              Não tem uma conta?{" "}
              <button
                onClick={() => onNavigate("register")}
                className="text-[#5A3825] hover:underline"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
