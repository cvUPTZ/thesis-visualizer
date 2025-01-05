import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ThesisStatProps {
  id: number;
  icon: LucideIcon;
  label: string;
  value: string;
  target: string;
}

export const ThesisStat = ({ id, icon: Icon, label, value, target }: ThesisStatProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + id * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10"
    >
      <div className="flex items-center gap-3">
        <Icon className="text-[#6B46C1]" size={20} />
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-lg font-semibold text-white">
            {value}
            <span className="text-xs text-gray-500 ml-1">/ {target}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};