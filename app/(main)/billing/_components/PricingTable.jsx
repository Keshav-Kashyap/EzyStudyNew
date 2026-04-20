"use client";

import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
    {
        name: "Starter",
        price: "Free",
        description: "For students getting started with basic access.",
        accent: "from-slate-700 to-slate-900",
        ring: "border-slate-200/80 dark:border-slate-700/80",
        features: [
            "Limited study material access",
            "Basic course browsing",
            "Community updates",
            "Mobile-friendly access"
        ]
    },
    {
        name: "Pro",
        price: "₹199 / month",
        description: "Best for serious learners who want full access.",
        accent: "from-blue-600 via-cyan-500 to-teal-500",
        ring: "border-blue-300/70 dark:border-cyan-400/30 shadow-[0_20px_60px_rgba(37,99,235,0.22)]",
        popular: true,
        features: [
            "Unlimited note downloads",
            "All premium study materials",
            "Priority support",
            "Ad-free learning experience",
            "Early access to new content"
        ]
    },
    {
        name: "Team",
        price: "₹499 / month",
        description: "For groups, mentors, and institutes.",
        accent: "from-purple-600 to-fuchsia-600",
        ring: "border-purple-300/70 dark:border-fuchsia-400/30",
        features: [
            "Everything in Pro",
            "Multi-user access",
            "Team progress support",
            "Custom onboarding",
            "Dedicated assistance"
        ]
    }
];

export default function PricingTable() {
    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(28,28,30,0.82)] md:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.55),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_28%)]" />

            <div className="relative grid gap-5 lg:grid-cols-3">
                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={`relative overflow-hidden border bg-white/85 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)] dark:bg-[rgba(38,38,36,0.92)] ${plan.ring} ${plan.popular ? 'scale-[1.02]' : ''}`}
                    >
                        {plan.popular && (
                            <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <CardHeader className="space-y-4 pb-4">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.accent} flex items-center justify-center shadow-lg`}>
                                {plan.name === 'Starter' ? (
                                    <Sparkles className="w-7 h-7 text-white" />
                                ) : plan.name === 'Pro' ? (
                                    <Crown className="w-7 h-7 text-white" />
                                ) : (
                                    <Zap className="w-7 h-7 text-white" />
                                )}
                            </div>

                            <div className="space-y-2">
                                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {plan.name}
                                </CardTitle>
                                <CardDescription className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                                    {plan.description}
                                </CardDescription>
                            </div>

                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {plan.price}
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-0">
                            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
                                <ul className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                            <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                                <Check className="h-3.5 w-3.5" />
                                            </span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                type="button"
                                disabled
                                className="w-full h-12 rounded-xl font-semibold shadow-lg bg-slate-900 text-white opacity-70 cursor-not-allowed hover:bg-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-white"
                            >
                                Coming soon
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
