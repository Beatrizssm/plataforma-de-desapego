// src/components/AddItemPage.tsx
import React from "react";
import { Sidebar } from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { itemService } from "../services/itemService";
import { useAuth } from "../hooks/useAuth";

export function AddItemPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (description.length < 10) {
      toast.error("A descrição deve ter no mínimo 10 caracteres");
      return;
    }

    if (title.length < 3) {
      toast.error("O título deve ter no mínimo 3 caracteres");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("O preço deve ser um número positivo");
      return;
    }

    setLoading(true);
    try {
      await itemService.createItem({
        title,
        description,
        price: priceNum,
        available: true,
        imageUrl: imageUrl || undefined,
      });

      toast.success("Item criado com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Erro ao criar item: " + (error.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F3E7]">
      <Sidebar currentPage="add-item" onNavigate={(page) => navigate(`/${page}`)} />
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-[#5A3825] text-3xl mb-4">Adicionar Item</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <Label>Título do Item *</Label>
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Camiseta Azul"
              required 
              minLength={3}
            />
            <p className="text-xs text-[#8B5E3C] mt-1">Mínimo de 3 caracteres</p>
          </div>
          <div>
            <Label>Descrição *</Label>
            <Textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Descreva o item em detalhes..."
              required 
              minLength={10}
              rows={5}
            />
            <p className="text-xs text-[#8B5E3C] mt-1">Mínimo de 10 caracteres</p>
          </div>
          <div>
            <Label>Preço *</Label>
            <Input 
              type="number"
              step="0.01"
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              placeholder="0.00"
              required 
              min="0"
            />
            <p className="text-xs text-[#8B5E3C] mt-1">Valor em reais (R$)</p>
          </div>
          <div>
            <Label>URL da Imagem</Label>
            <Input 
              value={imageUrl} 
              onChange={e => setImageUrl(e.target.value)} 
              placeholder="https://exemplo.com/imagem.jpg" 
              type="url"
            />
            <p className="text-xs text-[#8B5E3C] mt-1">Opcional - URL da imagem do item</p>
          </div>
          <Button type="submit" disabled={loading} className="bg-[#5A3825] text-white mt-4 disabled:opacity-50">
            {loading ? "Criando..." : "Criar Item"}
          </Button>
        </form>
      </main>
    </div>
  );
}

