
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EducationSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Education</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">No education details provided yet.</p>
      </CardContent>
    </Card>
  );
};
