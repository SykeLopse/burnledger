import { Prisma, PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const demoSubscriptions: Prisma.SubscriptionCreateWithoutOwnerInput[] = [
  {
    name: "Figma Professional",
    category: "Design",
    amount: new Prisma.Decimal("15.00"),
    currency: "USD",
    billingCycle: "MONTHLY",
    renewalDate: new Date("2026-08-08T00:00:00.000Z"),
    status: "ACTIVE",
  },
  {
    name: "Vercel Pro",
    category: "Infrastructure",
    amount: new Prisma.Decimal("20.00"),
    currency: "USD",
    billingCycle: "MONTHLY",
    renewalDate: new Date("2026-08-12T00:00:00.000Z"),
    status: "ACTIVE",
  },
  {
    name: "Notion Plus",
    category: "Productivity",
    amount: new Prisma.Decimal("12.00"),
    currency: "USD",
    billingCycle: "MONTHLY",
    renewalDate: new Date("2026-08-19T00:00:00.000Z"),
    status: "ACTIVE",
  },
  {
    name: "ChatGPT Plus",
    category: "AI",
    amount: new Prisma.Decimal("20.00"),
    currency: "USD",
    billingCycle: "MONTHLY",
    renewalDate: new Date("2026-08-23T00:00:00.000Z"),
    status: "ACTIVE",
  },
  {
    name: "GitHub Pro",
    category: "Development",
    amount: new Prisma.Decimal("4.00"),
    currency: "USD",
    billingCycle: "MONTHLY",
    renewalDate: new Date("2026-08-30T00:00:00.000Z"),
    status: "ACTIVE",
  },
];

async function main() {
  await prisma.user.upsert({
    where: {
      email: "demo@burnledger.local",
    },
    update: {
      name: "SykeLopse",
      subscriptions: {
        deleteMany: {},
        create: demoSubscriptions,
      },
    },
    create: {
      email: "demo@burnledger.local",
      name: "SykeLopse",
      subscriptions: {
        create: demoSubscriptions,
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
