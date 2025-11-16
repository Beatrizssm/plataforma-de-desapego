/**
 * Tela de Detalhes do Item
 * Design conforme Figma
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../../layout/AppLayout";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft, Mail, Calendar, User, CheckCircle2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { itemService, Item } from "../../services/itemService";
import { useAuth } from "../../hooks/useAuth";

export function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      if (!id) {
        navigate("/home");
        return;
      }

      try {
        setLoading(true);
        const itemId = parseInt(id);
        if (isNaN(itemId)) {
          toast.error("ID de item inválido");
          navigate("/home");
          return;
        }

        const fetchedItem = await itemService.getItemById(itemId);
        setItem(fetchedItem);
        setIsOwner(user?.id === fetchedItem.ownerId);
      } catch (error: any) {
        toast.error("Erro ao carregar item: " + (error.message || "Item não encontrado"));
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, navigate, user]);

  const handleChat = () => {
    if (!user) {
      toast.error("Você precisa estar logado para iniciar um chat");
      navigate("/login");
      return;
    }
    navigate(`/chat/${id}`);
  };

  const handleMarkAsUnavailable = async () => {
    if (item && isOwner && id) {
      try {
        await itemService.updateItem(parseInt(id), { available: false });
        setItem({ ...item, available: false });
        toast.success("Item marcado como indisponível!");
      } catch (error: any) {
        toast.error("Erro ao atualizar item: " + (error.message || "Erro desconhecido"));
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading || !item) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando item...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/home")}
          variant="outline"
          className="mb-6 border-primary-300 text-foreground hover:bg-muted"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-card rounded-2xl overflow-hidden border-2 border-border shadow-medium">
            <img
              src={item.imageUrl || "https://via.placeholder.com/600x600?text=Sem+Imagem"}
              alt={item.title}
              className="w-full h-[500px] object-cover"
            />
          </div>

          {/* Details */}
          <div className="bg-card rounded-2xl p-8 border-2 border-border shadow-medium">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-foreground text-3xl font-bold">{item.title}</h1>
              <Badge
                className={
                  item.available
                    ? "bg-green-600 text-white"
                    : "bg-amber-600 text-white"
                }
              >
                {item.available ? "Disponível" : "Indisponível"}
              </Badge>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-primary-400 text-3xl font-bold">
                {formatPrice(item.price)}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-primary-400 mb-3 font-semibold text-lg">Descrição</h3>
              <p className="text-foreground leading-relaxed">{item.description}</p>
            </div>

            {/* Info */}
            <div className="space-y-4 mb-8 p-6 bg-background rounded-xl">
              <div className="flex items-center gap-3 text-foreground">
                <Calendar className="h-5 w-5 text-primary-300" />
                <span>Publicado em {new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>

            {/* Owner Info */}
            <div className="mb-8 p-6 bg-muted rounded-xl">
              <h3 className="text-primary-400 mb-4 font-semibold text-lg">Informações do Doador</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-foreground">
                  <User className="h-5 w-5 text-primary-300" />
                  <span className="font-semibold">{item.owner?.name || "Usuário"}</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Mail className="h-5 w-5 text-primary-300" />
                  <a
                    href={`mailto:${item.owner?.email || ""}`}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {item.owner?.email || "usuario@email.com"}
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {item.available && !isOwner && (
                <>
                  <Button
                    onClick={handleChat}
                    className="w-full bg-primary-400 hover:bg-primary-500 text-primary-50 py-6 rounded-xl font-semibold"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Iniciar Chat
                  </Button>
                </>
              )}

              {isOwner && item.available && (
                <Button
                  onClick={handleMarkAsUnavailable}
                  variant="outline"
                  className="w-full border-primary-300 text-foreground hover:bg-muted py-6 rounded-xl"
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Marcar como Indisponível
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

