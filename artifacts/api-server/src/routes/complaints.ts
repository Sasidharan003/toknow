import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, complaintsTable } from "@workspace/db";
import {
  ListComplaintsQueryParams,
  GetComplaintParams,
  ListComplaintsResponse,
  GetComplaintResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/complaints", async (req, res): Promise<void> => {
  const parsed = ListComplaintsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category } = parsed.data;

  const rows = category
    ? await db.select().from(complaintsTable).where(eq(complaintsTable.category, category))
    : await db.select().from(complaintsTable).orderBy(complaintsTable.title);

  res.json(ListComplaintsResponse.parse(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.get("/complaints/:id", async (req, res): Promise<void> => {
  const params = GetComplaintParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.select().from(complaintsTable).where(eq(complaintsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Complaint guide not found" });
    return;
  }
  res.json(GetComplaintResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
});

export default router;
