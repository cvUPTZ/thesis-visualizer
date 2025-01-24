import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicThesisFieldsProps {
  values: {
    title: string;
    description: string;
    keywords: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export const BasicThesisFields = ({
  values,
  errors,
  onChange
}: BasicThesisFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <Input
          id="title"
          value={values.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Enter thesis title"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Enter thesis description"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="keywords" className="block text-sm font-medium mb-1">
          Keywords
        </label>
        <Input
          id="keywords"
          value={values.keywords}
          onChange={(e) => onChange('keywords', e.target.value)}
          placeholder="Comma-separated keywords"
        />
        {errors.keywords && <p className="text-red-500 text-sm mt-1">{errors.keywords}</p>}
      </div>
    </div>
  );
};