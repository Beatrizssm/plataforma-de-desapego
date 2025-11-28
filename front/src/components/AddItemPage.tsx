/**
 * Página de Adicionar Item
 * Design conforme imagem
 */

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { itemService } from "../services/itemService";
import { useAuth } from "../hooks/useAuth";
import { AppLayout } from "../layout/AppLayout";

type Category = "Roupa" | "Acessórios" | "Beleza" | "Calçado" | "Bolsa" | "Eletrônico" | "Móvel" | "Eletrodoméstico";
type BusinessType = "Venda" | "Doação" | "Troca";

export function AddItemPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [businessType, setBusinessType] = useState<BusinessType | "">("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > 5) {
      toast.error("Máximo de 5 fotos permitidas");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Criar previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !businessType) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (images.length < 2) {
      toast.error("Adicione no mínimo 2 fotos");
      return;
    }

    if (images.length > 5) {
      toast.error("Máximo de 5 fotos permitidas");
      return;
    }

    setLoading(true);
    try {
      // Por enquanto, usar a primeira imagem como imageUrl
      // Em produção, você faria upload das imagens para um serviço de storage
      const imageUrl = imagePreviews[0] || "";
      
      await itemService.createItem({
        title,
        description,
        price: businessType === "Doação" ? 0 : 100, // Preço padrão, pode ser ajustado
        available: true,
        imageUrl: imageUrl || undefined,
      });

      toast.success("Item criado com sucesso!");
      navigate("/home");
    } catch (error: any) {
      toast.error("Erro ao criar item: " + (error.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  const categories: Category[] = ["Roupa", "Acessórios", "Beleza", "Calçado", "Bolsa", "Eletrônico", "Móvel", "Eletrodoméstico"];

  return (
    <AppLayout showHeader={false} showFooter={false}>
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
        {/* Header */}
        <header className="bg-[#5941F2] text-white px-4 py-3 flex items-center justify-between">
          <img 
            src="/Captura de tela 2025-11-28 005239.png" 
            alt="DESAPEGA" 
            className="h-16 w-auto"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
            }}
          />
          <Button
            onClick={() => navigate("/home")}
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white/20"
          >
            Voltar
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
          <h1 className="text-xl font-bold text-[#3A3A3A] text-center mb-4">
            Adicionar novo item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome do produto */}
            <div>
              <Label htmlFor="title" className="text-[#3A3A3A] font-semibold mb-1 block text-sm">
                Nome do produto *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder=""
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#3A3A3A]"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="description" className="text-[#3A3A3A] font-semibold mb-1 block text-sm">
                Descrição *
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder=""
                rows={4}
                className="text-sm"
                required
              />
            </div>

            {/* Categoria */}
            <div>
              <Label className="text-[#3A3A3A] font-semibold mb-2 block text-sm">
                Categoria *
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 cursor-pointer p-2 bg-transparent rounded-lg border-none hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={category === cat}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-3.5 h-3.5 text-[#5941F2] focus:ring-[#5941F2]"
                      required
                    />
                    <span className="text-[#303030] text-sm font-medium">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fotos do produto */}
            <div>
              <Label className="text-[#3A3A3A] font-semibold mb-2 block text-sm">
                Fotos do produto *
              </Label>
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[140px] flex items-center justify-center">
                {imagePreviews.length === 0 ? (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center mx-auto mb-2 hover:bg-[#2A2A2A] transition-colors"
                    >
                      <Plus className="w-5 h-5 text-white" />
                    </button>
                    <p className="text-xs text-gray-500">Clique para adicionar fotos</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-2 w-full">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-16 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {imagePreviews.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#5941F2] transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Adicione no mínimo 2 fotos e no máximo 5
              </p>
            </div>

            {/* Tipo de negócio */}
            <div>
              <Label className="text-[#3A3A3A] font-semibold mb-2 block text-sm">
                Tipo de negócio *
              </Label>
              <div className="space-y-2">
                {(["Venda", "Doação", "Troca"] as BusinessType[]).map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-gray-300 hover:bg-[#F4F4F4] transition-colors"
                  >
                    <input
                      type="radio"
                      name="businessType"
                      value={type}
                      checked={businessType === type}
                      onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                      className="w-3.5 h-3.5 text-[#5941F2] focus:ring-[#5941F2]"
                      required
                    />
                    <span className="text-[#303030] text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Botão Adicionar */}
            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={loading}
                variant="default"
                className="px-6 py-2 text-sm font-normal"
              >
                {loading ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>
          </form>
        </main>

        {/* Footer */}
        <footer className="bg-[#5941F2] text-white px-6 py-8 mt-auto">
          <div className="max-w-7xl mx-auto">
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

              {/* Ajuda */}
              <div>
                <h3 className="font-semibold mb-4">Ajuda</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-white hover:underline">Suporte</a>
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
            <div className="mt-8 pt-6 border-t border-[#4a35d1] text-center text-sm">
              <p>© 2025 Beatriz. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </AppLayout>
  );
}
