import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("João Silva");
  const [email, setEmail] = useState("joao.silva@email.com");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"donor" | "interested">("donor");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    toast.success("Perfil atualizado com sucesso!");
  };

  return (
    <div className="flex min-h-screen bg-[#F8F3E7]">
      <Sidebar currentPage="profile" onNavigate={(page) => navigate(`/${page}`)} />

      <main className="flex-1 md:ml-0 p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-[#5A3825] mb-2">Meu Perfil</h1>
            <p className="text-[#8B5E3C]">Gerencie suas informações pessoais</p>
          </div>

          <div className="bg-white rounded-2xl p-8 border-2 border-[#C9A77A] shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-[#C9A77A] overflow-hidden bg-[#EADDC7] flex items-center justify-center">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-[#8B5E3C] text-4xl">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-[#5A3825] text-[#F8F3E7] p-2 rounded-full cursor-pointer hover:bg-[#8B5E3C] transition-colors">
                    <Camera className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-[#3A2B1D]">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D]"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-[#3A2B1D]">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D]"
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-[#3A2B1D]">
                  Nova senha (deixe em branco para manter a atual)
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D]"
                />
              </div>

              {/* User Type */}
              <div>
                <Label className="text-[#3A2B1D] mb-3 block">Tipo de usuário</Label>
                <RadioGroup value={userType} onValueChange={setUserType}>
                  <div className="flex items-center space-x-2 bg-[#F8F3E7] p-4 rounded-lg border-2 border-[#C9A77A]">
                    <RadioGroupItem value="donor" id="donor" />
                    <Label htmlFor="donor" className="text-[#3A2B1D] cursor-pointer flex-1">
                      Doador
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-[#F8F3E7] p-4 rounded-lg border-2 border-[#C9A77A] mt-3">
                    <RadioGroupItem value="interested" id="interested" />
                    <Label htmlFor="interested" className="text-[#3A2B1D] cursor-pointer flex-1">
                      Interessado
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-[#5A3825] hover:bg-[#3A2B1D] text-[#F8F3E7] py-6 rounded-xl"
                >
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
