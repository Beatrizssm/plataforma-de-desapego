/**
 * Footer da aplicação
 * Design conforme Figma
 */

import { Link } from "react-router-dom";
import { Package, Mail, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary-500 text-primary-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-400 p-2 rounded-lg">
                <Package className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl">Plataforma de Desapego</span>
            </div>
            <p className="text-primary-100 text-sm">
              Conectando pessoas e promovendo o consumo consciente através da 
              doação e troca de itens.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/home" className="hover:text-primary-100 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/items" className="hover:text-primary-100 transition-colors">
                  Explorar Itens
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-primary-100 transition-colors">
                  Meu Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:contato@desapego.com" className="hover:text-primary-100 transition-colors">
                  contato@desapego.com
                </a>
              </li>
              <li className="flex items-center gap-3 mt-4">
                <a href="#" className="hover:text-primary-100 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-primary-100 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-400 mt-8 pt-6 text-center text-sm text-primary-100">
          <p>&copy; {new Date().getFullYear()} Plataforma de Desapego. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

