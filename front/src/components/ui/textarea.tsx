import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none flex field-sizing-content min-h-16 w-full px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "bg-white border-2 border-[rgba(48,48,48,0.5)] rounded-xl shadow-[-4px_4px_4px_rgba(48,48,48,0.25)] placeholder:text-[rgba(48,48,48,0.3)]",
        "focus-visible:shadow-[-4px_4px_4px_rgba(48,48,48,0.25)]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
