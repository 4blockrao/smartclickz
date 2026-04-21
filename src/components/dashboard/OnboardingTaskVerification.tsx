
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

type Task = {
  id: string;
  name: string;
  verification_type?: string | null;
  points?: number | null;
};

interface OnboardingTaskVerificationProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (task: Task) => void;
}

export default function OnboardingTaskVerification({
  task,
  open,
  onClose,
  onSuccess,
}: OnboardingTaskVerificationProps) {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  if (!open || !task) return null;

  function renderVerificationUI() {
    switch (task.verification_type) {
      case "image_upload":
        return (
          <>
            <p className="mb-4 text-slate-300">Please upload an image to verify this task (e.g., profile picture/screenshot).</p>
            <input
              type="file"
              className="mb-3 w-full text-slate-300 bg-slate-700 border border-slate-600 rounded p-2"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
          </>
        );
      case "link":
      case "social_action":
        return (
          <>
            <p className="mb-4 text-slate-300">Paste the public URL or social post link to verify completion.</p>
            <input
              type="url"
              className="mb-3 w-full rounded border border-slate-600 bg-slate-700 text-white p-2"
              placeholder="Paste link here"
              value={url}
              onChange={e => setUrl(e.target.value)}
              disabled={loading}
            />
          </>
        );
      case "profile_completion":
        return (
          <p className="mb-4 text-slate-300">
            Ensure your profile is filled out fully and saved.
          </p>
        );
      default:
        return (
          <p className="mb-4 text-slate-300">
            Please complete the task as instructed, then click verify below.
          </p>
        );
    }
  }

  const handleSubmit = async () => {
    if (!user || !task) {
      toast({ title: "Error", description: "User not logged in or task missing." });
      return;
    }
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("user_onboarding_task_completions")
        .insert({
          onboarding_task_id: task.id,
          user_id: user.id,
          completed_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast({ title: "Verification successful!", description: "Points credited to your wallet." });
      queryClient.invalidateQueries({ queryKey: ["onboarding-task-completions", user.id] });
      queryClient.invalidateQueries({ queryKey: ["points-ledger", user.id] });
      onSuccess(task);
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700 max-w-md w-full relative animate-fade-in">
        <button
          className="absolute top-2 right-2 bg-slate-700 rounded-full text-slate-400 font-bold w-8 h-8 flex items-center justify-center hover:bg-slate-600"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="font-bold text-white text-xl mb-2">Verify: {task.name}</h3>
        {renderVerificationUI()}
        <Button
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-4 w-full font-medium hover:from-blue-700 hover:to-purple-700"
          onClick={handleSubmit}
        >
          {loading ? "Verifying..." : "Submit for Verification"}
        </Button>
        <p className="mt-3 text-xs text-slate-400">
          {task.verification_type === "profile_completion"
            ? "This will auto-verify when your profile info is complete."
            : "Admins will review submissions if auto-verification is not supported."}
        </p>
      </div>
    </div>
  );
}
