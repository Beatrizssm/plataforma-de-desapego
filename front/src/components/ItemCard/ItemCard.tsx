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

  // Calcular desconto (simulado - em produção viria do backend)
  const originalPrice = item.price * 1.67;
  const discount = Math.round(((originalPrice - item.price) / originalPrice) * 100);
  const showDiscount = discount > 0;

  return (
    <Link
      to={`/item/${item.id}`}
      onClick={onClick}
      className="block bg-white rounded-lg border border-gray-200 transition-all duration-300 overflow-hidden group no-underline hover:no-underline"
      style={{ boxShadow: '0px 0px 10px rgba(46, 46, 46, 0)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0px 0px 10px rgba(46, 46, 46, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0px 0px 10px rgba(46, 46, 46, 0)';
      }}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={item.imageUrl || "https://via.placeholder.com/400x300?text=Sem+Imagem"}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {showDiscount && (
          <Badge className="absolute top-3 right-3 bg-red-500 text-white text-sm px-2 py-1">
            {discount}%
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#3A3A3A] font-bold text-lg">
              {formatPrice(item.price)}
            </span>
            {showDiscount && (
              <span className="text-gray-400 text-sm line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-[#3A3A3A] text-base mb-1 line-clamp-2">
          {item.title}
        </h3>

        {/* Footer Info */}
        <div className="text-xs text-gray-500 pt-2">
          <span>{item.owner.name}</span>
        </div>
      </div>
    </Link>
  );
}

