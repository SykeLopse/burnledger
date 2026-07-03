"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  BellRing,
  CalendarClock,
  ChevronRight,
  CircleDollarSign,
  Command,
  CreditCard,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Sparkles,
  TrendingDown,
  WalletCards,
  X,
} from "lucide-react";

type Subscription = {
  id: number;
  name: string;
  category: string;
  amount: number;
  billing: "Monthly" | "Annual";
  renewal: string;
  accent: string;
};

const initialSubscriptions: Subscription[] = [
  {
    id: 1,
    name: "Figma Professional",
    category: "Design",
    amount: 15,
    billing: "Monthly",
    renewal: "2026-07-08",
    accent: "from-purple-500 to-fuchsia-500",
  },
  {
    id: 2,
    name: "Vercel Pro",
    category: "Infrastructure",
    amount: 20,
    billing: "Monthly",
    renewal: "2026-07-12",
    accent: "from-slate-200 to-slate-500",
  },
  {
    id: 3,
    name: "Notion Plus",
    category: "Productivity",
    amount: 12,
    billing: "Monthly",
    renewal: "2026-07-19",
    accent: "from-amber-400 to-orange-500",
  },
  {
    id: 4,
    name: "ChatGPT Plus",
    category: "AI",
    amount: 20,
    billing: "Monthly",
    renewal: "2026-07-23",
    accent: "from-emerald-400 to-cyan-500",
  },
  {
    id: 5,
    name: "GitHub Pro",
    category: "Development",
    amount: 4,
    billing: "Monthly",
    renewal: "2026-07-30",
    accent: "from-slate-500 to-slate-700",
  },
];

const monthlySeries = [
  { month: "Feb", spend: 54 },
  { month: "Mar", spend: 67 },
  { month: "Apr", spend: 72 },
  { month: "May", spend: 66 },
  { month: "Jun", spend: 71 },
  { month: "Jul", spend: 71 },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const renewalDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));

export default function Home() {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(initialSubscriptions);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftAmount, setDraftAmount] = useState("");
  const [notice, setNotice] = useState("");

  const monthlyBurn = useMemo(
    () =>
      subscriptions.reduce(
        (total, subscription) =>
          total +
          (subscription.billing === "Annual"
            ? subscription.amount / 12
            : subscription.amount),
        0,
      ),
    [subscriptions],
  );

  const annualBurn = monthlyBurn * 12;
  const potentialSavings = monthlyBurn * 0.19;

  const chartData = useMemo(
    () =>
      monthlySeries.map((item, index) =>
        index === monthlySeries.length - 1
          ? { ...item, spend: Math.round(monthlyBurn) }
          : item,
      ),
    [monthlyBurn],
  );

  const categoryData = useMemo(() => {
    const grouped = subscriptions.reduce<Record<string, number>>(
      (accumulator, subscription) => {
        const monthlyAmount =
          subscription.billing === "Annual"
            ? subscription.amount / 12
            : subscription.amount;

        accumulator[subscription.category] =
          (accumulator[subscription.category] ?? 0) + monthlyAmount;

        return accumulator;
      },
      {},
    );

    return Object.entries(grouped)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [subscriptions]);

  const visibleSubscriptions = subscriptions.filter((subscription) =>
    `${subscription.name} ${subscription.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  function createSubscription(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amount = Number(draftAmount);

    if (!draftName.trim() || !Number.isFinite(amount) || amount <= 0) {
      setNotice("Enter a subscription name and a valid monthly amount.");
      return;
    }

    setSubscriptions((current) => [
      ...current,
      {
        id: Date.now(),
        name: draftName.trim(),
        category: "Personal",
        amount,
        billing: "Monthly",
        renewal: "2026-08-01",
        accent: "from-sky-400 to-indigo-500",
      },
    ]);

    setDraftName("");
    setDraftAmount("");
    setShowCreate(false);
    setNotice(`${draftName.trim()} was added to this dashboard session.`);
  }

  return (
    <main className="min-h-screen bg-[#070a0f] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-white/8 bg-[#0a0f17] px-4 py-6 lg:block">
          <div className="mb-10 flex items-center gap-3 px-3">
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-400 font-black text-slate-950 shadow-lg shadow-cyan-500/20">
              BL
            </div>
            <div>
              <p className="font-semibold tracking-tight">BurnLedger</p>
              <p className="text-xs text-slate-500">Spend intelligence</p>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            <a className="flex items-center gap-3 rounded-xl bg-white/8 px-3 py-3 font-medium text-white">
              <LayoutDashboard className="size-4" />
              Overview
            </a>
            <a className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-white/5 hover:text-white">
              <WalletCards className="size-4" />
              Subscriptions
            </a>
            <a className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-white/5 hover:text-white">
              <Sparkles className="size-4" />
              Savings insights
            </a>
            <a className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition hover:bg-white/5 hover:text-white">
              <CreditCard className="size-4" />
              Payment methods
            </a>
          </nav>

          <div className="mt-auto pt-72">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
              <Settings2 className="size-4" />
              Preferences
            </button>
            <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
              <p className="text-xs font-medium text-cyan-300">PRO TIP</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Review subscriptions before their trial or renewal date.
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 bg-[#070a0f]/90 px-5 py-4 backdrop-blur xl:px-10">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-400 text-sm font-black text-slate-950">
                BL
              </div>
              <span className="font-semibold">BurnLedger</span>
            </div>

            <label className="group order-3 flex w-full items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-3 py-2.5 text-slate-400 transition focus-within:border-cyan-300/40 focus-within:bg-white/6 lg:order-2 lg:w-[360px]">
              <Search className="size-4" />
              <input
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                placeholder="Search subscriptions"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <span className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-500 sm:block">
                ⌘ K
              </span>
            </label>

            <div className="order-2 ml-auto flex items-center gap-3 lg:order-3">
              <button className="relative grid size-10 place-items-center rounded-xl border border-white/8 bg-white/4 text-slate-300 transition hover:bg-white/8">
                <BellRing className="size-4" />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-cyan-300" />
              </button>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                <Plus className="size-4" />
                Add subscription
              </button>
            </div>
          </header>

          <section className="px-5 py-8 xl:px-10">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-medium text-cyan-300">
                  Good afternoon, SykeLopse
                </p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Your subscription pulse
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  A focused view of recurring software spend, renewals, and savings opportunities.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 p-1 text-xs">
                <button className="rounded-lg bg-white/10 px-3 py-2 font-medium text-white">
                  This month
                </button>
                <button className="rounded-lg px-3 py-2 text-slate-400">
                  Last 6 months
                </button>
              </div>
            </div>

            {notice ? (
              <div className="mb-6 flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/8 px-4 py-3 text-sm text-cyan-100">
                <span>{notice}</span>
                <button onClick={() => setNotice("")} aria-label="Dismiss notification">
                  <X className="size-4" />
                </button>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Monthly burn"
                value={money(monthlyBurn)}
                detail="+4.2% from last month"
                trend="up"
                icon={<CircleDollarSign className="size-5" />}
              />
              <MetricCard
                label="Annual commitment"
                value={money(annualBurn)}
                detail={`${subscriptions.length} active subscriptions`}
                trend="neutral"
                icon={<WalletCards className="size-5" />}
              />
              <MetricCard
                label="Upcoming renewals"
                value="3"
                detail="Due in the next 14 days"
                trend="down"
                icon={<CalendarClock className="size-5" />}
              />
              <MetricCard
                label="Possible savings"
                value={money(potentialSavings)}
                detail="Based on utilization signals"
                trend="down"
                icon={<TrendingDown className="size-5" />}
              />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
              <section className="rounded-2xl border border-white/8 bg-[#0b111b] p-5 shadow-2xl shadow-black/20">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Burn-rate trend</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Monthly recurring spend across your stack
                    </p>
                  </div>
                  <button className="grid size-9 place-items-center rounded-lg text-slate-400 transition hover:bg-white/6 hover:text-white">
                    <MoreHorizontal className="size-5" />
                  </button>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -14, bottom: 0 }}>
                      <defs>
                        <linearGradient id="spendGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#67e8f9" stopOpacity={0.34} />
                          <stop offset="100%" stopColor="#67e8f9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="#ffffff" strokeOpacity={0.07} />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        cursor={{ stroke: "#67e8f9", strokeOpacity: 0.3 }}
                        contentStyle={{
                          background: "#101826",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: 12,
                        }}
                        labelStyle={{ color: "#cbd5e1" }}
                        itemStyle={{ color: "#67e8f9" }}
                        formatter={(value) => [money(Number(value)), "Monthly burn"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="spend"
                        stroke="#67e8f9"
                        strokeWidth={3}
                        fill="url(#spendGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="rounded-2xl border border-white/8 bg-[#0b111b] p-5 shadow-2xl shadow-black/20">
                <div className="mb-6">
                  <p className="text-sm font-medium text-slate-200">Spend by category</p>
                  <p className="mt-1 text-sm text-slate-500">Where your budget goes</p>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="category"
                        width={92}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                        contentStyle={{
                          background: "#101826",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: 12,
                        }}
                        formatter={(value) => [money(Number(value)), "Monthly spend"]}
                      />
                      <Bar dataKey="amount" radius={[0, 6, 6, 0]} fill="#818cf8" barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">
                  View full breakdown
                  <ChevronRight className="size-4" />
                </button>
              </section>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
              <section className="rounded-2xl border border-white/8 bg-[#0b111b]">
                <div className="flex items-center justify-between border-b border-white/8 px-5 py-5">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Active subscriptions</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {visibleSubscriptions.length} shown from {subscriptions.length} active services
                    </p>
                  </div>
                  <button className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200">
                    Manage all
                  </button>
                </div>

                <div className="divide-y divide-white/8">
                  {visibleSubscriptions.map((subscription) => (
                    <article
                      key={subscription.id}
                      className="flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-white/[0.025]"
                    >
                      <div className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br ${subscription.accent} font-bold text-slate-950`}>
                        {subscription.name.slice(0, 1)}
                      </div>
                      <div className="min-w-36 flex-1">
                        <p className="font-medium text-slate-100">{subscription.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{subscription.category}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="font-medium text-slate-100">{money(subscription.amount)}</p>
                        <p className="mt-1 text-xs text-slate-500">{subscription.billing}</p>
                      </div>
                      <div className="hidden w-28 text-right sm:block">
                        <p className="text-xs text-slate-500">Renews</p>
                        <p className="mt-1 text-sm text-slate-300">{renewalDate(subscription.renewal)}</p>
                      </div>
                      <button className="grid size-9 place-items-center rounded-lg text-slate-500 transition hover:bg-white/6 hover:text-white">
                        <MoreHorizontal className="size-5" />
                      </button>
                    </article>
                  ))}

                  {visibleSubscriptions.length === 0 ? (
                    <div className="px-5 py-12 text-center text-sm text-slate-500">
                      No subscriptions match “{search}”.
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="rounded-2xl border border-cyan-300/15 bg-gradient-to-b from-cyan-300/10 to-[#0b111b] p-5">
                <div className="flex items-center justify-between">
                  <div className="grid size-10 place-items-center rounded-xl bg-cyan-300 text-slate-950">
                    <Sparkles className="size-5" />
                  </div>
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200">
                    SAVINGS SIGNAL
                  </span>
                </div>
                <h2 className="mt-6 text-xl font-semibold tracking-tight">
                  Your AI stack costs more than your design stack.
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Review overlapping AI tools and annual billing options. One cancellation could reduce your burn rate by about {money(potentialSavings)} per month.
                </p>
                <button className="mt-6 flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100">
                  Review recommendation
                  <ArrowUpRight className="size-4" />
                </button>
              </section>
            </div>
          </section>
        </div>
      </div>

      {showCreate ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <form
            onSubmit={createSubscription}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101826] p-6 shadow-2xl shadow-black/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold">Add subscription</p>
                <p className="mt-1 text-sm text-slate-400">
                  This demo adds data for the current browser session. Database persistence comes next.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="grid size-9 place-items-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-slate-300">
                Service name
                <input
                  autoFocus
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  placeholder="e.g. Linear"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Monthly amount (USD)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draftAmount}
                  onChange={(event) => setDraftAmount(event.target.value)}
                  placeholder="12"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                <Plus className="size-4" />
                Add service
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="fixed bottom-4 right-4 hidden items-center gap-2 rounded-xl border border-white/8 bg-[#101826]/95 px-3 py-2 text-xs text-slate-400 shadow-xl backdrop-blur md:flex">
        <Command className="size-3.5 text-cyan-300" />
        Local development mode
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  detail,
  trend,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}) {
  const trendIcon =
    trend === "up" ? (
      <ArrowUpRight className="size-3.5" />
    ) : trend === "down" ? (
      <ArrowDownRight className="size-3.5" />
    ) : null;

  return (
    <section className="rounded-2xl border border-white/8 bg-[#0b111b] p-5 shadow-2xl shadow-black/20">
      <div className="flex items-start justify-between">
        <div className="grid size-10 place-items-center rounded-xl bg-white/6 text-cyan-200">
          {icon}
        </div>
        {trendIcon ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${
              trend === "up"
                ? "bg-amber-300/10 text-amber-200"
                : "bg-emerald-300/10 text-emerald-200"
            }`}
          >
            {trendIcon}
            {trend === "up" ? "Watch" : "Healthy"}
          </span>
        ) : null}
      </div>
      <p className="mt-6 text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </section>
  );
}
