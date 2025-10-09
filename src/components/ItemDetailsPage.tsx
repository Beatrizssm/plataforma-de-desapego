import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Mail, MapPin, Calendar, User } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ItemDetailsPageProps {
  onNavigate: (page: string) => void;
}

export function ItemDetailsPage({ onNavigate }: ItemDetailsPageProps) {
  const item = {
    image: "https://images.unsplash.com/photo-1702018706865-e5306a8fa007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBmdXJuaXR1cmUlMjBjaGFpcnxlbnwxfHx8fDE3NTk5NjMwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Cadeira de Madeira Artesanal",
    description:
      "Linda cadeira de madeira maciça, feita artesanalmente com muito cuidado. Perfeita para complementar sua sala de jantar ou escritório. A peça está em excelente estado de conservação, sem rachaduras ou defeitos. A madeira é de qualidade premium e a pintura está intacta.",
    category: "Móveis",
    type: "Doação",
    status: "available" as const,
    location: "São Paulo, SP",
    postedDate: "05 de Outubro, 2025",
    donor: {
      name: "Maria Silva",
      email: "maria.silva@email.com",
    },
  };

  const handleReserve = () => {
    toast.success("Item reservado com sucesso! O doador foi notificado.");
  };

  return (
    <div className="min-h-screen bg-[#F8F3E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          onClick={() => onNavigate("items")}
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
              src={item.image}
              alt={item.title}
              className="w-full h-[500px] object-cover"
            />
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[#C9A77A] shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-[#3A2B1D]">{item.title}</h1>
              <Badge className="bg-green-600 text-white">
                Disponível
              </Badge>
            </div>

            <div className="flex gap-2 mb-6">
              <Badge variant="outline" className="border-[#8B5E3C] text-[#5A3825]">
                {item.category}
              </Badge>
              <Badge variant="outline" className="border-[#C9A77A] text-[#8B5E3C]">
                {item.type}
              </Badge>
            </div>

            <div className="mb-8">
              <h3 className="text-[#5A3825] mb-3">Descrição</h3>
              <p className="text-[#3A2B1D] leading-relaxed">
                {item.description}
              </p>
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
              <h3 className="text-[#5A3825] mb-4">Informações do Doador</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#3A2B1D]">
                  <User className="h-5 w-5 text-[#8B5E3C]" />
                  <span>{item.donor.name}</span>
                </div>
                <div className="flex items-center gap-3 text-[#3A2B1D]">
                  <Mail className="h-5 w-5 text-[#8B5E3C]" />
                  <a
                    href={`mailto:${item.donor.email}`}
                    className="hover:underline"
                  >
                    {item.donor.email}
                  </a>
                </div>
              </div>
            </div>

            <Button
              onClick={handleReserve}
              className="w-full bg-[#5A3825] hover:bg-[#3A2B1D] text-[#F8F3E7] py-6 rounded-xl"
            >
              Reservar Item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
