
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/**
 * Floating action button for mobile, expands to show core CTAs.
 */
export default function FabMainActions() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const actions = [
    { label: "Submit News (Free)", to: "/news/submit" },
    { label: "Submit Press Release", to: "/submit-press-release" },
    { label: "Submit Classified", to: "/submit-classified" },
    { label: "Submit Community Task", to: "/submit-task" },
  ];

  return (
    <div className="fixed z-50 bottom-5 right-5 sm:hidden flex flex-col items-end gap-2">
      {open &&
        actions.map((action, i) => (
          <Button
            key={action.label}
            variant="secondary"
            className="shadow-lg px-4 py-2 text-base"
            onClick={() => {
              setOpen(false);
              navigate(action.to);
            }}
            style={{
              transitionDelay: `${i * 30}ms`,
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(15px)",
            }}
          >
            {action.label}
          </Button>
        ))}
      <Button
        variant="default"
        size="icon"
        className="shadow-xl rounded-full w-16 h-16 flex items-center justify-center text-2xl transition-transform"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open main actions"
      >
        <Plus />
      </Button>
    </div>
  );
}
