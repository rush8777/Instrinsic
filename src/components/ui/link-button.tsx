import * as React from "react";
import { cn } from "@/lib/utils";

interface LinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "brand";
}

const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          variant === "brand" && "text-primary",
          variant === "default" && "text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
LinkButton.displayName = "LinkButton";

export { LinkButton };
