
import React from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  title?: string;
  description?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({ 
  title = "Loading...", 
  description = "Setting up your experience",
  fullScreen = true
}: LoadingScreenProps) {
  const containerClass = fullScreen 
    ? "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background"
    : "p-4";

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: [0, 0.71, 0.2, 1.01]
        }}
      >
        <Card className="w-full max-w-sm p-8 text-center shadow-lg">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="text-primary-foreground w-8 h-8" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-lg"></div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
            
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
