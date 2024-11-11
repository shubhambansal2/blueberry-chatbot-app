import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

const Logo = ({
  textClassName,
  logoClassName,
  showText = true,
}: {
  textClassName?: string;
  logoClassName?: string;
  showText?: boolean;
}) => {
  return (
    <Link
      href="/"
      className={twMerge(
        "font-bold text-sm flex ml-2 text-black items-center",
        logoClassName
      )}
    >
      <span className="bg-primary w-6 h-6 flex items-center justify-center rounded-[6px] font-mono relative overflow-hidden">
        <span className="absolute w-full h-full transform translate-x-3 bg-white/[0.2] rotate-45" />
      </span>

      <motion.div
        className="flex overflow-hidden"
        animate={{
          width: showText ? "auto" : 0,
          marginLeft: showText ? "0.5rem" : 0,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
      >
        <motion.span
          animate={{
            opacity: showText ? 1 : 0,
          }}
          transition={{
            duration: 0.1,
            ease: "easeInOut"
          }}
          className={twMerge("font-mono whitespace-nowrap", textClassName)}
        >
          Blueberry AI
        </motion.span>
      </motion.div>
    </Link>
  );
};

export default Logo;