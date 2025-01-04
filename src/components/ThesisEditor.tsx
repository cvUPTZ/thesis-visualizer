import React from 'react';
import { useParams } from 'react-router-dom';
import { CollaboratorPresence } from './collaboration/CollaboratorPresence';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Editor } from '@/components/ui/editor';

export const ThesisEditor = () => {
  const { thesisId } = useParams();
  const { userId } = useAuth();
  const { toast } = useToast();

  const handleSave = async () => {
    // Logic to save the thesis
    toast({
      title: "Thesis Saved",
      description: "Your thesis has been saved successfully.",
    });
  };

  return (
    <div className="relative min-h-screen">
      <header className="flex justify-between items-center p-4 bg-gray-100">
        <h1 className="text-2xl font-bold">Thesis Editor</h1>
        <Button onClick={handleSave}>Save</Button>
      </header>
      <Editor thesisId={thesisId} />
      {thesisId && <CollaboratorPresence thesisId={thesisId} />}
    </div>
  );
};
