import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export const FeatureManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Feature Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Feature management is not yet configured. Create a features table in the database to enable this functionality.
        </p>
      </CardContent>
    </Card>
  );
};
