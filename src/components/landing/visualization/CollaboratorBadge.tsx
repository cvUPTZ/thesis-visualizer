import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface CollaboratorBadgeProps {
  id: number;
  role: string;
  active: boolean;
}

export const CollaboratorBadge = ({ id, role, active }: CollaboratorBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + id * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md ${
        active ? "bg-white" : "bg-gray-50"
      }`}
    >
      <div className="relative">
        <Users className={active ? "text-primary" : "text-gray-400"} size={20} />
        {active && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
        )}
      </div>
      <span
        className={`text-sm font-medium ${
          active ? "text-gray-900" : "text-gray-500"
        }`}
      >
        {role}
      </span>
    </motion.div>
  );
};