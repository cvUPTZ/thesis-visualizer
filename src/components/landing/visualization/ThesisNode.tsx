import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";

interface ThesisNodeProps {
  title: string;
  progress: number;
  complete: boolean;
  delay?: number;
}

export const ThesisNode = ({ title, progress, complete, delay = 0 }: ThesisNodeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-[#6B46C1]/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">{title}</h3>
        {complete ? (
          <CheckCircle className="text-green-500" size={20} />
        ) : (
          <Circle className="text-gray-400" size={20} />
        )}
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: delay + 0.5 }}
          className="bg-[#6B46C1] rounded-full h-2"
        />
      </div>
      
      <p className="text-right mt-2 text-sm text-gray-400">
        {progress}%
      </p>
    </motion.div>
  );
};