import React from 'react';

interface CollaboratorPresenceProps {
  thesisId: string;
}

export const CollaboratorPresence: React.FC<CollaboratorPresenceProps> = ({ thesisId }) => {
  console.log('🤝 Rendering CollaboratorPresence for thesis:', thesisId);
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-background/80 backdrop-blur-sm rounded-lg border shadow-lg">
      <h3 className="text-sm font-medium mb-2">Active Collaborators</h3>
      {/* Collaborator list will be implemented here */}
    </div>
  );
};