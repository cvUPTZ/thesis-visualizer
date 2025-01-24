import { Input } from "@/components/ui/input";

interface InstitutionFieldsProps {
  values: {
    universityName: string;
    departmentName: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export const InstitutionFields = ({ 
  values,
  errors,
  onChange
}: InstitutionFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="universityName" className="block text-sm font-medium mb-1">
          University Name
        </label>
        <Input
          id="universityName"
          value={values.universityName}
          onChange={(e) => onChange('universityName', e.target.value)}
          placeholder="Enter university name"
        />
        {errors.universityName && <p className="text-red-500 text-sm mt-1">{errors.universityName}</p>}
      </div>

      <div>
        <label htmlFor="departmentName" className="block text-sm font-medium mb-1">
          Department Name
        </label>
        <Input
          id="departmentName"
          value={values.departmentName}
          onChange={(e) => onChange('departmentName', e.target.value)}
          placeholder="Enter department name"
        />
        {errors.departmentName && <p className="text-red-500 text-sm mt-1">{errors.departmentName}</p>}
      </div>
    </div>
  );
};