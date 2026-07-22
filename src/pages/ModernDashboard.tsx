import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePointsWallet } from "@/hooks/usePointsWallet";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target,
  Users,
  Flame,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Megaphone,
  UserPlus,
  Wallet,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const POINTS_TO_USD = 0.01;

const ModernDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { pointsBalance } = usePointsWallet(user?.id);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-home", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [profileRes, statsRes, tasksRes, pointsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle(),
        supabase.from("user_stats").select("*").eq("user_id", user!.id).maybeSingle(),
        supabase.from("tasks").select("id,title,payout_points,type").eq("is_active", true).order("created_at", { ascending: false }).limit(4),
        supabase.from("ledger_entries").select("id,amount,category,note,created_at").eq("account_type", "user").eq("account_id", user!.id).order("created_at", { ascending: false }).limit(6),
      ]);
      return {
        profile: profileRes.data,
        stats: statsRes.data,
        tasks: tasksRes.data || [],
        recent: pointsRes.data || [],
      };
    },
  });

  const profile = data?.profile || userProfile;
  const firstName = profile?.display_name?.split(" ")[0] || "there";
  const team = (profile?.team_level1 || 0) + (profile?.team_level2 || 0) + (profile?.team_level3 || 0);
  const streak = data?.stats?.current_streak || 0;
  const level = Math.floor((pointsBalance || 0) / 1000) + 1;
  const activeTasks = data?.tasks?.length || 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  const actions = [
    { label: "Do tasks", icon: Target, to: "/tasks", tint: "from-sky-500 to-blue-600" },
    { label: "Campaigns", icon: Megaphone, to: "/campaigns", tint: "from-violet-500 to-purple-600" },
    { label: "Refer & earn", icon: UserPlus, to: "/referrals", tint: "from-emerald-500 to-green-600" },
    { label: "Wallet", icon: Wallet, to: "/wallet", tint: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Greeting */}
      <div>
        <p className="text-sm text-slate-400">{greeting},</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{firstName} 👋</h1>
      </div>

      {/* Balance hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-6 sm:p-7 shadow-xl shadow-indigo-900/30"
      >
        <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-2 bottom-0 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Sparkles className="h-4 w-4" /> Points balance
          </div>
          <div className="mt-2 text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            {pointsBalance.toLocaleString()}
          </div>
          <div className="mt-1 text-white/70 text-sm">≈ ${(pointsBalance * POINTS_TO_USD).toFixed(2)} USD</div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => navigate("/tasks")}
              className="flex-1 min-h-[44px] rounded-2xl bg-white text-indigo-700 font-semibold text-sm hover:bg-white/90 active:scale-[0.98] transition"
            >
              Earn points
            </button>
            <button
              onClick={() => navigate("/dashboard/withdrawal")}
              className="flex-1 min-h-[44px] rounded-2xl bg-white/15 text-white font-semibold text-sm backdrop-blur hover:bg-white/25 active:scale-[0.98] transition"
            >
              Withdraw
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Quick actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={() => navigate(a.to)}
              className="group rounded-2xl bg-white/[0.04] border border-white/10 p-4 text-left hover:bg-white/[0.07] active:scale-[0.98] transition min-h-[92px] flex flex-col justify-between"
            >
              <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${a.tint} flex items-center justify-center shadow-lg`}>
                <a.icon className="h-5 w-5 text-white" />
              </div>
              <span className="mt-3 text-sm font-medium text-white flex items-center justify-between">
                {a.label}
                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Two-column on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available tasks */}
        <section className="rounded-3xl bg-white/[0.04] border border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Available tasks</h2>
            <button onClick={() => navigate("/tasks")} className="text-xs text-violet-400 hover:text-violet-300">
              View all
            </button>
          </div>
          {data?.tasks.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No tasks right now — check back soon.</p>
          ) : (
            <div className="space-y-2">
              {data?.tasks.map((t: any) => (
                <button
                  key={t.id}
                  onClick={() => navigate("/tasks")}
                  className="w-full flex items-center gap-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] active:scale-[0.99] transition p-3 text-left min-h-[56px]"
                >
                  <div className="h-9 w-9 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center shrink-0">
                    <Target className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white truncate">{t.title}</div>
                    <div className="text-xs text-slate-500 capitalize">{(t.type || "task").replace(/_/g, " ")}</div>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400 shrink-0">+{t.payout_points}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Recent activity */}
        <section className="rounded-3xl bg-white/[0.04] border border-white/10 p-5">
          <h2 className="text-base font-semibold text-white mb-4">Recent activity</h2>
          {data?.recent.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No activity yet.</p>
          ) : (
            <div className="space-y-2">
              {data?.recent.map((e: any) => {
                const positive = Number(e.amount) >= 0;
                return (
                  <div key={e.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3 min-h-[56px]">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${positive ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"}`}>
                      {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white truncate capitalize">{e.note || (e.category || "").replace(/_/g, " ")}</div>
                      <div className="text-xs text-slate-500">{e.created_at ? new Date(e.created_at).toLocaleDateString() : "—"}</div>
                    </div>
                    <span className={`text-sm font-semibold shrink-0 ${positive ? "text-emerald-400" : "text-rose-400"}`}>
                      {positive ? "+" : "-"}{Math.abs(Number(e.amount)).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ModernDashboard;
