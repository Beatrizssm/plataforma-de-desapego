import { motion } from "framer-motion";
import { Badge } from "./ui/badge";

interface CardItemProps {
  id?: string;
  image: string;
  title: string;
  description: string;
  status: "available" | "reserved" | "donated" | "sold";
  category: string;
  onClick?: () => void;
}

const statusConfig = {
  available: { label: "Disponível", color: "bg-green-600" },
  reserved: { label: "Reservado", color: "bg-amber-600" },
  donated: { label: "Doado", color: "bg-[#8B5E3C]" },
  sold: { label: "Vendido", color: "bg-gray-600" },
};

export function CardItem({
  image,
  title,
  description,
  status,
  category,
  onClick,
}: CardItemProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(90, 56, 37, 0.15)" }}
      className="bg-white rounded-xl overflow-hidden border-2 border-transparent hover:border-[#C9A77A] transition-all cursor-pointer shadow-md"
      onClick={onClick}
    >
      <div className="aspect-[4/3] overflow-hidden bg-[#EADDC7]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-[#3A2B1D] line-clamp-1">{title}</h3>
          <Badge className={`${statusConfig[status].color} text-white shrink-0`}>
            {statusConfig[status].label}
          </Badge>
        </div>

        <p className="text-[#8B5E3C] text-sm line-clamp-2 mb-3">{description}</p>

        <Badge variant="outline" className="border-[#C9A77A] text-[#5A3825]">
          {category}
        </Badge>
      </div>
    </motion.div>
  );
}