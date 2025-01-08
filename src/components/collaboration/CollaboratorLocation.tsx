import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CollaboratorLocation {
  user_id: string;
  email?: string;
  section_id: string;
  last_seen: string;
}

interface CollaboratorLocationProps {
  collaborator: CollaboratorLocation;
}

export const CollaboratorLocation: React.FC<CollaboratorLocationProps> = ({ collaborator }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative inline-block">
            <Avatar className="h-6 w-6 border-2 border-background">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${collaborator.email}`} 
                alt={collaborator.email} 
              />
              <AvatarFallback>
                {collaborator.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-background" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{collaborator.email} is here</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};