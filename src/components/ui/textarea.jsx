import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-md border border-white/10 bg-dark-lighter px-4 py-3 text-base text-white shadow-sm transition-colors placeholder:text-gray-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
}

Textarea.displayName = "Textarea";
Textarea = React.forwardRef(Textarea);

export { Textarea };
