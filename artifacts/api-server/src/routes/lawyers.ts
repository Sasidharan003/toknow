import { Router, type Response } from "express";
import { db, lawyersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { authenticateUser, requireRole, type AuthenticatedRequest } from "./auth";

const router = Router();

// GET /api/lawyers - Retrieve lawyers list (by district, specialization, or pending for admin)
router.get("/lawyers", authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  const { district, specialization, status } = req.query;

  try {
    let queryStatus = "approved";
    
    // Admin can request pending or rejected lists
    if (status && req.user?.role === "admin") {
      queryStatus = String(status);
    }

    const lawyers = await db
      .select()
      .from(lawyersTable)
      .where(eq(lawyersTable.status, queryStatus));

    // Client-side filtering for district and specialization if queried
    let filtered = lawyers;
    
    if (district) {
      filtered = filtered.filter((l) => l.district.toLowerCase() === String(district).toLowerCase());
    }
    
    if (specialization && specialization !== "All Specializations") {
      filtered = filtered.filter((l) => l.specialization.toLowerCase().includes(String(specialization).toLowerCase().replace(" disputes & property", "").replace(" defense & bail", "").replace(" law & divorce", "").replace(" & appellate", "").replace(" crimes & digital contracts", "").replace(" & employment", "").trim()));
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lawyers list." });
  }
});

// POST /api/lawyers - Submit lawyer registration (starts as "pending")
router.post("/lawyers", authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  const { name, specialization, experience, courts, phone, email, languages, address, hours, state, district } = req.body;

  if (!name || !specialization || !experience || !courts || !phone || !email || !address || !hours || !state || !district) {
    return res.status(400).json({ error: "All registration fields are required." });
  }

  try {
    const [newLawyer] = await db.insert(lawyersTable).values({
      userId: req.user?.id || null, // Link if logged in
      name,
      specialization,
      experience,
      courts,
      phone,
      email,
      languages: Array.isArray(languages) ? JSON.stringify(languages) : String(languages),
      address,
      hours,
      state,
      district,
      status: "pending", // require admin approval
    });

    res.status(201).json(newLawyer);
  } catch (err) {
    res.status(500).json({ error: "Failed to register advocate. Internal server error." });
  }
});

// POST /api/lawyers/:id/approve - Approve advocate (Admin Only)
router.post("/lawyers/:id/approve", authenticateUser, requireRole("admin"), async (req: AuthenticatedRequest, res: Response) => {
  const idVal = parseInt(req.params.id);
  
  if (isNaN(idVal)) {
    return res.status(400).json({ error: "Invalid lawyer ID." });
  }

  try {
    const updated = await db
      .update(lawyersTable)
      .set({ status: "approved" })
      .where(eq(lawyersTable.id, idVal));

    res.json({ success: true, lawyer: updated[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve lawyer." });
  }
});

// POST /api/lawyers/:id/reject - Reject advocate (Admin Only)
router.post("/lawyers/:id/reject", authenticateUser, requireRole("admin"), async (req: AuthenticatedRequest, res: Response) => {
  const idVal = parseInt(req.params.id);
  
  if (isNaN(idVal)) {
    return res.status(400).json({ error: "Invalid lawyer ID." });
  }

  try {
    const updated = await db
      .update(lawyersTable)
      .set({ status: "rejected" })
      .where(eq(lawyersTable.id, idVal));

    res.json({ success: true, lawyer: updated[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject lawyer." });
  }
});

export default router;
