import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle, MessageCircle, UserPlus } from "lucide-react";

export function StandardNetworkerCard({
  id,
  name,
  age,
  photo,
  city,
  country,
  company,
  tagline,
  primarySkill,
  isVerified,
  profileUrl,
  onFollow,
  onMessage,
}) {
  return (
    <div className="bg-white rounded-xl shadow border p-4 flex flex-col items-center transition hover:shadow-md">
      <Link to={profileUrl || `/profiles/${id}`} className="w-full flex flex-col items-center">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-muted mb-2">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <UserCircle className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <h2 className="font-bold text-lg text-center mt-1">{name}</h2>
        {primarySkill && (
          <div className="text-primary text-xs mb-1">{primarySkill}</div>
        )}
        <div className="text-xs text-muted-foreground mb-1">
          {city}{city && country ? ", " : ""}{country}
        </div>
        <div className="text-sm text-muted-foreground mb-2 text-center">{tagline}</div>
      </Link>
      <div className="flex gap-2 mt-auto pt-2 w-full">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={onFollow}
        >
          <UserPlus className="w-3 h-3 mr-1" />
          Follow
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={onMessage}
        >
          <MessageCircle className="w-3 h-3 mr-1" />
          Message
        </Button>
      </div>
    </div>
  );
}
