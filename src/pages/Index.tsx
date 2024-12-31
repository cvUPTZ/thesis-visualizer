import { ThesisEditor } from "@/components/ThesisEditor";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle, BookOpen, Users, Clock } from "lucide-react";

const Index = () => {
  const { thesisId } = useParams();
  const navigate = useNavigate();

  if (thesisId) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <ThesisEditor thesisId={thesisId} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
            Welcome to Your Thesis Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, manage, and collaborate on your academic work in one place.
          </p>
          <Button
            onClick={() => navigate("/create-thesis")}
            className="bg-primary hover:bg-primary-light text-white"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Start New Thesis
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <BookOpen className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Smart Editor</h3>
            <p className="text-gray-600">
              Advanced formatting tools and real-time preview to help you write your thesis efficiently.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
            <p className="text-gray-600">
              Work seamlessly with advisors and peers with our real-time collaboration features.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <Clock className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Auto-saving</h3>
            <p className="text-gray-600">
              Never lose your work with automatic saving and version history.
            </p>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="bg-editor-bg rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-serif font-bold mb-6 text-primary">Quick Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Getting Started</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Click "Start New Thesis" to create your document</li>
                <li>Use the editor toolbar for formatting options</li>
                <li>Add collaborators through the sharing menu</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Best Practices</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Regularly save your work (though we auto-save too!)</li>
                <li>Use headings to organize your content</li>
                <li>Preview your work in different formats</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;