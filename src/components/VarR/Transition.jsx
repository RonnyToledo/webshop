"use client";
import { motion } from "framer-motion";
import { transitionVariants } from "../globalFunctions/function";

export default function Transition({ children }) {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={transitionVariants}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.5, // La entrada ahora demora 0.5 segundos
      }}
    >
      {children}
    </motion.div>
  );
}
