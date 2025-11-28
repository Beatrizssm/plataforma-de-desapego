/**
 * Script para importar cores do Figma
 * 
 * Como usar:
 * 1. No Figma, copie as cores (formato HEX)
 * 2. Cole abaixo no objeto figmaColors
 * 3. Execute: node scripts/import-figma-colors.js
 * 4. As cores serão convertidas para CSS variables
 * 5. Copie o output para front/src/styles/globals.css
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// COLE AQUI AS CORES DO SEU FIGMA
// ============================================
const figmaColors = {
  // Cores principais
  primary: "#5941F2",
  "primary-foreground": "#FFFFFF",
  secondary: "#F24535",
  "secondary-foreground": "#FFFFFF",
  accent: "#F2B035",
  "accent-foreground": "#3A2B1D",
  
  // Cores de fundo e texto
  background: "#FFFFFF",
  foreground: "#000000",
  
  // Cores de componentes
  card: "#FFFFFF",
  "card-foreground": "#3A2B1D",
  popover: "#FFFFFF",
  "popover-foreground": "#3A2B1D",
  
  // Cores de estado
  muted: "#EADDC7",
  "muted-foreground": "#8B5E3C",
  destructive: "#C26D57",
  "destructive-foreground": "#FFFFFF",
  
  // Cores de borda e input
  border: "#C9A77A",
  input: "transparent",
  "input-background": "#FFFFFF",
  ring: "#8B5E3C",
  
  // Cores de sidebar (se aplicável)
  sidebar: "#5A3825",
  "sidebar-foreground": "#F8F3E7",
  "sidebar-primary": "#8B5E3C",
  "sidebar-primary-foreground": "#F8F3E7",
  "sidebar-accent": "#8B5E3C",
  "sidebar-accent-foreground": "#F8F3E7",
  "sidebar-border": "#8B5E3C",
  "sidebar-ring": "#C9A77A",
  
  // Cores de gráficos (se aplicável)
  "chart-1": "#8B5E3C",
  "chart-2": "#C9A77A",
  "chart-3": "#EADDC7",
  "chart-4": "#5A3825",
  "chart-5": "#F8F3E7",
  
  // Outras cores customizadas
  "switch-background": "#C9A77A",
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

// Função para converter HEX para RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Função para validar cor HEX
function isValidHex(hex) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

// Gerar CSS variables para :root
function generateCSSVariables(colors) {
  let css = ":root {\n";
  
  Object.entries(colors).forEach(([name, value]) => {
    if (isValidHex(value)) {
      css += `  --${name}: ${value};\n`;
    } else {
      css += `  --${name}: ${value};\n`; // Permite valores como "transparent"
    }
  });
  
  css += "}\n";
  return css;
}

// Gerar CSS variables para .dark (modo escuro)
function generateDarkCSSVariables(colors) {
  // Você pode definir cores diferentes para o modo escuro aqui
  const darkColors = {
    background: "#3A2B1D",
    foreground: "#F8F3E7",
    border: "#8B5E3C",
    // Adicione mais cores para o modo escuro conforme necessário
  };
  
  let css = "\n.dark {\n";
  
  Object.entries(darkColors).forEach(([name, value]) => {
    css += `  --${name}: ${value};\n`;
  });
  
  css += "}\n";
  return css;
}

// Gerar Tailwind config (opcional)
function generateTailwindConfig(colors) {
  let config = "colors: {\n";
  
  Object.entries(colors).forEach(([name, value]) => {
    if (name.includes('-')) {
      // Para cores com hífen, usar aspas
      config += `    "${name}": "${value}",\n`;
    } else {
      config += `    ${name}: "${value}",\n`;
    }
  });
  
  config += "  }";
  return config;
}

// ============================================
// EXECUÇÃO
// ============================================

if (Object.keys(figmaColors).length > 0) {
  console.log("🎨 Gerando CSS Variables do Figma...\n");
  console.log("=" .repeat(50));
  
  const cssVariables = generateCSSVariables(figmaColors);
  const darkVariables = generateDarkCSSVariables(figmaColors);
  const fullCSS = cssVariables + darkVariables;
  
  console.log("\n📋 CSS Variables geradas:\n");
  console.log(fullCSS);
  
  // Perguntar se deseja salvar automaticamente
  const globalsPath = path.join(__dirname, '../src/styles/globals.css');
  
  console.log("\n" + "=".repeat(50));
  console.log("\n💾 Opções:");
  console.log("1. Copie o CSS acima e cole manualmente em globals.css");
  console.log(`2. Ou o arquivo será atualizado automaticamente em: ${globalsPath}`);
  console.log("\n⚠️  ATENÇÃO: Isso vai substituir o conteúdo de :root e .dark em globals.css!");
  console.log("\n✅ Processo concluído!");
  
  // Salvar automaticamente (descomente se quiser)
  // try {
  //   const currentContent = fs.readFileSync(globalsPath, 'utf8');
  //   // Preservar conteúdo antes de :root
  //   const beforeRoot = currentContent.split(':root')[0];
  //   const newContent = beforeRoot + fullCSS;
  //   fs.writeFileSync(globalsPath, newContent, 'utf8');
  //   console.log("\n✅ Arquivo globals.css atualizado automaticamente!");
  // } catch (error) {
  //   console.log("\n⚠️  Não foi possível atualizar automaticamente. Copie manualmente.");
  // }
  
} else {
  console.log("⚠️  Adicione as cores do Figma no objeto figmaColors!");
  console.log("\n📖 Veja o guia em: front/GUIA_FIGMA.md");
}

