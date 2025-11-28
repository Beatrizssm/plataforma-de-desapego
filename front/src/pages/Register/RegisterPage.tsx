/**
 * Tela de Registro
 * Design conforme imagem
 */

import { RegisterLeftPanel } from "../../components/RegisterLeftPanel";
import { RegisterRightPanel } from "../../components/RegisterRightPanel";

export function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full overflow-hidden" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <RegisterLeftPanel />
      <RegisterRightPanel />
    </div>
  );
}

