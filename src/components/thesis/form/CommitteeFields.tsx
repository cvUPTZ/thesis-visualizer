import React from 'react';
import { Input } from "@/components/ui/input";

interface CommitteeFieldsProps {
  committeeMembers: string[];
  handleCommitteeMemberChange: (index: number, value: string) => void;
}

export const CommitteeFields = ({ committeeMembers, handleCommitteeMemberChange }: CommitteeFieldsProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Committee Members
      </label>
      {committeeMembers.map((member, index) => (
        <Input
          key={index}
          name={`committeeMembers[${index}]`}
          value={member}
          onChange={(e) => handleCommitteeMemberChange(index, e.target.value)}
          placeholder={`Committee Member ${index + 1}`}
          className="mb-2"
        />
      ))}
    </div>
  );
};