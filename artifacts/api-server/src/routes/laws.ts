import { Router, type IRouter } from "express";
import { ilike, eq, and, sql } from "drizzle-orm";
import { db, lawsTable } from "@workspace/db";
import {
  ListLawsQueryParams,
  GetLawParams,
  ListLawsResponse,
  GetLawResponse,
  CreateLawBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/laws/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({ category: lawsTable.category, count: sql<number>`count(*)::int` })
    .from(lawsTable)
    .groupBy(lawsTable.category)
    .orderBy(lawsTable.category);
  res.json(rows.map((r) => ({ category: r.category, count: r.count, icon: null })));
});

router.get("/laws", async (req, res): Promise<void> => {
  const parsed = ListLawsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, search, featured } = parsed.data;

  const conditions: any[] = [];
  if (category) conditions.push(eq(lawsTable.category, category));
  if (search) conditions.push(ilike(lawsTable.title, `%${search}%`));
  if (featured === "true") conditions.push(eq(lawsTable.isFeatured, true));

  const rows = await db
    .select()
    .from(lawsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(lawsTable.viewCount);

  res.json(ListLawsResponse.parse(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.post("/laws", async (req, res): Promise<void> => {
  const parsed = CreateLawBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(lawsTable).values(parsed.data).returning();
  res.status(201).json(GetLawResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
});

router.get("/laws/:id", async (req, res): Promise<void> => {
  const params = GetLawParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.select().from(lawsTable).where(eq(lawsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Law not found" });
    return;
  }
  await db.update(lawsTable).set({ viewCount: row.viewCount + 1 }).where(eq(lawsTable.id, row.id));
  res.json(GetLawResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
});

export default router;
