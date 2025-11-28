import { FiShoppingCart } from "react-icons/fi";
import { BsBagFill } from "react-icons/bs";
import { FiHeart } from "react-icons/fi";

export function RegisterRightPanel() {
  return (
    <div className="relative w-[60%] bg-[#F5F5F5] flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Imagem do logo DESAPEGA */}
      <div className="mb-12 w-full flex justify-center items-center">
        <img 
          src="/logo.png" 
          alt="DESAPEGA" 
          className="h-auto object-contain mx-auto"
          style={{ maxHeight: '600px', display: 'block', width: 'auto' }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
          }}
        />
      </div>

      {/* Ícones e textos - alinhados horizontalmente */}
      <div className="flex items-center justify-center gap-12">
        <div className="flex flex-col items-center gap-2">
          <FiShoppingCart className="text-3xl text-[#5941F2]" />
          <span
            className="text-base font-semibold text-[#5941F2]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Venda
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <BsBagFill className="text-3xl text-[#5941F2]" />
          <span
            className="text-base font-semibold text-[#5941F2]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Troque
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FiHeart className="text-3xl text-[#5941F2]" />
          <span
            className="text-base font-semibold text-[#5941F2]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Doe
          </span>
        </div>
      </div>
    </div>
  );
}

