
import React from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper, FileText, Gift, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthCTA } from "@/components/cards/AuthCTAHelper";

const actions = [
  {
    label: "Submit News Article (Free)",
    icon: Newspaper,
    color: "bg-green-100 text-green-700",
    to: "/news/submit",
    isFree: true,
  },
  {
    label: "Submit Press Release",
    icon: FileText,
    color: "bg-orange-50 text-orange-700",
    to: "/submit-press-release",
  },
  {
    label: "Submit Classified Ad",
    icon: Gift,
    color: "bg-yellow-100 text-yellow-800",
    to: "/submit-classified",
  },
  {
    label: "Submit Community Task",
    icon: Gift,
    color: "bg-blue-100 text-blue-700",
    to: "/submit-task",
  },
  {
    label: "Find Networker",
    icon: Users,
    color: "bg-primary/10 text-primary",
    to: "/profiles",
  },
  {
    label: "Browse Campaigns",
    icon: Briefcase,
    color: "bg-secondary/10 text-secondary",
    to: "/campaigns",
  },
];

export default function DashboardActionPanel() {
  const navigate = useNavigate();
  const authCTA = useAuthCTA();

  return (
    <Card className="flex flex-wrap justify-between gap-4 p-6 mb-4">
      {actions.map(({ label, icon: Icon, color, to, isFree }) => (
        <Button
          key={label}
          size="lg"
          className={`flex-1 min-w-[170px] max-w-xs justify-center items-center gap-2 ${color} font-bold text-base shadow-sm transition whitespace-nowrap`}
          onClick={() =>
            isFree ? navigate(to) : authCTA(() => navigate(to))
          }
        >
          <Icon className="w-5 h-5 mr-2" />
          {label}
        </Button>
      ))}
    </Card>
  );
}
