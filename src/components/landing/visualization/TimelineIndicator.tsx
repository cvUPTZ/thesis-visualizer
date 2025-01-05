import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

export const TimelineIndicator = () => {
  // Calculate progress (example: 3 months in, 2 months left = 60% complete)
  const timeProgress = 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-[80px] w-[200px]"
    >
      <div className="relative">
        {/* Circular Progress */}
        <svg className="w-full h-24" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(79,70,229,0.6)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${timeProgress * 2.83}, 283`}
            transform="rotate(-90 50 50)"
            initial={{ strokeDasharray: "0, 283" }}
            animate={{ strokeDasharray: `${timeProgress * 2.83}, 283` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {/* Center content */}
          <foreignObject x="25" y="25" width="50" height="50">
            <div className="h-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary/70" />
            </div>
          </foreignObject>
        </svg>

        {/* Timeline details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-full text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-primary/10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="text-primary/70 h-3 w-3" />
              <span className="text-[10px] font-medium text-gray-700">Timeline</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] text-gray-500">2 months remaining</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-[9px] text-primary/70 font-medium">{timeProgress}%</span>
                <span className="text-[9px] text-gray-400">complete</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};