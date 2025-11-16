/**
 * Tela de Perfil
 * Design conforme Figma
 */

import { useEffect, useState } from "react";
import { AppLayout } from "../../layout/AppLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { ItemCard } from "../../components/ItemCard/ItemCard";
import { User, Mail, Package, Edit2, Save, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { itemService, Item } from "../../services/itemService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const allItems = await itemService.getAllItems();
        const userItems = allItems.filter((item) => item.ownerId === user?.id);
        setMyItems(userItems);
      } catch (error: any) {
        toast.error("Erro ao carregar itens: " + (error.message || "Erro desconhecido"));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadItems();
      setEditedName(user.name);
    }
  }, [user]);

  const handleSave = () => {
    // Aqui você pode implementar a atualização do perfil no backend
    toast.success("Perfil atualizado com sucesso!");
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logout realizado com sucesso!");
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground text-3xl font-bold mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações e itens</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-2 border-border shadow-medium">
              <div className="flex flex-col items-center mb-6">
                <div className="bg-primary-400 p-6 rounded-full mb-4">
                  <User className="h-12 w-12 text-primary-50" />
                </div>
                {isEditing ? (
                  <div className="w-full space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-foreground">
                        Nome
                      </Label>
                      <Input
                        id="name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="mt-2 border-primary-300 text-foreground"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        className="flex-1 bg-primary-400 hover:bg-primary-500 text-primary-50"
                        size="sm"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedName(user?.name || "");
                        }}
                        variant="outline"
                        className="flex-1 border-primary-300 text-foreground"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-foreground text-xl font-bold mb-2">
                      {user?.name || "Usuário"}
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{user?.email || ""}</span>
                    </div>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-primary-300 text-foreground hover:bg-muted"
                      size="sm"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </>
                )}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Itens Cadastrados</span>
                  <span className="text-foreground font-semibold">{myItems.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Itens Disponíveis</span>
                  <span className="text-foreground font-semibold">
                    {myItems.filter((i) => i.available).length}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full mt-4 border-destructive text-destructive hover:bg-destructive/10"
              >
                Sair da Conta
              </Button>
            </Card>
          </div>

          {/* My Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-foreground text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6" />
                Meus Itens
              </h2>
              <Button
                onClick={() => navigate("/add-item")}
                className="bg-primary-400 hover:bg-primary-500 text-primary-50"
              >
                Adicionar Item
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
              </div>
            ) : myItems.length === 0 ? (
              <Card className="p-12 text-center border-2 border-border">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-4">
                  Você ainda não cadastrou nenhum item.
                </p>
                <Button
                  onClick={() => navigate("/add-item")}
                  className="bg-primary-400 hover:bg-primary-500 text-primary-50"
                >
                  Criar Primeiro Item
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {myItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

