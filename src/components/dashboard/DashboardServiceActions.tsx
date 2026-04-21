
import React from "react";
import { ServiceActionCTA } from "@/components/dashboard/ServiceActionCTA";

export function DashboardServiceActions({ pointsBalance }: { pointsBalance: number }) {
  // Add or adjust actions/services here as needed
  const actions = [
    {
      serviceName: "submit_press_release",
      label: "Submit a Press Release",
      icon: <span role="img" aria-label="Press Release">📰</span>,
      to: "/submit-press-release"
    },
    {
      serviceName: "submit_news_article",
      label: "Submit a News Article",
      icon: <span role="img" aria-label="News Article">🗞️</span>,
      to: "/submit-news-article"
    },
    {
      serviceName: "classified_post",
      label: "Submit a Classified Ad",
      icon: <span role="img" aria-label="Classified Ad">📃</span>,
      to: "/submit-classified"
    },
    {
      serviceName: "submit_task",
      label: "Submit a Task",
      icon: <span role="img" aria-label="Task">✅</span>,
      to: "/submit-task"
    },
  ];

  return (
    <div className="my-6">
      <div className="mb-2 font-bold text-xl text-primary">
        Submit new — Use your points!
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {actions.map(action => (
          <ServiceActionCTA
            key={action.serviceName}
            serviceName={action.serviceName}
            label={action.label}
            icon={action.icon}
            userPoints={pointsBalance}
            to={action.to}
          />
        ))}
      </div>
    </div>
  );
}
