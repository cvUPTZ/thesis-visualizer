import React from 'react';
import { Input } from "@/components/ui/input";

interface BasicThesisFieldsProps {
  values: {
    title: string;
    description: string;
    keywords: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasicThesisFields = ({ values, handleChange }: BasicThesisFieldsProps) => {
  return (
    <>
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
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Input
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Enter a brief description of your thesis"
          required
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
          placeholder="Enter keywords separated by commas"
          required
        />
      </div>
    </>
  );
};