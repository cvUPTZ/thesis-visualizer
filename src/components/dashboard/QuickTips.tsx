export const QuickTips = () => {
  return (
    <div className="mt-8 bg-editor-bg rounded-lg p-8">
      <h2 className="text-xl font-serif font-semibold text-primary mb-4">
        Quick Tips
      </h2>
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
  );
};