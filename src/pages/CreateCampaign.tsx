import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Coins } from "lucide-react";

interface ActionType {
  slug: string;
  name: string;
  description: string;
  category: string;
  advertiser_cost: number;
  user_reward: number;
}

const SOCIAL = ["social_follow", "social_like", "social_share", "social_comment"];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [actions, setActions] = useState<ActionType[]>([]);
  const [balance, setBalance] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    action_type: "",
    target_platform: "instagram",
    target_url: "",
    quantity: 100,
    countries: "",
    cities: "",
    interests: "",
    proof_requirements: "",
  });

  useEffect(() => {
    supabase.from("action_types" as any).select("*").eq("is_active", true).order("sort_order").then(({ data }) => setActions((data as any) || []));
    if (user) {
      supabase.from("clients").select("wallet_balance").eq("user_id", user.id).maybeSingle().then(({ data }) => setBalance(Number((data as any)?.wallet_balance) || 0));
    }
  }, [user]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const toArr = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

  const selected = actions.find((a) => a.slug === form.action_type);
  const qty = Number(form.quantity) || 0;
  const totalCost = selected ? selected.advertiser_cost * qty : 0;
  const enough = balance >= totalCost;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return toast({ title: "Pick an action to promote", variant: "destructive" });
    if (!form.title.trim()) return toast({ title: "Add a campaign title", variant: "destructive" });
    if (qty <= 0) return toast({ title: "Quantity must be positive", variant: "destructive" });
    if (!enough) return toast({ title: "Insufficient credits", description: `Need ${totalCost.toLocaleString()}, you have ${balance.toLocaleString()}.`, variant: "destructive" });

    setSubmitting(true);
    const { error } = await supabase.rpc("create_credit_campaign" as any, {
      _title: form.title.trim(),
      _description: form.description.trim(),
      _action_type: form.action_type,
      _target_platform: SOCIAL.includes(form.action_type) ? form.target_platform : null,
      _target_url: form.target_url || null,
      _quantity: qty,
      _target_countries: toArr(form.countries),
      _target_cities: toArr(form.cities),
      _target_interests: toArr(form.interests),
      _proof_requirements: form.proof_requirements || null,
    });
    setSubmitting(false);
    if (error) return toast({ title: "Could not create campaign", description: error.message, variant: "destructive" });
    toast({ title: "Campaign launched 🎉", description: `${totalCost.toLocaleString()} credits reserved.` });
    navigate("/client");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => navigate("/client")} className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-1">
            <ArrowLeft className="h-4 w-4" /> Advertiser dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Create Campaign</h1>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2 text-right">
          <div className="text-xs text-slate-400">Balance</div>
          <div className="text-lg font-bold text-white flex items-center gap-1">
            <Coins className="h-4 w-4 text-amber-400" /> {balance.toLocaleString()}
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Action picker */}
        <section className="rounded-3xl bg-white/[0.04] border border-white/10 p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">1. What action do you want?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {actions.map((a) => {
              const on = form.action_type === a.slug;
              return (
                <button
                  type="button"
                  key={a.slug}
                  onClick={() => set("action_type", a.slug)}
                  className={`text-left rounded-2xl border p-3 transition active:scale-[0.98] ${on ? "border-violet-500 bg-violet-600/15" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}
                >
                  <div className="text-sm font-semibold text-white">{a.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{a.description}</div>
                  <div className="mt-2 text-xs font-medium text-amber-400">{a.advertiser_cost} credits / action</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Details */}
        <section className="rounded-3xl bg-white/[0.04] border border-white/10 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">2. Campaign details</h2>
          <div>
            <Label htmlFor="title" className="text-slate-300">Title</Label>
            <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Visit our new product page" className="mt-1 bg-slate-800 border-slate-700 text-white" />
          </div>
          <div>
            <Label htmlFor="desc" className="text-slate-300">Instructions for users</Label>
            <Textarea id="desc" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe exactly what the user should do" rows={3} className="mt-1 bg-slate-800 border-slate-700 text-white" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selected && SOCIAL.includes(selected.slug) && (
              <div>
                <Label className="text-slate-300">Platform</Label>
                <select value={form.target_platform} onChange={(e) => set("target_platform", e.target.value)} className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 text-white h-10 px-3">
                  {["instagram", "facebook", "twitter", "tiktok", "youtube", "linkedin"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            )}
            <div>
              <Label htmlFor="url" className="text-slate-300">Target URL</Label>
              <Input id="url" value={form.target_url} onChange={(e) => set("target_url", e.target.value)} placeholder="https://…" className="mt-1 bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          <div>
            <Label htmlFor="proof" className="text-slate-300">Proof required</Label>
            <Input id="proof" value={form.proof_requirements} onChange={(e) => set("proof_requirements", e.target.value)} placeholder="e.g. Screenshot showing the follow" className="mt-1 bg-slate-800 border-slate-700 text-white" />
          </div>
        </section>

        {/* Targeting */}
        <section className="rounded-3xl bg-white/[0.04] border border-white/10 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">3. Targeting <span className="text-slate-500 font-normal">(optional — leave blank for everyone)</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-slate-300">Countries</Label>
              <Input value={form.countries} onChange={(e) => set("countries", e.target.value)} placeholder="US, UK" className="mt-1 bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <Label className="text-slate-300">Cities</Label>
              <Input value={form.cities} onChange={(e) => set("cities", e.target.value)} placeholder="NYC, London" className="mt-1 bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <Label className="text-slate-300">Interests</Label>
              <Input value={form.interests} onChange={(e) => set("interests", e.target.value)} placeholder="fitness, tech" className="mt-1 bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
        </section>

        {/* Quantity + cost */}
        <section className="rounded-3xl bg-white/[0.04] border border-white/10 p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">4. How many actions?</h2>
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <Label htmlFor="qty" className="text-slate-300">Quantity</Label>
              <Input id="qty" type="number" min={1} value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className="mt-1 w-32 bg-slate-800 border-slate-700 text-white" />
            </div>
            {selected && (
              <div className="flex-1 min-w-[220px] rounded-2xl bg-slate-800/60 border border-white/10 p-4">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>{qty.toLocaleString()} × {selected.advertiser_cost} credits</span>
                  <span className="font-bold text-white">{totalCost.toLocaleString()} credits</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Each user earns</span>
                  <span>{selected.user_reward} credits</span>
                </div>
                <div className={`text-xs mt-2 ${enough ? "text-emerald-400" : "text-rose-400"}`}>
                  {enough ? `Balance after: ${(balance - totalCost).toLocaleString()} credits` : "Insufficient credits — top up first."}
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/client")} className="border-slate-600 text-slate-300">Cancel</Button>
          <Button type="submit" disabled={submitting || !enough || !selected} className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
            {submitting ? "Launching…" : `Launch campaign · ${totalCost.toLocaleString()} credits`}
          </Button>
        </div>
      </form>
    </div>
  );
}
