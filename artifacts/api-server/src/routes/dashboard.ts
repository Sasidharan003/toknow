import { Router, type IRouter } from "express";
import { db, lawsTable, schemesTable, servicesTable, newsTable } from "@workspace/db";
import { sql, eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [lawCount] = await db.select({ count: sql<number>`count(*)::int` }).from(lawsTable);
  const [schemeCount] = await db.select({ count: sql<number>`count(*)::int` }).from(schemesTable);
  const [serviceCount] = await db.select({ count: sql<number>`count(*)::int` }).from(servicesTable);
  const [newsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(newsTable);

  const recentLaws = await db.select().from(lawsTable).orderBy(desc(lawsTable.createdAt)).limit(3);
  const popularSchemes = await db.select().from(schemesTable).where(eq(schemesTable.isFeatured, true)).limit(3);

  res.json({
    totalLaws: lawCount.count,
    totalSchemes: schemeCount.count,
    totalServices: serviceCount.count,
    totalNews: newsCount.count,
    recentLaws: recentLaws.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    popularSchemes: popularSchemes.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
  });
});

export default router;
