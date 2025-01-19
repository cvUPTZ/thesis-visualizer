import React from 'react';
import { SystemStats } from './SystemStats';
import { UserManagement } from './UserManagement';
import FeatureManagement from './FeatureManagement';
import { IssueManagement } from './IssueManagement';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">System Statistics</h2>
            <SystemStats />
          </section>

          <section className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Feature Management</h2>
            <FeatureManagement />
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <UserManagement />
          </section>

          <section className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Issue Management</h2>
            <IssueManagement />
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;