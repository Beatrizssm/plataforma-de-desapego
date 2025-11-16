/**
 * Card de Item
 * Design conforme Figma
 */

import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { MapPin, Calendar, User } from "lucide-react";
import { Item } from "../../services/itemService";

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Link
      to={`/item/${item.id}`}
      onClick={onClick}
      className="block bg-card rounded-2xl border-2 border-border shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={item.imageUrl || "https://via.placeholder.com/400x300?text=Sem+Imagem"}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge
          className={`absolute top-3 right-3 ${
            item.available
              ? "bg-green-600 text-white"
              : "bg-amber-600 text-white"
          }`}
        >
          {item.available ? "Disponível" : "Indisponível"}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
          {item.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Price */}
        <div className="mb-3">
          <span className="text-primary-400 font-bold text-xl">
            {formatPrice(item.price)}
          </span>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{item.owner.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

