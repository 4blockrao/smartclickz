
import React from "react";

interface OnboardingProgressBarProps {
  completed: number;
  total: number;
  pointsEarned: number;
  pointsTotal: number;
}

export default function OnboardingProgressBar({
  completed,
  total,
  pointsEarned,
  pointsTotal,
}: OnboardingProgressBarProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-300">
          Progress: {completed}/{total} tasks completed
        </span>
        <span className="text-sm text-blue-400 font-semibold">
          {pointsEarned}/{pointsTotal} points
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
