
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, User, Settings, Shield, DollarSign } from "lucide-react";

export default function AdminActivityLog() {
  const activities = [
    { id: 1, user: "Admin User", action: "Updated user permissions", type: "security", time: "2 minutes ago" },
    { id: 2, user: "John Doe", action: "Completed task #123", type: "task", time: "5 minutes ago" },
    { id: 3, user: "Jane Smith", action: "Made withdrawal request", type: "financial", time: "10 minutes ago" },
    { id: 4, user: "Admin User", action: "Approved campaign", type: "campaign", time: "15 minutes ago" },
    { id: 5, user: "Mike Johnson", action: "Registered new account", type: "user", time: "30 minutes ago" },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="w-4 h-4" />;
      case 'financial': return <DollarSign className="w-4 h-4" />;
      case 'user': return <User className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'security': return 'destructive';
      case 'financial': return 'default';
      case 'user': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm text-gray-500">Last updated: now</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{activity.user}</span>
                    <Badge variant={getBadgeVariant(activity.type) as any}>
                      {getIcon(activity.type)}
                      <span className="ml-1 capitalize">{activity.type}</span>
                    </Badge>
                  </div>
                  <p className="text-gray-700">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
