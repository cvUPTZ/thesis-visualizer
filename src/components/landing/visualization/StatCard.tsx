import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id: number;
  icon: LucideIcon;
  label: string;
  value: string;
  target: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

export const StatCard = ({ id, icon: Icon, label, value, target, trend, change }: StatCardProps) => {
  return (
    <motion.div
      key={id}
      className="stat-card"
      whileHover={{ y: -5 }}
    >
      <div className="stat-header">
        <Icon size={20} />
        <span>{label}</span>
      </div>
      <div className="stat-value">
        {value}
        <span className="stat-target">/ {target}</span>
      </div>
      <div className={`stat-trend ${trend}`}>
        {trend === 'up' && <ArrowUp size={16} />}
        {trend === 'down' && <ArrowDown size={16} />}
        {trend === 'stable' && <Minus size={16} />}
        <span>{change}</span>
      </div>
    </motion.div>
  );
};