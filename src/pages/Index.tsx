import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Settings } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  console.log('Index page rendered with userRole:', userRole);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {userRole === 'admin' && (
          <Button 
            onClick={() => navigate('/admin')} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Admin Panel
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Welcome to the Dashboard</h2>
          <p className="text-gray-600">Here you can manage your content and settings.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <p className="text-gray-600">Check your recent activities and updates.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;