import { Lightbulb, BookOpen, Users, Save } from 'lucide-react';

export const QuickTips = () => {
  return (
    <div>
      <h2 className="text-2xl font-serif font-semibold text-primary mb-6">
        Quick Tips
      </h2>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 rounded-lg p-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Getting Started</h4>
              <p className="text-sm text-muted-foreground">
                Click "Create New Thesis" to begin your academic journey
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-green-50 rounded-lg p-2">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Collaboration</h4>
              <p className="text-sm text-muted-foreground">
                Invite collaborators through the sharing menu in your thesis
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-amber-50 rounded-lg p-2">
              <Save className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Auto-saving</h4>
              <p className="text-sm text-muted-foreground">
                Your work is automatically saved as you type
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-purple-50 rounded-lg p-2">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Best Practices</h4>
              <p className="text-sm text-muted-foreground">
                Use headings to organize your content effectively
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};