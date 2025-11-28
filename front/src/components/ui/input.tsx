import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, id, ...props }: React.ComponentProps<"input">) {
  // Determinar se é input de login/cadastro ou outro tipo
  const isAuthInput = id === 'email' || 
                      id === 'password' || 
                      id === 'confirmPassword' ||
                      props.placeholder?.toLowerCase().includes('e-mail') || 
                      props.placeholder?.toLowerCase().includes('email') ||
                      props.placeholder?.toLowerCase().includes('senha') ||
                      props.placeholder?.toLowerCase().includes('password');
  
  return (
    <input
      type={type}
      id={id}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        isAuthInput 
          ? "bg-[#F2F2F2] border-2 border-[rgba(48,48,48,0.8)] rounded-[10px] placeholder:text-[rgba(48,48,48,0.3)] focus-visible:shadow-[0px_0px_10px_rgba(48,48,48,0.5)]"
          : "bg-white border-2 border-[rgba(48,48,48,0.5)] rounded-xl shadow-[-4px_4px_4px_rgba(48,48,48,0.25)] focus-visible:shadow-[-4px_4px_4px_rgba(48,48,48,0.25)]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
