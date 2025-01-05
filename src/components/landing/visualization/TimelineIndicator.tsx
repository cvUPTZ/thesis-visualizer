import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export const TimelineIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-[80px]"
    >
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-100 w-[180px]">
        <div className="flex items-center gap-2 mb-1.5">
          <Calendar className="text-primary h-4 w-4" />
          <span className="text-xs font-medium text-gray-700">Timeline</span>
        </div>
        <div className="space-y-0.5">
          <p className="text-[11px] text-gray-500">Started: 3 months ago</p>
          <p className="text-[11px] text-gray-500">Deadline: 2 months left</p>
        </div>
      </div>
    </motion.div>
  );
};