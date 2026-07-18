"use client";

import React from "react";
import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 85, 
      damping: 14 
    } 
  }
};

export default function CategoriesGrid({ categories }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {categories.map((cat) => (
        <motion.div key={cat.id} variants={itemVariants}>
          <CategoryCard category={cat} />
        </motion.div>
      ))}
    </motion.div>
  );
}
