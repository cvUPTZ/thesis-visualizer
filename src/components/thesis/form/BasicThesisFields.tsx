import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BasicThesisFieldsProps {
  values: {
    title: string;
    description: string;
    keywords: string;
    supervisorEmail?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const BasicThesisFields = ({
  values,
  handleChange,
}: BasicThesisFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Enter thesis title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Brief description of your thesis"
          required
        />
      </div>

      <div>
        <Label htmlFor="keywords">Keywords</Label>
        <Input
          id="keywords"
          name="keywords"
          value={values.keywords}
          onChange={handleChange}
          placeholder="Enter keywords separated by commas"
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          Separate keywords with commas (e.g., AI, Machine Learning, Data Science)
        </p>
      </div>

      <div>
        <Label htmlFor="supervisorEmail">Supervisor Email</Label>
        <Input
          id="supervisorEmail"
          name="supervisorEmail"
          type="email"
          value={values.supervisorEmail || ''}
          onChange={handleChange}
          placeholder="Enter your supervisor's email"
          required
        />
      </div>
    </div>
  );
};