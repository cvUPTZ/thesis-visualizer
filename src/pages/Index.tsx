// File: /src/pages/Index.tsx
import { Button } from "@/components/ui/button";
import { ThesisEditor } from "@/components/ThesisEditor";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const handleCreateThesisClick = () => {
    navigate("/create-thesis");
  };

  return (
    <div className="flex flex-col h-full">
        <div className="flex justify-end p-4">
             <Button onClick={handleCreateThesisClick}>Create New Thesis</Button>
        </div>
        <div className="flex-1">
          <ThesisEditor />
        </div>
    </div>
  );
};

export default Index;