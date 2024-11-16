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
        "font-bold text-sm justify-center flex ml-2 text-black items-center",
        logoClassName
      )}
    >
    <span className="w-8 h-8 flex items-center justify-center rounded-xl relative overflow-hidden bg-gradient-to-br from-[#9e85b3] to-[#4a5486]">
      {/* Diagonal accent overlay */}
      <span className="absolute w-full h-full transform translate-x-5 bg-white/[0.15] rotate-45" />
      
      {/* SVG Pattern */}
      <svg
        viewBox="0 0 32 32"
        className="relative w-8 h-8"
        fill="none"
      >
        {/* Main dots */}
        <circle cx="9" cy="9" r="2.2" fill="white"/>
        <circle cx="16" cy="16" r="2.2" fill="white"/>
        <circle cx="23" cy="23" r="2.2" fill="white"/>
        
        {/* Secondary dots */}
        <circle cx="23" cy="9" r="2.2" fill="white"/>
        <circle cx="9" cy="23" r="2.2" fill="white"/>
        
        {/* Connecting paths */}
        <path 
          d="M9 9 Q16 11.5 23 9 Q20.5 16 23 23 Q16 20.5 9 23 Q11.5 16 9 9"
          stroke="white"
          strokeWidth="0.9"
          opacity="0.5"
        />
      </svg>
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