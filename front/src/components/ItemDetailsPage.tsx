import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Mail, MapPin, Calendar, User, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Lista de itens fixos (mesma lista do ItemsListPage)
const fixedItems = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1626477357166-ed26f0e3f1cc",
    title: "Camisetas Variadas",
    description: "Lote de camisetas em ótimo estado, diversas cores e tamanhos. Perfeitas para renovar seu guarda-roupa ou começar uma nova coleção. Todas as peças foram cuidadosamente selecionadas e estão em excelente estado.",
    status: "available" as const,
    category: "Roupas",
    location: "São Paulo, SP",
    postedDate: "10 de Janeiro, 2025",
    donor: {
      name: "João Silva",
      email: "joao.silva@email.com",
    },
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1654360057953-81305834dd30",
    title: "Laptop Dell Inspiron",
    description: "Laptop Dell i5, 8GB RAM, funcionando perfeitamente. Ideal para trabalhos, estudos ou uso doméstico. Inclui carregador e está em ótimo estado de conservação.",
    status: "reserved" as const,
    category: "Eletrônicos",
    location: "Rio de Janeiro, RJ",
    postedDate: "08 de Janeiro, 2025",
    donor: {
      name: "Ana Costa",
      email: "ana.costa@email.com",
    },
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1702018706865-e5306a8fa007",
    title: "Cadeira de Madeira Artesanal",
    description: "Linda cadeira de madeira maciça, feita artesanalmente com muito cuidado. Perfeita para complementar sua sala de jantar ou escritório. A peça está em excelente estado de conservação, sem rachaduras ou defeitos. A madeira é de qualidade premium e a pintura está intacta.",
    status: "available" as const,
    category: "Móveis",
    location: "São Paulo, SP",
    postedDate: "05 de Outubro, 2024",
    donor: {
      name: "Maria Silva",
      email: "maria.silva@email.com",
    },
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1680537250732-6835b59c937e",
    title: "Coleção de Livros Clássicos",
    description: "Diversos livros de literatura clássica brasileira e mundial. Inclui obras de Machado de Assis, José de Alencar, Shakespeare e outros grandes autores. Todos os livros estão em bom estado de conservação.",
    status: "donated" as const,
    category: "Livros",
    location: "Belo Horizonte, MG",
    postedDate: "15 de Dezembro, 2024",
    donor: {
      name: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
    },
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1733809701005-0b1c0ad53c90",
    title: "Itens de Decoração",
    description: "Vários itens de decoração vintage para sua casa. Inclui vasos, quadros, objetos decorativos e outros acessórios que darão um toque especial ao seu ambiente.",
    status: "available" as const,
    category: "Outros",
    location: "Curitiba, PR",
    postedDate: "20 de Janeiro, 2025",
    donor: {
      name: "Patricia Santos",
      email: "patricia.santos@email.com",
    },
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1662070027900-7844087ea06d",
    title: "Almofadas e Mantas",
    description: "Conjunto de almofadas e mantas confortáveis para decorar sua casa. Perfeitas para deixar seu sofá ou cama mais aconchegantes. Todas as peças estão limpas e em bom estado.",
    status: "available" as const,
    category: "Outros",
    location: "Porto Alegre, RS",
    postedDate: "12 de Janeiro, 2025",
    donor: {
      name: "Roberto Lima",
      email: "roberto.lima@email.com",
    },
  },
];

// Componente de Estrelas para Avaliação
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return (
            <Star
              key={index}
              className="h-5 w-5 fill-[#FFD700] text-[#FFD700]"
            />
          );
        } else if (index === fullStars && hasHalfStar) {
          return (
            <Star
              key={index}
              className="h-5 w-5 fill-[#FFD700] text-[#FFD700] opacity-50"
            />
          );
        } else {
          return (
            <Star
              key={index}
              className="h-5 w-5 fill-none text-[#C9A77A]"
            />
          );
        }
      })}
    </div>
  );
}

export function ItemDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [donorRating, setDonorRating] = useState<number>(0);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      navigate("/items");
      return;
    }

    // Primeiro, busca nos itens fixos
    let foundItem = fixedItems.find(item => item.id === id);
    let itemIsOwner = false;

    // Se não encontrar, busca nos itens do localStorage
    if (!foundItem) {
      const myItems = JSON.parse(localStorage.getItem("myItems") || "[]");
      foundItem = myItems.find((item: any) => item.id === id);
      
      // Se for um item do localStorage, é do usuário
      if (foundItem) {
        itemIsOwner = true;
        foundItem = {
          ...foundItem,
          location: foundItem.location || "Não informado",
          postedDate: foundItem.postedDate || new Date().toLocaleDateString("pt-BR"),
          donor: foundItem.donor || {
            name: "Usuário",
            email: "usuario@email.com",
          },
        };
      }
    }

    if (foundItem) {
      setItem(foundItem);
      setIsOwner(itemIsOwner);
      
      // Carrega avaliações do doador
      const donorEmail = foundItem.donor?.email || "";
      if (donorEmail) {
        const ratingsKey = `donor_ratings_${donorEmail}`;
        const ratings = JSON.parse(localStorage.getItem(ratingsKey) || "[]");
        if (ratings.length > 0) {
          const averageRating = ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length;
          setDonorRating(Math.round(averageRating * 10) / 10); // Arredonda para 1 casa decimal
        } else {
          // Avaliação padrão para doadores sem avaliações
          setDonorRating(5.0);
        }
      }
    } else {
      toast.error("Item não encontrado");
      navigate("/items");
    }
  }, [id, navigate]);

  const handleBuy = () => {
    if (item) {
      // Atualiza o status do item no localStorage se for um item do usuário
      const myItems = JSON.parse(localStorage.getItem("myItems") || "[]");
      const itemIndex = myItems.findIndex((i: any) => i.id === item.id);
      if (itemIndex !== -1) {
        myItems[itemIndex].status = "reserved";
        localStorage.setItem("myItems", JSON.stringify(myItems));
      }
      toast.success("Item comprado com sucesso! O doador foi notificado.");
    }
  };

  const handleChat = () => {
    navigate(`/chat/${id}`);
  };

  const handleMarkAsSold = () => {
    if (item && isOwner) {
      const myItems = JSON.parse(localStorage.getItem("myItems") || "[]");
      const itemIndex = myItems.findIndex((i: any) => i.id === item.id);
      if (itemIndex !== -1) {
        myItems[itemIndex].status = "sold";
        localStorage.setItem("myItems", JSON.stringify(myItems));
        setItem({ ...item, status: "sold" });
        toast.success("Item marcado como vendido!");
      }
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F8F3E7] flex items-center justify-center">
        <p className="text-[#8B5E3C]">Carregando...</p>
      </div>
    );
  }

  const statusConfig = {
    available: { label: "Disponível", color: "bg-green-600" },
    reserved: { label: "Reservado", color: "bg-amber-600" },
    donated: { label: "Doado", color: "bg-[#8B5E3C]" },
    sold: { label: "Vendido", color: "bg-gray-600" },
  };

  return (
    <div className="min-h-screen bg-[#F8F3E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/items")}
          variant="outline"
          className="mb-6 border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#EADDC7]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-2xl overflow-hidden border-2 border-[#C9A77A] shadow-lg">
            <img
              src={item.image || "https://via.placeholder.com/500"}
              alt={item.title}
              className="w-full h-[500px] object-cover"
            />
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[#C9A77A] shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-[#3A2B1D] text-2xl font-bold">{item.title}</h1>
              <Badge className={statusConfig[item.status].color + " text-white"}>
                {statusConfig[item.status].label}
              </Badge>
            </div>

            <div className="flex gap-2 mb-6">
              <Badge variant="outline" className="border-[#8B5E3C] text-[#5A3825]">
                {item.category}
              </Badge>
              <Badge variant="outline" className="border-[#C9A77A] text-[#8B5E3C]">
                Doação
              </Badge>
            </div>

            <div className="mb-8">
              <h3 className="text-[#5A3825] mb-3 font-semibold">Descrição</h3>
              <p className="text-[#3A2B1D] leading-relaxed">{item.description}</p>
            </div>

            <div className="space-y-4 mb-8 p-6 bg-[#F8F3E7] rounded-xl">
              <div className="flex items-center gap-3 text-[#3A2B1D]">
                <MapPin className="h-5 w-5 text-[#8B5E3C]" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-3 text-[#3A2B1D]">
                <Calendar className="h-5 w-5 text-[#8B5E3C]" />
                <span>Publicado em {item.postedDate}</span>
              </div>
            </div>

            <div className="mb-8 p-6 bg-[#EADDC7] rounded-xl">
              <h3 className="text-[#5A3825] mb-4 font-semibold">Informações do Doador</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#3A2B1D]">
                  <User className="h-5 w-5 text-[#8B5E3C]" />
                  <span className="font-semibold">{item.donor?.name || "Usuário"}</span>
                </div>
                <div className="flex items-center gap-3 text-[#3A2B1D]">
                  <Mail className="h-5 w-5 text-[#8B5E3C]" />
                  <a href={`mailto:${item.donor?.email || ""}`} className="hover:underline">
                    {item.donor?.email || "usuario@email.com"}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-[#3A2B1D] pt-2 border-t border-[#C9A77A]">
                  <span className="text-sm font-medium">Avaliação:</span>
                  <StarRating rating={donorRating} />
                  <span className="text-sm text-[#8B5E3C] font-semibold">
                    {donorRating.toFixed(1)}/5.0
                  </span>
                </div>
              </div>
            </div>

            {item.status === "available" && (
              <>
                <Button
                  onClick={handleBuy}
                  className="w-full bg-[#5A3825] hover:bg-[#3A2B1D] text-[#F8F3E7] py-6 rounded-xl"
                >
                  Comprar
                </Button>
                <Button
                  onClick={handleChat}
                  className="w-full bg-[#8B5E3C] hover:bg-[#6B4A2C] text-[#F8F3E7] py-6 rounded-xl mt-4"
                >
                  Chat
                </Button>
              </>
            )}

            {isOwner && item.status !== "sold" && (
              <Button
                onClick={handleMarkAsSold}
                className="w-full bg-gray-600 hover:bg-gray-700 text-[#F8F3E7] py-6 rounded-xl mt-4"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Marcar como Vendido
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
