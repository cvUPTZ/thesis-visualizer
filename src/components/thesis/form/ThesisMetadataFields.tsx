import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ThesisMetadataFieldsProps {
  title: string;
  description: string;
  keywords: string;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setKeywords: (value: string) => void;
}

export const ThesisMetadataFields = ({
  title,
  description,
  keywords,
  setTitle,
  setDescription,
  setKeywords,
}: ThesisMetadataFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter thesis title"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of your thesis"
          required
        />
      </div>

      <div>
        <label htmlFor="keywords" className="block text-sm font-medium mb-1">
          Keywords
        </label>
        <Input
          id="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Enter keywords separated by commas"
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          Separate keywords with commas (e.g., AI, Machine Learning, Data Science)
        </p>
      </div>
    </div>
  );
};