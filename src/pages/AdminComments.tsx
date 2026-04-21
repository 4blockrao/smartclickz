
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Flag } from "lucide-react";

export default function AdminComments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Comments Management</h1>
        <div className="flex gap-2">
          <Badge variant="outline">5 Pending</Badge>
          <Badge variant="destructive">2 Flagged</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 p-4 border rounded-lg">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">User {i}</span>
                    <Badge variant={i % 3 === 0 ? "destructive" : "secondary"}>
                      {i % 3 === 0 ? "Flagged" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-2">
                    This is a sample comment content that needs moderation. Lorem ipsum dolor sit amet.
                  </p>
                  <p className="text-sm text-gray-500">2 hours ago on "Post Title {i}"</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Check className="w-4 h-4 text-green-600" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <X className="w-4 h-4 text-red-600" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
