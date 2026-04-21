
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AboutSectionProps {
  bio: string | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ bio }) => {
  if (!bio) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">About</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-line">{bio}</p>
      </CardContent>
    </Card>
  );
};
