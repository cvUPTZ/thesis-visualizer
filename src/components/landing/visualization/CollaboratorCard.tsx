import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface CollaboratorProps {
  id: number;
  name: string;
  role: string;
  active: boolean;
}

export const CollaboratorCard = ({ id, name, role, active }: CollaboratorProps) => {
  return (
    <motion.div
      key={id}
      className="collaborator-card"
      whileHover={{ scale: 1.05 }}
    >
      <Users size={20} />
      <div className="collaborator-info">
        <span>{name}</span>
        <span>{role}</span>
      </div>
      {active && (
        <div className="active-indicator" />
      )}
    </motion.div>
  );
};