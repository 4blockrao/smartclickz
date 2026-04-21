
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award as AwardIcon } from "lucide-react";

interface SkillsSectionProps {
  expertise: string | null;
  coreCompetencies: string[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ expertise, coreCompetencies }) => {
  if (!expertise && coreCompetencies.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2"><AwardIcon className="w-5 h-5 text-primary"/>Skills & Expertise</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {expertise && <Badge variant="secondary" className="text-base px-3 py-1">{expertise}</Badge>}
        {coreCompetencies.map((skill, index) => (
          <Badge key={index} variant="outline" className="text-sm">{skill}</Badge>
        ))}
      </CardContent>
    </Card>
  );
};
