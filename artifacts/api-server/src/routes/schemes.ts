import { Router, type IRouter } from "express";
import { ilike, eq, and, sql } from "drizzle-orm";
import { db, schemesTable } from "@workspace/db";
import {
  ListSchemesQueryParams,
  GetSchemeParams,
  ListSchemesResponse,
  GetSchemeResponse,
  CreateSchemeBody,
  ListFeaturedSchemesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/schemes/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({ category: schemesTable.category, count: sql<number>`count(*)::int` })
    .from(schemesTable)
    .groupBy(schemesTable.category)
    .orderBy(schemesTable.category);
  res.json(rows.map((r) => ({ category: r.category, count: r.count, icon: null })));
});

router.get("/schemes/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(schemesTable)
    .where(eq(schemesTable.isFeatured, true))
    .limit(6);
  res.json(ListFeaturedSchemesResponse.parse(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.get("/schemes", async (req, res): Promise<void> => {
  const parsed = ListSchemesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, search } = parsed.data;

  const conditions: any[] = [];
  if (category) conditions.push(eq(schemesTable.category, category));
  if (search) conditions.push(ilike(schemesTable.title, `%${search}%`));

  const rows = await db
    .select()
    .from(schemesTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(schemesTable.viewCount);

  res.json(ListSchemesResponse.parse(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.post("/schemes", async (req, res): Promise<void> => {
  const parsed = CreateSchemeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(schemesTable).values(parsed.data).returning();
  res.status(201).json(GetSchemeResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
});

router.get("/schemes/:id", async (req, res): Promise<void> => {
  const params = GetSchemeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.select().from(schemesTable).where(eq(schemesTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Scheme not found" });
    return;
  }
  res.json(GetSchemeResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
});

export default router;
