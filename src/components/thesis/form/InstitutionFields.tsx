import React from 'react';
import { Input } from "@/components/ui/input";

interface InstitutionFieldsProps {
  values: {
    universityName: string;
    departmentName: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InstitutionFields = ({ values, handleChange }: InstitutionFieldsProps) => {
  return (
    <>
      <div>
        <label htmlFor="universityName" className="block text-sm font-medium mb-1">
          University Name
        </label>
        <Input
          id="universityName"
          name="universityName"
          value={values.universityName}
          onChange={handleChange}
          placeholder="Enter university name"
          required
        />
      </div>

      <div>
        <label htmlFor="departmentName" className="block text-sm font-medium mb-1">
          Department Name
        </label>
        <Input
          id="departmentName"
          name="departmentName"
          value={values.departmentName}
          onChange={handleChange}
          placeholder="Enter department name"
          required
        />
      </div>
    </>
  );
};