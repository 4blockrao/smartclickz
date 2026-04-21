
import React from "react";
const demo = [
  { icon: "🎉", text: "You earned ₹250 this week!", color: "#134e58" },
  { icon: "📣", text: "Jaipur meetup on Sunday, register now", color: "#233973" },
  { icon: "🚨", text: "Points reset in 10 days — redeem soon!", color: "#73232f" },
];
export default function AnnouncementCards() {
  return (
    <div className="flex flex-col gap-2 animate-fade-in">
      {demo.map((a, i) => (
        <div key={i} className="rounded-lg px-3 py-2 text-white font-bold flex items-center" style={{ background: a.color }}>
          <span className="text-lg mr-2">{a.icon}</span>
          <span className="text-sm">{a.text}</span>
        </div>
      ))}
    </div>
  );
}
