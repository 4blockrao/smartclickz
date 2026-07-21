import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Target, Zap, Users, TrendingUp, Crown, Gauge, ShieldCheck,
  Calendar, Wallet, ArrowRight, CheckCircle2, Scale, Layers,
} from "lucide-react";

/* Canonical, locked plan numbers (mirror of membership_tiers). 1000 credits = $1. */
const TIERS = [
  { name: "LITE",    price: 50,  tasks: 10,  royalty: false },
  { name: "PRO",     price: 100, tasks: 20,  royalty: false },
  { name: "ELITE",   price: 250, tasks: 50,  royalty: false },
  { name: "DIAMOND", price: 500, tasks: 125, royalty: true },
];

const ROYALTY = [
  ["$25,000", "$500 / mo"],
  ["$50,000", "$1,000 / mo"],
  ["$100,000", "$2,000 / mo"],
  ["$250,000", "$5,000 / mo"],
  ["$500,000", "$10,000 / mo"],
];

const FAQ = [
  ["What is a credit worth?", "1,000 credits = $1. You earn credits for approved tasks and commissions, and withdraw them as cash (1,000 credits = $1)."],
  ["Are earnings guaranteed?", "No. Your daily task allowance is a ceiling, not a promise — it only pays out when advertiser-funded tasks are available and approved. All commissions depend on real activity in your team."],
  ["Who funds the rewards?", "Advertisers. They buy credits and pay for real actions (visits, follows, installs). Members are paid from that real revenue — and total payouts are structurally capped below it."],
  ["Why is there an income cap?", "So limited advertiser demand is shared across many members rather than captured by a few, and so bots and fake accounts have no runaway payoff. To earn more you grow the business, not game it."],
  ["When am I paid?", "Task rewards post on approval. Binary commissions settle weekly (Friday). Royalty is distributed monthly. Withdrawals are requested from your Wallet."],
  ["Do I need KYC?", "Identity verification is required at payout to protect the reward pool from fraud and multi-accounting. Earnings are gross; taxes are your responsibility."],
];

const Section: React.FC<{ id?: string; children: React.ReactNode; className?: string }> = ({ id, children, className = "" }) => (
  <section id={id} className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

const SectionTitle: React.FC<{ eyebrow: string; title: string; sub?: string }> = ({ eyebrow, title, sub }) => (
  <div className="text-center mb-10">
    <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-2">{eyebrow}</p>
    <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
    {sub && <p className="text-slate-400 mt-3 max-w-2xl mx-auto">{sub}</p>}
  </div>
);

const CompensationPlan: React.FC = () => {
  return (
    <div className="bg-slate-950 text-white">
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-700/30 via-indigo-700/20 to-slate-950" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <Section className="relative py-20 sm:py-24 text-center">
          <Badge className="bg-white/10 text-white border-0 mb-5">SmartClicks Compensation Plan</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto">
            Real work, funded by real demand — rewarded fairly.
          </h1>
          <p className="text-slate-300 mt-5 max-w-2xl mx-auto text-lg">
            Earn for completing advertiser-funded tasks, unlock higher rates as you grow, and build a
            binary team for weekly commissions — all within transparent caps that keep the opportunity
            sustainable for everyone.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/packages"><Button className="bg-violet-600 hover:bg-violet-700 text-white">View packages <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
            <a href="#tiers"><Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">See the tiers</Button></a>
          </div>
          <p className="text-xs text-slate-500 mt-6">Illustrative figures. Earnings depend on activity and are not guaranteed.</p>
        </Section>
      </div>

      {/* HOW IT WORKS */}
      <Section className="py-16">
        <SectionTitle eyebrow="The model" title="How the platform works"
          sub="A closed loop where advertiser spending funds member rewards — and payouts are always bounded by that real revenue." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            [Target, "Advertisers fund tasks", "Businesses buy credits and pay for real actions — website visits, follows, installs, surveys."],
            [Sparkles, "Members complete tasks", "You earn a flat credit reward for each approved action, up to your daily allowance."],
            [TrendingUp, "Teams earn commissions", "Refer members into a binary team and earn weekly commissions on balanced volume."],
          ].map(([Icon, t, d]: any) => (
            <div key={t} className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4"><Icon className="h-5 w-5 text-white" /></div>
              <h3 className="font-semibold text-white">{t}</h3>
              <p className="text-slate-400 text-sm mt-1.5">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl bg-slate-900/60 border border-white/10 p-4 text-center text-sm text-slate-300">
          <span className="text-white font-semibold">Currency:</span> 1,000 credits = $1. You earn credits and withdraw them as cash.
        </div>
      </Section>

      {/* TIERS */}
      <Section id="tiers" className="py-16">
        <SectionTitle eyebrow="Membership" title="Package tiers"
          sub="Your tier sets your daily task allowance and your earning cap. All are 12-month memberships." />
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-white/[0.04]">
              <tr className="text-slate-400">
                <th className="text-left p-4 font-medium">Tier</th>
                <th className="text-right p-4 font-medium">Price / yr</th>
                <th className="text-right p-4 font-medium">Tasks / day</th>
                <th className="text-right p-4 font-medium">Rate (base → Booster)</th>
                <th className="text-right p-4 font-medium">Earning cap</th>
                <th className="text-right p-4 font-medium">Royalty</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((t) => (
                <tr key={t.name} className="border-t border-white/5">
                  <td className="p-4 font-semibold text-white flex items-center gap-2">
                    {t.royalty ? <Crown className="h-4 w-4 text-amber-400" /> : <Sparkles className="h-4 w-4 text-violet-400" />}
                    {t.name}
                  </td>
                  <td className="p-4 text-right text-slate-200">${t.price}</td>
                  <td className="p-4 text-right text-slate-200">{t.tasks}</td>
                  <td className="p-4 text-right text-slate-200">25 → 50 credits</td>
                  <td className="p-4 text-right text-slate-200">2× → 3×</td>
                  <td className="p-4 text-right">{t.royalty ? <CheckCircle2 className="h-4 w-4 text-emerald-400 inline" /> : <span className="text-slate-600">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-slate-500 text-xs mt-3">Regular (free) members can complete a small daily allowance but are not eligible for commissions or the cap system.</p>
      </Section>

      {/* INCOME STREAMS */}
      <Section className="py-16">
        <SectionTitle eyebrow="Five ways to earn" title="Income streams" />
        <div className="space-y-4">
          {[
            [Target, "1 · Daily task rewards", "A flat 25 credits per approved task (up to your tier's daily allowance). This is the base of the plan and is open to every member.", "text-sky-400"],
            [Zap, "2 · Booster", "Refer one member on your left leg and one on your right within 30 days to unlock the Booster — permanently doubling your task rate from 25 to 50 credits per task.", "text-amber-400"],
            [Users, "3 · Binary match", "Your team splits into a left and right leg. Each week we match your weaker-leg business volume and pay 10% of it as commission. Unmatched volume on your stronger leg carries over.", "text-emerald-400"],
            [Layers, "4 · Matching bonus", "Earn an additional 10% of the binary commission that each of your personally-referred members earns — rewarding you for helping your team succeed.", "text-violet-400"],
            [Crown, "5 · Lifetime royalty", "Diamond members with $25,000+ of matched volume share a monthly royalty pool funded from real platform revenue. This is the only income stream paid outside the personal cap.", "text-amber-400"],
          ].map(([Icon, t, d, tint]: any) => (
            <div key={t} className="flex items-start gap-4 rounded-2xl bg-white/[0.03] border border-white/10 p-5">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0"><Icon className={`h-5 w-5 ${tint}`} /></div>
              <div>
                <h3 className="font-semibold text-white">{t}</h3>
                <p className="text-slate-400 text-sm mt-1">{d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Royalty table */}
        <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-6">
          <div className="flex items-center gap-2 mb-4"><Crown className="h-5 w-5 text-amber-400" /><h3 className="font-semibold text-white">Diamond royalty schedule</h3></div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {ROYALTY.map(([vol, pay]) => (
              <div key={vol} className="rounded-xl bg-slate-900/60 p-3 text-center">
                <p className="text-slate-400 text-xs">{vol} matched</p>
                <p className="text-amber-300 font-bold mt-1">{pay}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-3">Royalty is pool-bounded: total royalty never exceeds a fixed share of real platform revenue, scaled pro-rata among qualifiers.</p>
        </div>
      </Section>

      {/* BINARY STRUCTURE */}
      <Section className="py-16">
        <SectionTitle eyebrow="Team structure" title="The binary team" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            [Scale, "Two legs", "Every member builds a left and a right leg. New referrals are placed under you with automatic spillover down the outer edge of your chosen leg."],
            [Gauge, "Weekly matching", "Each Friday, your weaker-leg volume is matched and paid at 10%. Balanced building on both legs maximizes your commission."],
            [TrendingUp, "Carryover", "Volume on your stronger leg is never lost — it carries forward week to week until it can be matched."],
          ].map(([Icon, t, d]: any) => (
            <div key={t} className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
              <Icon className="h-6 w-6 text-violet-400 mb-3" />
              <h3 className="font-semibold text-white">{t}</h3>
              <p className="text-slate-400 text-sm mt-1.5">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CAPS + WHY */}
      <Section className="py-16">
        <SectionTitle eyebrow="Fair by design" title="Earning caps — and why they exist" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 space-y-4">
            <div className="flex items-center gap-2"><Gauge className="h-5 w-5 text-emerald-400" /><h3 className="font-semibold text-white">How the cap works</h3></div>
            {[
              ["Total cap", "You can earn up to 2× your package value across all income combined (tasks + commissions)."],
              ["Unlock 3×", "Make 2 direct paying sales within 10 days of joining and your cap lifts from 2× to 3×."],
              ["Daily cap", "A per-day ceiling equal to your package value ÷ 30 keeps earnings steady and abuse-resistant."],
              ["Royalty exempt", "Diamond royalty is the single income stream paid outside the personal cap."],
            ].map(([t, d]) => (
              <div key={t} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div><span className="text-white font-medium">{t}:</span> <span className="text-slate-400">{d}</span></div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-violet-600/15 to-indigo-600/10 border border-violet-500/20 p-6">
            <div className="flex items-center gap-2 mb-3"><ShieldCheck className="h-5 w-5 text-violet-300" /><h3 className="font-semibold text-white">Why we cap income</h3></div>
            <p className="text-slate-300 text-sm leading-relaxed">
              The supply of people willing to complete tasks is effectively unlimited, while advertiser
              demand is finite. Caps ensure that limited, real, advertiser-funded work is spread across
              <span className="text-white font-medium"> as many members as possible</span> — instead of being captured by a few power-users or bots.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed mt-3">
              They also remove the payoff that funds fraud: with a ceiling on any single account, building
              bot farms and fake accounts simply doesn't pay. To earn more you
              <span className="text-white font-medium"> grow the business</span> — upgrade, bring advertisers, or build a team — which is exactly why the cap lifts to 3× when you make real sales.
            </p>
          </div>
        </div>
      </Section>

      {/* PAYOUTS */}
      <Section className="py-16">
        <SectionTitle eyebrow="Getting paid" title="Payout schedule" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            [Sparkles, "Task rewards", "Credited on approval of each task submission."],
            [Calendar, "Binary & matching", "Settled weekly at Friday close."],
            [Crown, "Royalty", "Distributed monthly to qualifying Diamond members."],
          ].map(([Icon, t, d]: any) => (
            <div key={t} className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 text-center">
              <Icon className="h-6 w-6 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white">{t}</h3>
              <p className="text-slate-400 text-sm mt-1.5">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl bg-slate-900/60 border border-white/10 p-4 flex items-center gap-3 justify-center text-sm text-slate-300">
          <Wallet className="h-4 w-4 text-emerald-400" /> Withdraw any time from your Wallet — 1,000 credits = $1.
        </div>
      </Section>

      {/* TRANSPARENCY */}
      <Section className="py-16">
        <SectionTitle eyebrow="Transparency" title="Our commitments" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["No guaranteed returns", "Earnings reflect real activity and available demand. We never promise a fixed return on a membership."],
            ["Payouts below revenue", "Caps and demand-funding structurally keep total payouts under real platform revenue — the opposite of a Ponzi."],
            ["Verification at payout", "Identity checks at withdrawal protect the reward pool from fraud and multi-accounting."],
            ["Your tax responsibility", "Payouts are gross. Reporting and paying any applicable taxes is the member's responsibility."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-1.5"><ShieldCheck className="h-4 w-4 text-emerald-400" /><h3 className="font-semibold text-white">{t}</h3></div>
              <p className="text-slate-400 text-sm">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-16">
        <SectionTitle eyebrow="Questions" title="Frequently asked" />
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ.map(([q, a]) => (
            <div key={q} className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
              <h3 className="font-semibold text-white">{q}</h3>
              <p className="text-slate-400 text-sm mt-1.5">{a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to start earning?</h2>
          <p className="text-white/80 mt-2 max-w-xl mx-auto">Choose a package, complete tasks, and build your team — all within a plan designed to be fair and sustainable.</p>
          <Link to="/packages"><Button className="mt-6 bg-white text-indigo-700 hover:bg-white/90 font-semibold">Choose your package <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
        </div>
      </Section>
    </div>
  );
};

export default CompensationPlan;
