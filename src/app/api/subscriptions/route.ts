import { NextResponse } from "next/server";
import type { Subscription } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

const DEMO_EMAIL = "demo@burnledger.local";

const categoryAccent: Record<string, string> = {
  AI: "from-emerald-400 to-cyan-500",
  Design: "from-purple-500 to-fuchsia-500",
  Development: "from-slate-500 to-slate-700",
  Infrastructure: "from-slate-200 to-slate-500",
  Personal: "from-sky-400 to-indigo-500",
  Productivity: "from-amber-400 to-orange-500",
};

async function getDemoUser() {
  return prisma.user.upsert({
    where: {
      email: DEMO_EMAIL,
    },
    update: {},
    create: {
      email: DEMO_EMAIL,
      name: "SykeLopse",
    },
  });
}

function serializeSubscription(subscription: Subscription) {
  return {
    id: subscription.id,
    name: subscription.name,
    category: subscription.category,
    amount: Number(subscription.amount),
    billing: subscription.billingCycle === "YEARLY" ? "Annual" : "Monthly",
    renewal: subscription.renewalDate.toISOString().slice(0, 10),
    accent:
      categoryAccent[subscription.category] ?? "from-sky-400 to-indigo-500",
  };
}

export async function GET() {
  const user = await getDemoUser();

  const subscriptions = await prisma.subscription.findMany({
    where: {
      ownerId: user.id,
      status: {
        in: ["ACTIVE", "TRIAL"],
      },
    },
    orderBy: {
      renewalDate: "asc",
    },
  });

  return NextResponse.json(subscriptions.map(serializeSubscription));
}

export async function POST(request: Request) {
  const body = await request.json();

  const name = String(body.name ?? "").trim();
  const amount = Number(body.amount);
  const category = String(body.category ?? "Personal").trim() || "Personal";

  if (!name || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      {
        error: "Enter a subscription name and a valid monthly amount.",
      },
      {
        status: 400,
      },
    );
  }

  const user = await getDemoUser();

  const subscription = await prisma.subscription.create({
    data: {
      ownerId: user.id,
      name,
      category,
      amount: amount.toFixed(2),
      currency: "INR",
      billingCycle: "MONTHLY",
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
    },
  });

  return NextResponse.json(serializeSubscription(subscription), {
    status: 201,
  });
}
