import { Router, type IRouter } from "express";
import { ilike, eq, and } from "drizzle-orm";
import { db, servicesTable } from "@workspace/db";
import {
  ListServicesQueryParams,
  GetServiceParams,
  ListServicesResponse,
  GetServiceResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/services", async (req, res): Promise<void> => {
  const parsed = ListServicesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, search } = parsed.data;

  const conditions: any[] = [];
  if (category) conditions.push(eq(servicesTable.category, category));
  if (search) conditions.push(ilike(servicesTable.title, `%${search}%`));

  const rows = await db
    .select()
    .from(servicesTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(servicesTable.title);

  res.json(ListServicesResponse.parse(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.get("/services/:id", async (req, res): Promise<void> => {
  const params = GetServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.select().from(servicesTable).where(eq(servicesTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(GetServiceResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
});

export default router;
