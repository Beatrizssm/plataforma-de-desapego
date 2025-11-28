import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

export function LoginRightPanel() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error: any) {
      // Erro já foi tratado no useAuth
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[40%] bg-[#F2B035] flex items-center justify-center min-h-screen">
      {/* Card de login */}
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md z-10 mx-8" style={{ fontFamily: "Montserrat, sans-serif" }}>
        <h2 className="text-3xl font-bold text-[#3A3A3A] mb-8">Entrar</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              id="email"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Input
              id="password"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={loading}
              variant="dark"
              className="px-[34px] py-3 text-xl font-medium"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#3A3A3A]">
            Não possui uma conta?{" "}
            <a
              href="#"
              className="font-bold text-[#5941F2] hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

