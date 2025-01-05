import React from 'react';
import { Input } from "@/components/ui/input";

interface AuthorFieldsProps {
  values: {
    authorName: string;
    thesisDate: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AuthorFields = ({ values, handleChange }: AuthorFieldsProps) => {
  return (
    <>
      <div>
        <label htmlFor="authorName" className="block text-sm font-medium mb-1">
          Author Name
        </label>
        <Input
          id="authorName"
          name="authorName"
          value={values.authorName}
          onChange={handleChange}
          placeholder="Enter author name"
          required
        />
      </div>

      <div>
        <label htmlFor="thesisDate" className="block text-sm font-medium mb-1">
          Thesis Date
        </label>
        <Input
          id="thesisDate"
          name="thesisDate"
          value={values.thesisDate}
          onChange={handleChange}
          placeholder="Enter date of thesis submission"
          required
        />
      </div>
    </>
  );
};