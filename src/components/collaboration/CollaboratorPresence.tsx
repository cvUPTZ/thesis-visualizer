import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials } from '@/utils/stringUtils';

interface CollaboratorPresenceProps {
  collaborators: Array<{
    email: string;
    online_at: string;
    presence_ref: string;
  }>;
}

export const CollaboratorPresence: React.FC<CollaboratorPresenceProps> = ({ collaborators }) => {
  return (
    <div className="flex -space-x-2">
      <AnimatePresence>
        {collaborators.map((collaborator) => (
          <motion.div
            key={collaborator.presence_ref}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="relative"
          >
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarImage src={`https://www.gravatar.com/avatar/${collaborator.email}?d=mp`} />
              <AvatarFallback>{getInitials(collaborator.email)}</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};