import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Upload, X } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AddItemPageProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function AddItemPage({ currentPage, onNavigate }: AddItemPageProps) {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [itemType, setItemType] = useState("donation");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName || !description || !category) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    toast.success("Item cadastrado com sucesso!");
    onNavigate("my-items");
  };

  return (
    <div className="flex min-h-screen bg-[#F8F3E7]">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      
      <main className="flex-1 md:ml-0 p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-[#5A3825] mb-2">Cadastrar Item</h1>
            <p className="text-[#8B5E3C]">
              Adicione um novo item para doação ou venda simbólica
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border-2 border-[#C9A77A] shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <Label className="text-[#3A2B1D] mb-3 block">Foto do item</Label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-[#C9A77A]"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute -top-2 -right-2 bg-[#C26D57] text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-32 h-32 rounded-full border-4 border-dashed border-[#C9A77A] flex items-center justify-center cursor-pointer hover:bg-[#EADDC7] transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Upload className="h-8 w-8 text-[#8B5E3C]" />
                    </label>
                  )}
                  <div className="text-[#8B5E3C] text-sm">
                    <p>Clique para fazer upload</p>
                    <p className="text-xs">PNG, JPG até 5MB</p>
                  </div>
                </div>
              </div>

              {/* Item Name */}
              <div>
                <Label htmlFor="itemName" className="text-[#3A2B1D]">
                  Nome do item *
                </Label>
                <Input
                  id="itemName"
                  type="text"
                  placeholder="Ex: Cadeira de madeira"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="mt-2 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D]"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-[#3A2B1D]">
                  Descrição *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o item, seu estado de conservação e características..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D] min-h-32"
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-[#3A2B1D]">
                  Categoria *
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-2 bg-[#F8F3E7] border-[#C9A77A] text-[#3A2B1D]">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roupas">Roupas</SelectItem>
                    <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                    <SelectItem value="moveis">Móveis</SelectItem>
                    <SelectItem value="livros">Livros</SelectItem>
                    <SelectItem value="brinquedos">Brinquedos</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Item Type */}
              <div>
                <Label className="text-[#3A2B1D] mb-3 block">Tipo *</Label>
                <RadioGroup value={itemType} onValueChange={setItemType}>
                  <div className="flex items-center space-x-2 bg-[#F8F3E7] p-4 rounded-lg border-2 border-[#C9A77A]">
                    <RadioGroupItem value="donation" id="donation" />
                    <Label htmlFor="donation" className="text-[#3A2B1D] cursor-pointer flex-1">
                      Doação (totalmente gratuito)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-[#F8F3E7] p-4 rounded-lg border-2 border-[#C9A77A] mt-3">
                    <RadioGroupItem value="symbolic" id="symbolic" />
                    <Label htmlFor="symbolic" className="text-[#3A2B1D] cursor-pointer flex-1">
                      Venda simbólica (valor mínimo)
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
                  Cadastrar Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
