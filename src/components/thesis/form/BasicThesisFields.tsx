import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface BasicThesisFieldsProps {
  values: {
    title: string;
    description: string;
    keywords: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFieldValue?: (field: string, value: any) => void;
}

export const BasicThesisFields: React.FC<BasicThesisFieldsProps> = ({
  values,
  handleChange,
  setFieldValue
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Enter thesis title"
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Enter thesis description"
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
          Keywords
        </label>
        <Input
          id="keywords"
          name="keywords"
          value={values.keywords}
          onChange={handleChange}
          placeholder="Enter keywords (comma separated)"
          className="mt-1"
        />
      </div>
    </div>
  );
};