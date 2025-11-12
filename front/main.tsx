import React from "react";
import { createRoot } from "react-dom/client";
import App from "./src/components/App";

// ✅ IMPORTAÇÕES CORRETAS DOS ARQUIVOS CSS
import "./src/styles/index.css";
import "./src/styles/globals.css";
import "./src/styles/base.css";
import "./src/styles/main.css";
import "./src/styles/noite.css";
import "./src/styles/typography.css";
import "./src/styles/properties.css";
import "./src/styles/utilities.css";

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
