import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        // Botão roxo preenchido (default) - para "Salvar", "Adicionar", "Enviar", "Avaliar"
        default: "bg-[#5941F2] text-[#F2F2F2] hover:bg-[#8574F3] rounded-lg",
        // Botão roxo outline - para "Próxima", "Chat", "Comprar novamente"
        outline:
          "border border-[#5941F2] bg-transparent text-[#5941F2] hover:bg-[#8574F3] hover:text-[#F2F2F2] rounded-lg",
        // Botão laranja - para "Cadastre-se" (laranja)
        orange: "bg-[#F2B035] text-[#303030] hover:bg-[#FFC65D] rounded-lg",
        // Botão cinza escuro - para "Entrar"
        dark: "bg-[rgba(48,48,48,0.8)] text-[#F2F2F2] hover:bg-[rgba(48,48,48,1)] rounded-lg",
        // Botão cinza claro - para "Cadastre-se" (cinza)
        light: "bg-[#F2F2F2] text-[#5941F2] hover:bg-[#E9E9E9] rounded-full",
        // Botão grande roxo preenchido - para "Comprar"
        "purple-large": "bg-[#5941F2] text-[#F2F2F2] hover:bg-[#8574F3] rounded-full text-2xl font-medium",
        // Botão grande outline - para "Chat"
        "outline-large": "border-2 border-[#5941F2] bg-transparent text-[#5941F2] hover:bg-[#8574F3] hover:text-[#F2F2F2] rounded-full text-2xl font-medium",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-[#303030] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3 text-base",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5 text-sm",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4 text-lg",
        xl: "py-[25px] px-[155px] text-2xl font-medium",
        "small-outline": "py-4 px-7 text-sm font-normal rounded-lg",
        icon: "size-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
