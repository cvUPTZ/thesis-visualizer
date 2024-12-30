// File: src/pages/Index.tsx

import { ThesisEditor } from "@/components/ThesisEditor";
import { useParams } from "react-router-dom";

const Index = () => {
  const { thesisId } = useParams();

  return (
      <div className="flex flex-col h-full">
        <div className="flex-1">
            <ThesisEditor thesisId={thesisId} />
        </div>
      </div>
  );
};

export default Index;