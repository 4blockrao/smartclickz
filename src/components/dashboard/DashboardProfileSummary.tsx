
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const DashboardProfileSummary = ({
  display_name,
  profile_image_url,
  role,
  company,
  city,
  country,
  is_verified,
  points,
  networkerScore,
  age,
}) => (
  <div className="flex flex-col items-center justify-between w-full bg-white shadow-lg rounded-xl p-5 border border-primary/15 min-h-[200px]">
    <Avatar className="w-16 h-16 border-2 border-primary shadow mb-2 bg-white">
      {profile_image_url ? (
        <AvatarImage src={profile_image_url} alt={display_name} />
      ) : (
        <AvatarFallback className="bg-primary/10 text-primary">
          <UserCircle className="w-8 h-8" />
        </AvatarFallback>
      )}
    </Avatar>
    <div className="w-full flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg text-earth truncate">{display_name}</span>
        {is_verified && (
          <span className="ml-1 rounded px-2 py-0.5 bg-green-100 text-green-600 text-xs font-semibold shadow">
            Verified
          </span>
        )}
      </div>
      <div className="text-xs text-muted-foreground flex flex-col items-center">
        <span>{role || <span className="italic text-slate-400">No role</span>} at {company || <span className="italic text-slate-400">N/A</span>}</span>
        <span>
          {[city, country].filter(Boolean).join(", ")}
          {typeof age === "number" ? <> · <b>{age} yrs</b></> : null}
        </span>
      </div>
      <div className="mt-2 text-primary font-medium text-xs">
        Networker Score: <span className="font-bold ml-1">{networkerScore || points || 0}</span>
      </div>
    </div>
    <Button asChild variant="outline" size="sm" className="mt-4 w-full font-semibold rounded-md shadow-sm">
      <Link to="/profile/edit">More</Link>
    </Button>
  </div>
);

