import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, bookmarksTable } from "@workspace/db";
import {
  ListBookmarksResponse,
  CreateBookmarkBody,
  DeleteBookmarkParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/bookmarks", async (_req, res): Promise<void> => {
  const rows = await db.select().from(bookmarksTable).orderBy(bookmarksTable.createdAt);
  res.json(ListBookmarksResponse.parse(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.post("/bookmarks", async (req, res): Promise<void> => {
  const parsed = CreateBookmarkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(bookmarksTable).values(parsed.data).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/bookmarks/:id", async (req, res): Promise<void> => {
  const params = DeleteBookmarkParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(bookmarksTable).where(eq(bookmarksTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
