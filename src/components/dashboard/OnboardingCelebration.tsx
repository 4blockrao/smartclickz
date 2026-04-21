
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, Sparkles } from "lucide-react";

interface OnboardingCelebrationProps {
  show: boolean;
}

export default function OnboardingCelebration({ show }: OnboardingCelebrationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="onboarding-celebration"
          initial={{ opacity: 0, y: -15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.92 }}
          transition={{ duration: 0.65, type: "spring" }}
          className="flex flex-col items-center justify-center py-6 bg-gradient-to-r from-yellow-50 via-amber-100/80 to-violet-50/60 rounded-xl shadow-inner border border-primary/10 mb-3 animate-fade-in"
          style={{ position: "relative", zIndex: 5 }}
        >
          <PartyPopper className="w-10 h-10 text-violet-500 animate-bounce mb-2" />
          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 via-indigo-500 to-amber-500">
            🎉 Onboarding 100% Complete!
          </div>
          <div className="text-base mt-1 text-muted-foreground">
            You’ve finished all your onboarding tasks and earned bonus points!
          </div>
          <Sparkles className="w-8 h-8 text-yellow-500 absolute top-2 left-1/2 -translate-x-1/2 animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
