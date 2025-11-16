/**
 * Tela de Registro
 * Design conforme Figma
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Leaf, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/home");
    } catch (error: any) {
      // Erro já foi tratado no useAuth
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-accent rounded-2xl shadow-strong p-8 border-2 border-primary-300">
          {/* Back Button */}
          <Button
            onClick={() => navigate("/login")}
            variant="ghost"
            className="mb-4 text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-primary-400 p-4 rounded-full"
            >
              <Leaf className="h-10 w-10 text-primary-50" />
            </motion.div>
          </div>

          <h2 className="text-center text-foreground text-2xl font-bold mb-2">
            Crie sua conta
          </h2>
          <p className="text-center text-primary-300 mb-8 text-sm">
            Junte-se à nossa comunidade sustentável
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-foreground">
                Nome completo
              </Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-300" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-card border-primary-300 text-foreground placeholder:text-muted-foreground focus:border-primary-400 focus:ring-primary-400"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-foreground">
                E-mail
              </Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-card border-primary-300 text-foreground placeholder:text-muted-foreground focus:border-primary-400 focus:ring-primary-400"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground">
                Senha
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-300" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-card border-primary-300 text-foreground placeholder:text-muted-foreground focus:border-primary-400 focus:ring-primary-400"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirmar senha
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-300" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-card border-primary-300 text-foreground placeholder:text-muted-foreground focus:border-primary-400 focus:ring-primary-400"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-400 hover:bg-primary-500 text-primary-50 py-6 rounded-xl disabled:opacity-50 font-semibold text-base mt-6"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-foreground text-sm">
              Já tem uma conta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary-400 hover:text-primary-500 font-semibold transition-colors"
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

