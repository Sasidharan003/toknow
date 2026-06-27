import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, documentTemplatesTable } from "@workspace/db";
import {
  ListDocumentTemplatesResponse,
  GenerateDocumentBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/documents/templates", async (_req, res): Promise<void> => {
  const rows = await db.select().from(documentTemplatesTable).orderBy(documentTemplatesTable.name);
  res.json(ListDocumentTemplatesResponse.parse(rows));
});

router.post("/documents/generate", async (req, res): Promise<void> => {
  const parsed = GenerateDocumentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { templateId, fieldValues } = parsed.data;
  const [template] = await db.select().from(documentTemplatesTable).where(eq(documentTemplatesTable.id, templateId));
  if (!template) {
    res.status(404).json({ error: "Template not found" });
    return;
  }

  let content = `${template.name.toUpperCase()}\n${"=".repeat(template.name.length)}\n\n`;
  content += `Date: ${new Date().toLocaleDateString("en-IN")}\n\n`;

  const fields = JSON.parse(template.fields) as Array<{ key: string; label: string }>;
  for (const field of fields) {
    const value = fieldValues[field.key] ?? "[________________]";
    content += `${field.label}: ${value}\n`;
  }

  content += `\n\n---\nThis document is generated for informational purposes. Please get it verified by a legal professional before use.\n`;

  res.json({ content, templateName: template.name });
});

export default router;
