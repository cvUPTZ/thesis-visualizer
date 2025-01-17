import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicThesisFieldsProps {
  values: {
    title: string;
    description: string;
    keywords: string;
    referenceStyle?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFieldValue: (field: string, value: any) => void;
}

export const BasicThesisFields = ({ values, handleChange, setFieldValue }: BasicThesisFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <Input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Enter thesis title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Enter thesis description"
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="keywords" className="block text-sm font-medium mb-1">
          Keywords
        </label>
        <Input
          id="keywords"
          name="keywords"
          value={values.keywords}
          onChange={handleChange}
          placeholder="Enter keywords (comma separated)"
        />
      </div>

      <div>
        <label htmlFor="referenceStyle" className="block text-sm font-medium mb-1">
          Reference Style
        </label>
        <Select
          value={values.referenceStyle}
          onValueChange={(value) => setFieldValue('referenceStyle', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select reference style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="APA">APA</SelectItem>
            <SelectItem value="MLA">MLA</SelectItem>
            <SelectItem value="Chicago">Chicago</SelectItem>
            <SelectItem value="Vancouver">Vancouver</SelectItem>
            <SelectItem value="Harvard">Harvard</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};