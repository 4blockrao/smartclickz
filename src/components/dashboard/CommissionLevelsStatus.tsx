
import React from "react";

/**
 * Props:
 * - directs: number of user's direct referrals
 * - className?: additional Tailwind/sizing classes
 */
export function CommissionLevelsStatus({ directs, className = "" }: { directs: number, className?: string }) {
  // Commission requirements for each level
  const LEVELS = [
    { level: 1, required: 1, percent: 25 },
    { level: 2, required: 2, percent: 10 },
    { level: 3, required: 3, percent: 5 },
    { level: 4, required: 4, percent: 5 },
    { level: 5, required: 5, percent: 5 },
  ];
  return (
    <div className={`rounded-lg bg-muted/60 border p-3 mt-1 ${className}`}>
      <div className="font-semibold text-sm mb-2 text-primary">Commission Levels</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-3 text-sm">
        {LEVELS.map(({ level, required, percent }) => {
          const unlocked = directs >= required;
          return (
            <div
              key={level}
              className={`flex items-center gap-2 py-1 ${unlocked ? "opacity-100" : "opacity-60"}`}
            >
              <span className={`inline-block rounded-full w-2 h-2 ${unlocked ? "bg-green-500" : "bg-gray-400"}`} />
              <span className="font-bold mr-1">Level {level}</span>
              <span className="">{percent}%</span>
              <span className="ml-2">
                {unlocked
                  ? <span className="text-green-700 font-semibold">Unlocked</span>
                  : (
                    <span className="text-gray-500">
                      Locked (need {required - directs} more direct{required - directs > 1 ? "s" : ""})
                    </span>
                  )}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        To unlock a commission level, you must refer at least that many direct members.
      </div>
    </div>
  );
}
