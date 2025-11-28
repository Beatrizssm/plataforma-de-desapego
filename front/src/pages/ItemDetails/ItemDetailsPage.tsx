/**
 * Tela de Detalhes do Item
 * Design conforme imagem
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../../layout/AppLayout";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Star, ChevronLeft, ChevronRight, User, Search, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { itemService, Item } from "../../services/itemService";
import { useAuth } from "../../hooks/useAuth";
import { ItemCard } from "../../components/ItemCard/ItemCard";

export function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [similarItems, setSimilarItems] = useState<Item[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSimilarIndex, setCurrentSimilarIndex] = useState(0);
  const [currentRecommendedIndex, setCurrentRecommendedIndex] = useState(0);

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

        // Carregar itens similares e recomendados
        const allItems = await itemService.getAllItems();
        const filtered = allItems.filter(i => i.id !== itemId && i.available);
        setSimilarItems(filtered.slice(0, 4));
        setRecommendedItems(filtered.slice(0, 4));
      } catch (error: any) {
        toast.error("Erro ao carregar item: " + (error.message || "Item não encontrado"));
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const handleChat = () => {
    if (!user) {
      toast.error("Você precisa estar logado para iniciar um chat");
      navigate("/login");
      return;
    }
    navigate(`/chat/${id}`);
  };

  const handleBuy = () => {
    if (!user) {
      toast.error("Você precisa estar logado para comprar");
      navigate("/login");
      return;
    }
    toast.success("Compra realizada com sucesso!");
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

  const originalPrice = item.price * 1.67; // Simulando preço original
  const discount = calculateDiscount(originalPrice, item.price);

  return (
    <AppLayout>
      <div className="bg-[#F5F5F5] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Images and Description */}
            <div>
              {/* Main Image */}
              <div className="mb-4">
                <div className="bg-white rounded-lg overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/600x600?text=Sem+Imagem"}
                    alt={item.title}
                    className="max-w-full h-auto object-contain"
                    style={{ maxHeight: '500px', width: 'auto' }}
                  />
                </div>
              </div>

              {/* Product Description */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="text-base font-bold text-[#3A3A3A] mb-3">Descrição do produto</h3>
                <div className="space-y-2 text-[#3A3A3A]">
                  <p><strong>Descrição:</strong> {item.description}</p>
                  <p><strong>Tamanho:</strong> Único</p>
                  <p><strong>Marca:</strong> Variada</p>
                  <p><strong>Material:</strong> Variado</p>
                  <p><strong>Condição do produto:</strong> {item.available ? 'Novo' : 'Usado'}</p>
                </div>
              </div>

              {/* Profile Reviews */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-base font-bold text-[#3A3A3A] mb-3">Avaliações do perfil</h3>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F2B035] text-[#F2B035]" />
                  ))}
                  <Star className="w-5 h-5 text-gray-300" />
                </div>
                
                <div className="space-y-4 mb-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <span className="font-semibold text-[#3A3A3A]">1º Nome do comprador</span>
                      </div>
                      <p className="text-[#3A3A3A] text-sm">
                        Produtos da loja são excelentes e o vendedor é muito atencioso, recomendo!
                      </p>
                    </div>
                  ))}
                </div>

                <Button variant="default" className="w-full">
                  Avaliar
                </Button>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div>
              <h1 className="text-2xl font-bold text-[#3A3A3A] mb-4">{item.title}</h1>
              
              {/* Price */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-bold text-[#3A3A3A]">{formatPrice(item.price)}</span>
                  {discount > 0 && (
                    <>
                      <span className="text-base text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                      <Badge className="bg-red-500 text-white text-sm px-2 py-0.5">{discount}%</Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 mb-4">
                <Button
                  onClick={handleBuy}
                  variant="purple-large"
                  className="w-full text-sm py-2"
                >
                  Comprar
                </Button>
                <Button
                  onClick={handleChat}
                  variant="outline-large"
                  className="w-full text-sm py-2"
                >
                  Chat
                </Button>
              </div>

              {/* Seller Information */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-[#5941F2]" />
                  <h3 className="text-base font-bold text-[#3A3A3A]">Nome do vendedor</h3>
                </div>
                <div className="space-y-2 text-[#3A3A3A]">
                  <p>Quantidade de vendas: 6 venda</p>
                  <p>Produtos a venda: 5 produtos</p>
                  <p>Na Desapega desde: 06/2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {similarItems.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[#3A3A3A] mb-4">Similares a este anúncio</h2>
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {similarItems.map((similarItem) => (
                    <div key={similarItem.id} className="flex-shrink-0 w-64">
                      <ItemCard item={similarItem} />
                    </div>
                  ))}
                </div>
                {similarItems.length > 4 && (
                  <>
                    <button
                      onClick={() => setCurrentSimilarIndex(Math.max(0, currentSimilarIndex - 1))}
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent rounded-full p-2 border border-[#303030] hover:scale-125 transition-transform"
                      style={{ boxShadow: '0px 0px 10px rgba(48, 48, 48, 0)' }}
                    >
                      <ChevronLeft className="w-6 h-6 text-[#303030]" />
                    </button>
                    <button
                      onClick={() => setCurrentSimilarIndex(Math.min(similarItems.length - 4, currentSimilarIndex + 1))}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent rounded-full p-2 border border-[#303030] hover:scale-125 transition-transform"
                      style={{ boxShadow: '0px 0px 10px rgba(48, 48, 48, 0)' }}
                    >
                      <ChevronRight className="w-6 h-6 text-[#303030]" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Recommended Products */}
          {recommendedItems.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#3A3A3A] mb-4">Você pode gostar</h2>
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {recommendedItems.map((recommendedItem) => (
                    <div key={recommendedItem.id} className="flex-shrink-0 w-64">
                      <ItemCard item={recommendedItem} />
                    </div>
                  ))}
                </div>
                {recommendedItems.length > 4 && (
                  <>
                    <button
                      onClick={() => setCurrentRecommendedIndex(Math.max(0, currentRecommendedIndex - 1))}
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent rounded-full p-2 border border-[#303030] hover:scale-125 transition-transform"
                      style={{ boxShadow: '0px 0px 10px rgba(48, 48, 48, 0)' }}
                    >
                      <ChevronLeft className="w-6 h-6 text-[#303030]" />
                    </button>
                    <button
                      onClick={() => setCurrentRecommendedIndex(Math.min(recommendedItems.length - 4, currentRecommendedIndex + 1))}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent rounded-full p-2 border border-[#303030] hover:scale-125 transition-transform"
                      style={{ boxShadow: '0px 0px 10px rgba(48, 48, 48, 0)' }}
                    >
                      <ChevronRight className="w-6 h-6 text-[#303030]" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
