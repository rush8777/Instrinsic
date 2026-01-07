"use client";

import React, { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ContainerTextFlipProps {
  words?: string[];
  interval?: number;
  className?: string;
  textClassName?: string;
  animationDuration?: number;
}

export function ContainerTextFlip({
  words = ["better", "modern", "beautiful", "awesome"],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700,
}: ContainerTextFlipProps) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [words, interval]);

  const currentWord = words[currentWordIndex];

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-lg px-4 py-1",
        "bg-gradient-to-b from-violet-500/20 to-violet-600/30",
        "shadow-[inset_0_-1px_hsl(var(--border)),inset_0_0_0_1px_hsl(var(--border)),_0_4px_12px_rgba(139,92,246,0.3)]",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
          transition={{
            duration: animationDuration / 1000,
            ease: "easeInOut",
          }}
          className={cn("inline-block gradient-text whitespace-nowrap", textClassName)}
        >
          {currentWord.split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: index * 0.02 }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
