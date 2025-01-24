import { Input } from "@/components/ui/input";

interface AuthorFieldsProps {
  values: {
    authorName: string;
    thesisDate: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export const AuthorFields = ({ 
  values,
  errors,
  onChange
}: AuthorFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="authorName" className="block text-sm font-medium mb-1">
          Author Name
        </label>
        <Input
          id="authorName"
          value={values.authorName}
          onChange={(e) => onChange('authorName', e.target.value)}
          placeholder="Enter author name"
        />
        {errors.authorName && <p className="text-red-500 text-sm mt-1">{errors.authorName}</p>}
      </div>

      <div>
        <label htmlFor="thesisDate" className="block text-sm font-medium mb-1">
          Thesis Date
        </label>
        <Input
          id="thesisDate"
          type="date"
          value={values.thesisDate}
          onChange={(e) => onChange('thesisDate', e.target.value)}
        />
        {errors.thesisDate && <p className="text-red-500 text-sm mt-1">{errors.thesisDate}</p>}
      </div>
    </div>
  );
};