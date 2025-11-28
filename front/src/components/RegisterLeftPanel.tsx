import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

export function RegisterLeftPanel() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !cpf || !email || !password || !confirmPassword) {
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
      navigate("/dashboard");
    } catch (error: any) {
      // Erro já foi tratado no useAuth
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[40%] bg-[#5941F2] flex items-center justify-center min-h-screen">
      {/* Card de registro */}
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md z-10 mx-8" style={{ fontFamily: "Montserrat, sans-serif" }}>
        <h2 className="text-3xl font-bold text-[#3A3A3A] mb-8 text-center">Cadastre-se</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              id="name"
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Input
              id="cpf"
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              maxLength={14}
              required
            />
          </div>

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
              minLength={6}
            />
          </div>

          <div>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="orange"
            className="w-full py-3 text-2xl font-medium"
          >
            {loading ? "Cadastrando..." : "Cadastre-se"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#3A3A3A]">
            Já possui uma conta?{" "}
            <a
              href="#"
              className="font-bold text-[#5941F2] hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

