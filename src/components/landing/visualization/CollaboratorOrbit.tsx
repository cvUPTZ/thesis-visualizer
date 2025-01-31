import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Collaborator {
  id: number;
  name: string;
  role: string;
  email: string;
}

interface CollaboratorOrbitProps {
  collaborators: Collaborator[];
}

export const CollaboratorOrbit = ({ collaborators }: CollaboratorOrbitProps) => {
  return (
    <div className="absolute inset-0">
      {collaborators.slice(0, 2).map((collaborator, index) => {
        const angle = (index * 360) / 2;
        const radius = 120; // Increased radius to move avatars outside the book icon
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={collaborator.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: 360,
            }}
            transition={{ 
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              },
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 }
            }}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="relative -translate-x-1/2 -translate-y-1/2"
            >
              <Avatar className="h-8 w-8 border-2 border-primary/20 bg-white/80 backdrop-blur-sm hover:border-primary/50 transition-all duration-200">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${collaborator.email}`} 
                  alt={collaborator.name} 
                />
                <AvatarFallback>
                  {collaborator.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs shadow-sm border border-primary/10"
              >
                {collaborator.name} • {collaborator.role}
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};