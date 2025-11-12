// src/components/AddItemPage.tsx
import React from "react";
import { Sidebar } from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

export function AddItemPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("outros");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      // Obter usuário atual
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      // Obter itens existentes
      const myItems = JSON.parse(localStorage.getItem("myItems") || "[]");
      
      // Criar novo item
      const newItem = {
        id: Date.now().toString(),
        title,
        description,
        image: image || "https://via.placeholder.com/500",
        category,
        location: location || "Não informado",
        status: "available",
        postedDate: new Date().toLocaleDateString("pt-BR"),
        donor: user ? {
          name: user.name,
          email: user.email,
        } : {
          name: "Usuário",
          email: "usuario@email.com",
        },
      };

      // Adicionar item
      myItems.push(newItem);
      localStorage.setItem("myItems", JSON.stringify(myItems));

      toast.success("Item adicionado!");
      navigate("/items");
    } catch (error: any) {
      toast.error("Erro ao adicionar item");
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
            <Label>Nome do Item *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label>Descrição *</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div>
            <Label>Categoria *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Roupas">Roupas</SelectItem>
                <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                <SelectItem value="Móveis">Móveis</SelectItem>
                <SelectItem value="Livros">Livros</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>URL da Imagem</Label>
            <Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label>Localização</Label>
            <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Cidade, Estado" />
          </div>
          <Button type="submit" disabled={loading} className="bg-[#5A3825] text-white mt-4 disabled:opacity-50">
            {loading ? "Adicionando..." : "Adicionar"}
          </Button>
        </form>
      </main>
    </div>
  );
}

