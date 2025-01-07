import React from 'react';

export const ChatHeader: React.FC = () => {
  return (
    <div className="p-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <h3 className="font-semibold">Chat</h3>
    </div>
  );
};