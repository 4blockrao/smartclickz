
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  description: string;
  detailLink: string;
  buttonLabel?: string;
  children?: React.ReactNode;
}

export default function SummarySectionCard({
  title,
  description,
  detailLink,
  buttonLabel = "View Details",
  children,
}: Props) {
  return (
    <Card className="p-5 flex flex-col gap-2 mb-2">
      <div className="text-xl font-bold text-primary mb-2">{title}</div>
      <div className="text-muted-foreground">{description}</div>
      {children}
      <div className="flex justify-end mt-2">
        <Button asChild variant="outline" size="sm">
          <Link to={detailLink}>{buttonLabel}</Link>
        </Button>
      </div>
    </Card>
  );
}
