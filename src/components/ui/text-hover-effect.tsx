"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TextHoverEffectProps {
  text: string;
  duration?: number;
  className?: string;
  variant?: "default" | "subtle" | "background";
}

export const TextHoverEffect = ({
  text,
  duration = 0,
  className,
  variant = "default",
}: TextHoverEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Check if mouse is within the container bounds
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          const cxPercentage = ((e.clientX - rect.left) / rect.width) * 100;
          const cyPercentage = ((e.clientY - rect.top) / rect.height) * 100;
          setMaskPosition({
            cx: `${Math.max(0, Math.min(100, cxPercentage))}%`,
            cy: `${Math.max(0, Math.min(100, cyPercentage))}%`,
          });
          if (!hovered) setHovered(true);
        } else if (hovered) {
          setHovered(false);
        }
      }
    };

    // Listen on document to track mouse everywhere
    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hovered]);

  const isBackground = variant === "background";
  const isSubtle = variant === "subtle";

  const viewBox = isBackground ? "0 0 800 200" : "0 0 300 100";

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className="select-none w-full h-full"
      >
      <defs>
        <linearGradient
          id={`textGradient-${text}`}
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={isBackground ? "hsl(263, 70%, 60%)" : "#eab308"} />
          <stop offset="25%" stopColor={isBackground ? "hsl(263, 70%, 70%)" : "#ef4444"} />
          <stop offset="50%" stopColor={isBackground ? "hsl(217, 91%, 60%)" : "#3b82f6"} />
          <stop offset="75%" stopColor={isBackground ? "hsl(240, 40%, 60%)" : "#06b6d4"} />
          <stop offset="100%" stopColor={isBackground ? "hsl(263, 70%, 60%)" : "#8b5cf6"} />
        </linearGradient>

        <motion.radialGradient
          id={`revealMask-${text}`}
          gradientUnits="userSpaceOnUse"
          r={isBackground ? "40%" : "20%"}
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={`textMask-${text}`}>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#revealMask-${text})`}
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth={isBackground ? "0.5" : "0.3"}
        fontSize={isBackground ? "180" : "80"}
        className={cn(
          "fill-transparent font-[helvetica] font-bold",
          isBackground 
            ? "stroke-foreground/10 dark:stroke-foreground/15" 
            : "stroke-neutral-200 dark:stroke-neutral-800"
        )}
        style={{ opacity: isBackground ? 0.4 : (hovered ? 0.7 : 0) }}
      >
        {text}
      </text>
      {!isBackground && (
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          strokeWidth="0.3"
          fontSize="80"
          className="fill-transparent stroke-neutral-200 font-[helvetica] font-bold dark:stroke-neutral-800"
          initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
          animate={{
            strokeDashoffset: 0,
            strokeDasharray: 1000,
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.text>
      )}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={`url(#textGradient-${text})`}
        strokeWidth={isBackground ? "0.5" : "0.3"}
        fontSize={isBackground ? "180" : "80"}
        mask={`url(#textMask-${text})`}
        className="fill-transparent font-[helvetica] font-bold"
        style={{ 
          opacity: isBackground 
            ? (hovered ? 0.8 : 0.3)
            : 1 
        }}
      >
        {text}
      </text>
    </svg>
    </div>
  );
};

