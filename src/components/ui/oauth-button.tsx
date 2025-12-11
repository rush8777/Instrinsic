import * as React from "react";
import { cn } from "@/lib/utils";

interface OAuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  logo: string;
  children: React.ReactNode;
}

const OAuthButton = React.forwardRef<HTMLButtonElement, OAuthButtonProps>(
  ({ className, logo, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center justify-center gap-3 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        <img src={logo} alt="" className="h-5 w-5 object-contain" />
        {children}
      </button>
    );
  }
);
OAuthButton.displayName = "OAuthButton";

export { OAuthButton };
