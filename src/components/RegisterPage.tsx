import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Leaf, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("donor");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
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

    toast.success("Cadastro realizado com sucesso!");
    onNavigate("login");
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

          <h2 className="text-center text-[#3A2B1D] mb-2">Crie sua conta</h2>
          <p className="text-center text-[#5A3825] mb-8">
            Junte-se à nossa comunidade sustentável
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-[#3A2B1D]">
                Nome completo
              </Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E3C]" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-white border-[#8B5E3C] text-[#3A2B1D] placeholder:text-[#C9A77A]"
                />
              </div>
            </div>

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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white border-[#8B5E3C] text-[#3A2B1D] placeholder:text-[#C9A77A]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-[#3A2B1D]">
                Confirmar senha
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E3C]" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-white border-[#8B5E3C] text-[#3A2B1D] placeholder:text-[#C9A77A]"
                />
              </div>
            </div>

            <div>
              <Label className="text-[#3A2B1D] mb-3 block">Tipo de usuário</Label>
              <RadioGroup value={userType} onValueChange={setUserType}>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-[#8B5E3C]">
                  <RadioGroupItem value="donor" id="donor" />
                  <Label htmlFor="donor" className="text-[#3A2B1D] cursor-pointer flex-1">
                    Doador
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-[#8B5E3C] mt-2">
                  <RadioGroupItem value="interested" id="interested" />
                  <Label htmlFor="interested" className="text-[#3A2B1D] cursor-pointer flex-1">
                    Interessado
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#5A3825] hover:bg-[#3A2B1D] text-[#F8F3E7] py-6 rounded-xl"
            >
              Cadastrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#3A2B1D]">
              Já tem uma conta?{" "}
              <button
                onClick={() => onNavigate("login")}
                className="text-[#5A3825] hover:underline"
              >
                Entrar
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
