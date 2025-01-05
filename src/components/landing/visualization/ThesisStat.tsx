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
      className={`stats-card bg-white px-6 py-3 rounded-xl shadow-lg stats-flex-${id + 1}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="text-primary" size={20} />
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-lg font-semibold">
            {value}
            <span className="text-xs text-gray-400 ml-1">/ {target}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};