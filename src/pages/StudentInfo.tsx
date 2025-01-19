import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const StudentInfo = () => {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Student Information</h1>
      {user && (
        <div>
          <p>Email: {user.email}</p>
        </div>
      )}
      <Button>Update Info</Button>
    </div>
  );
};

export default StudentInfo;