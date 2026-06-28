import { Router, type Request, type Response, type NextFunction } from "express";
import { db, usersTable, lawyersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, signJwt, verifyJwt } from "../lib/auth";

// Extend Request interface to support user context
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

const router = Router();

// ─── Authentication Middleware ──────────────────────────────────────────────
export function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.toknow_session;
  if (!token) {
    return next();
  }
  
  const decoded = verifyJwt(token);
  if (decoded) {
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required. Please log in." });
  }
  next();
}

export function requireRole(role: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required. Please log in." });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
}

// ─── Auth Routes ─────────────────────────────────────────────────────────────

// Register Route
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  
  const selectedRole = role === "lawyer" || role === "admin" ? role : "citizen";

  try {
    // Check if user already exists
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim()))
      .limit(1);
      
    if (existing.length > 0) {
      return res.status(409).json({ error: "A user with this email address already exists." });
    }
    
    // Hash password and insert
    const passwordHash = hashPassword(password);
    const [newUser] = await db.insert(usersTable).values({
      email: email.toLowerCase().trim(),
      passwordHash,
      role: selectedRole,
    });
    
    // Auto-login upon registration
    const token = signJwt({ id: newUser.id, email: newUser.email, role: newUser.role });
    res.cookie("toknow_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error during registration." });
  }
});

// Login Route
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  
  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim()))
      .limit(1);
      
    const user = users[0];
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    
    const token = signJwt({ id: user.id, email: user.email, role: user.role });
    res.cookie("toknow_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error during login." });
  }
});

// Logout Route
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("toknow_session");
  res.json({ success: true });
});

// Get Current User Route
router.get("/me", authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  res.json({ user: req.user });
});

export default router;
