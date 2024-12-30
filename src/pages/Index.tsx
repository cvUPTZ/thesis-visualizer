// File: /src/pages/Index.tsx
import { Button } from "@/components/ui/button";
import { ThesisEditor } from "@/components/ThesisEditor";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ThesisCreationModal } from "@/components/thesis/ThesisCreationModal";

const Index = () => {
  const navigate = useNavigate();
  const [thesisCreated, setThesisCreated] = useState(false);

    const handleThesisCreated = () => {
        setThesisCreated(true);
        // Optionally, you might want to refresh the list of available theses here if you were displaying any.
    };
    return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end p-4">
        <ThesisCreationModal onThesisCreated={handleThesisCreated}/>
      </div>
      <div className="flex-1">
        <ThesisEditor />
      </div>
    </div>
  );
};

export default Index;