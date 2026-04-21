
import React from "react";

/**
 * Round notification badge with optional count.
 */
export default function NotificationBadge({ count }: { count?: number }) {
  if (!count || count <= 0) return null;
  return (
    <span className="inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 ml-1">
      {count > 9 ? "9+" : count}
    </span>
  );
}
