/**
 * Script para importar cores do Figma
 * 
 * Como usar:
 * 1. Copie as cores do Figma (formato HEX, RGB, ou HSL)
 * 2. Cole abaixo no objeto figmaColors
 * 3. Execute: node scripts/import-figma-colors.js
 * 4. As cores serão convertidas para CSS variables
 */

// Cole aqui as cores do seu Figma
const figmaColors = {
  // Exemplo - substitua pelas cores do seu Figma
  primary: "#5A3825",
  secondary: "#EADDC7",
  accent: "#C9A77A",
  background: "#F8F3E7",
  foreground: "#3A2B1D",
  // Adicione mais cores conforme necessário
};

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

// Gerar CSS variables
function generateCSSVariables(colors) {
  let css = ":root {\n";
  
  Object.entries(colors).forEach(([name, value]) => {
    css += `  --${name}: ${value};\n`;
  });
  
  css += "}\n";
  return css;
}

// Gerar Tailwind config
function generateTailwindConfig(colors) {
  let config = "colors: {\n";
  
  Object.entries(colors).forEach(([name, value]) => {
    config += `    ${name}: "${value}",\n`;
  });
  
  config += "  }";
  return config;
}

// Executar
if (Object.keys(figmaColors).length > 0) {
  console.log("🎨 CSS Variables geradas:\n");
  console.log(generateCSSVariables(figmaColors));
  
  console.log("\n📦 Tailwind Config:\n");
  console.log(generateTailwindConfig(figmaColors));
  
  console.log("\n✅ Copie e cole no seu arquivo CSS/Tailwind!");
} else {
  console.log("⚠️ Adicione as cores do Figma no objeto figmaColors!");
}

