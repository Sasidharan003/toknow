import { Router, type IRouter } from "express";
import { db, coursesTable, quizzesTable } from "@workspace/db";
import { ListCoursesResponse, ListQuizzesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/learning/courses", async (_req, res): Promise<void> => {
  const rows = await db.select().from(coursesTable).orderBy(coursesTable.title);
  res.json(ListCoursesResponse.parse(rows));
});

router.get("/learning/quizzes", async (_req, res): Promise<void> => {
  const rows = await db.select().from(quizzesTable).orderBy(quizzesTable.title);
  res.json(ListQuizzesResponse.parse(rows));
});

export default router;
