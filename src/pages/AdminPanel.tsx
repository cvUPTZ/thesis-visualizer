import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-gray-100 p-8">
      <Button
        onClick={() => navigate('/dashboard')}
        variant="ghost"
        className="mb-8 text-[#D6BCFA]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-[#D6BCFA] mb-8">
          Admin Panel
        </h1>
        
        <div className="grid gap-8">
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h2 className="text-2xl font-serif font-semibold text-[#D6BCFA] mb-4">
              System Overview
            </h2>
            <p className="text-gray-400">
              Admin functionality is currently simplified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;