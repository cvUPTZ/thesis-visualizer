import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export const TimelineIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 timeline-card"
    >
      <div className="bg-white p-4 rounded-xl shadow-lg space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="text-primary" size={20} />
          <span className="text-sm font-medium">Timeline</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Started: 3 months ago</p>
          <p className="text-xs text-gray-500">Deadline: 2 months left</p>
        </div>
      </div>
    </motion.div>
  );
};