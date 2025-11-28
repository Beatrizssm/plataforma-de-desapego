/**
 * Tela de Login
 * Design conforme imagem
 */

import { LoginLeftPanel } from "../../components/LoginLeftPanel";
import { LoginRightPanel } from "../../components/LoginRightPanel";

export function LoginPage() {
  return (
    <div className="flex min-h-screen w-full overflow-hidden" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <LoginLeftPanel />
      <LoginRightPanel />
    </div>
  );
}

