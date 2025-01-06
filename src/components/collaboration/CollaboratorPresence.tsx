import React from 'react';

interface CollaboratorPresenceProps {
  thesisId: string;
}

export const CollaboratorPresence: React.FC<CollaboratorPresenceProps> = ({ thesisId }) => {
  return (
    <div>
      <span className="text-sm text-gray-500">Collaborator presence for thesis {thesisId}</span>
    </div>
  );
};
