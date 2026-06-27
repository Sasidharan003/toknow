import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, newsTable } from "@workspace/db";
import {
  ListNewsQueryParams,
  GetNewsArticleParams,
  ListNewsResponse,
  GetNewsArticleResponse,
} from "@workspace/api-zod";
import { fetchAndStoreNews, lastRefreshedAt, isRefreshing } from "../services/newsFetcher";

const router: IRouter = Router();

router.get("/news/status", (_req, res): void => {
  res.json({
    lastRefreshedAt: lastRefreshedAt?.toISOString() ?? null,
    isRefreshing,
  });
});

router.post("/news/refresh", async (req, res): Promise<void> => {
  if (isRefreshing) {
    res.json({ status: "already_running", lastRefreshedAt: lastRefreshedAt?.toISOString() ?? null });
    return;
  }
  try {
    const inserted = await fetchAndStoreNews();
    res.json({ status: "ok", inserted, lastRefreshedAt: lastRefreshedAt?.toISOString() ?? null });
  } catch (err) {
    req.log.error({ err }, "News refresh failed");
    res.status(500).json({ error: "Refresh failed" });
  }
});

router.get("/news", async (req, res): Promise<void> => {
  const parsed = ListNewsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, limit } = parsed.data;

  let query = db.select().from(newsTable).orderBy(desc(newsTable.publishedAt));
  if (category) query = query.where(eq(newsTable.category, category)) as typeof query;
  if (limit) query = query.limit(limit) as typeof query;

  const rows = await query;
  res.json(ListNewsResponse.parse(rows.map((r) => ({ ...r, publishedAt: r.publishedAt.toISOString() }))));
});

router.get("/news/:id", async (req, res): Promise<void> => {
  const params = GetNewsArticleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.select().from(newsTable).where(eq(newsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "News article not found" });
    return;
  }
  res.json(GetNewsArticleResponse.parse({ ...row, publishedAt: row.publishedAt.toISOString() }));
});

export default router;
