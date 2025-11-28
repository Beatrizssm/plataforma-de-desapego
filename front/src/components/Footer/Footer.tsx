/**
 * Footer da aplicação
 * Design conforme imagem
 */

import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#5941F2] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Conheça-nos */}
          <div>
            <h3 className="font-semibold mb-4">Conheça-nos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-white hover:underline transition-colors">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link to="/creator" className="text-white hover:underline transition-colors">
                  Sobre o Criador
                </Link>
              </li>
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h3 className="font-semibold mb-4">Ajuda</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/support" className="text-white hover:underline transition-colors">
                  Suporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center md:justify-end -mt-4">
            <img 
              src="/ativo-1-10-1.png" 
              alt="DESAPEGA" 
              className="h-16 w-auto"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-white/20 text-center text-sm text-white/90">
          <p>© 2025 Beatriz. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
