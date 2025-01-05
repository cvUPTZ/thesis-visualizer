import React from "react";
import { motion } from "framer-motion";
import { Square, CheckSquare } from "lucide-react";

interface ThesisFeatureProps {
  id: number;
  title: string;
  complete: boolean;
  progress: number;
  hoveredSection: number | null;
  setHoveredSection: (id: number | null) => void;
  angle: number;
  radius: number;
}

export const ThesisFeature = ({
  id,
  title,
  complete,
  progress,
  hoveredSection,
  setHoveredSection,
  angle,
  radius,
}: ThesisFeatureProps) => {
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: id * 0.1 }}
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      onHoverStart={() => setHoveredSection(id)}
      onHoverEnd={() => setHoveredSection(null)}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`bg-white p-4 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2 w-48 transition-colors ${
          hoveredSection === id ? "bg-primary/5" : ""
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {complete ? (
              <CheckSquare className="text-green-500" />
            ) : (
              <Square className="text-gray-400" />
            )}
            <span className="text-sm font-medium">{title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: id * 0.2 }}
              className="bg-primary rounded-full h-2"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};