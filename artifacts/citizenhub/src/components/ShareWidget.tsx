import { useState, useEffect, useRef } from "react";
import { Copy, Check, Share2, MessageSquare, Send, Mail, Sparkles, ExternalLink, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Face {
  indices: number[];
  color: { r: number; g: number; b: number };
  isLine?: boolean;
}

// 3D Paper Airplane model vertices and faces
const vertices: Point3D[] = [
  { x: 0, y: 0, z: 32 },       // 0: Nose tip (front)
  { x: -28, y: -6, z: -22 },   // 1: Left wing tip (outer)
  { x: 28, y: -6, z: -22 },    // 2: Right wing tip (outer)
  { x: 0, y: 11, z: -18 },     // 3: Keel bottom center (back bottom keel)
  { x: 0, y: -4, z: -18 },     // 4: Central crease top (back top crease)
  
  // Custom trail vertices to draw neon speed lines behind the jet
  { x: -10, y: -3, z: -24 },   // 5: Left trail start
  { x: -18, y: -6, z: -60 },   // 6: Left trail end
  { x: 0, y: 8, z: -20 },      // 7: Keel trail start
  { x: 0, y: 15, z: -55 },     // 8: Keel trail end
  { x: 10, y: -3, z: -24 },    // 9: Right trail start
  { x: 18, y: -6, z: -60 }     // 10: Right trail end
];

const faces: Face[] = [
  // Left wing top panel
  { indices: [0, 1, 4], color: { r: 249, g: 115, b: 22 } },      // Saffron (primary theme)
  // Right wing top panel
  { indices: [0, 4, 2], color: { r: 249, g: 115, b: 22 } },      // Saffron
  // Left keel side panel
  { indices: [0, 4, 3], color: { r: 251, g: 146, b: 60 } },      // Lighter orange
  // Right keel side panel
  { indices: [0, 3, 4], color: { r: 251, g: 146, b: 60 } },      // Lighter orange

  // Neon trails (rendered as lines with a cyan glow)
  { indices: [5, 6], color: { r: 6, g: 182, b: 212 }, isLine: true }, // Cyan left trail
  { indices: [7, 8], color: { r: 168, g: 85, b: 247 }, isLine: true }, // Purple keel trail
  { indices: [9, 10], color: { r: 6, g: 182, b: 212 }, isLine: true } // Cyan right trail
];

function rotateY(pt: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: pt.x * cos - pt.z * sin,
    y: pt.y,
    z: pt.x * sin + pt.z * cos
  };
}

function rotateX(pt: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: pt.x,
    y: pt.y * cos - pt.z * sin,
    z: pt.y * sin + pt.z * cos
  };
}

export function ShareWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isHovering: false });
  const anglesRef = useRef({ rx: -0.15, ry: 0.5 });
  const velocityRef = useRef({ rx: 0, ry: 0.015 });
  const bobRef = useRef(0);

  // Sharing states
  const [destination, setDestination] = useState<"home" | "chat" | "schemes" | "lawyers">("home");
  const [customText, setCustomText] = useState(
    "Hey! Check out 'TO KNOW' - it's a fantastic website to learn about your legal rights, check government scheme eligibility instantly, get AI legal assistance, and draft legal documents. Share it with your family!"
  );
  const [copied, setCopied] = useState(false);

  // Build target URL
  const getShareUrl = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://toknow.gov.in";
    if (destination === "chat") return `${origin}/chat`;
    if (destination === "schemes") return `${origin}/schemes`;
    if (destination === "lawyers") return `${origin}/lawyers`;
    return `${origin}/`;
  };

  const shareUrl = getShareUrl();
  const shareMessage = `${customText}\n\n👉 Access it here: ${shareUrl}`;

  // Copy to clipboard handler
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // WhatsApp share
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
  
  // Telegram share
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(customText)}`;
  
  // Email share
  const emailUrl = `mailto:?subject=${encodeURIComponent("Check out TO KNOW - Indian Civic Platform")}&body=${encodeURIComponent(shareMessage)}`;

  // 3D Airplane Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let width = canvas.width;
    let height = canvas.height;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        canvas.width = w * window.devicePixelRatio;
        canvas.height = h * window.devicePixelRatio;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        width = canvas.width;
        height = canvas.height;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const lightDir = { x: 0.5, y: -0.8, z: -0.3 };
    const len = Math.sqrt(lightDir.x * lightDir.x + lightDir.y * lightDir.y + lightDir.z * lightDir.z);
    const lightNormalized = { x: lightDir.x / len, y: lightDir.y / len, z: lightDir.z / len };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      bobRef.current += 0.04;
      const bobOffset = Math.sin(bobRef.current) * 6; // bobbing up and down

      const mouse = mouseRef.current;

      if (mouse.isHovering) {
        const targetRy = (mouse.x / width) * 2 * Math.PI - Math.PI;
        const targetRx = (mouse.y / height - 0.5) * Math.PI * 0.4;
        anglesRef.current.ry += (targetRy - anglesRef.current.ry) * 0.08;
        anglesRef.current.rx += (targetRx - anglesRef.current.rx) * 0.08;
      } else {
        // Continuous slow rotation on Y
        anglesRef.current.ry += 0.015;
        // Float target Rx back to -0.15
        anglesRef.current.rx += (-0.15 - anglesRef.current.rx) * 0.03;
      }

      const rx = anglesRef.current.rx;
      const ry = anglesRef.current.ry;

      // Project vertices
      const rotated = vertices.map((pt, idx) => {
        let p = { ...pt };
        // Apply bobbing offset only to physical airplane body (indices 0 to 4)
        if (idx <= 4) {
          p.y += bobOffset;
        } else {
          // Speed trails bob slightly out of phase
          p.y += Math.sin(bobRef.current - idx * 0.3) * 5;
        }
        p = rotateY(p, ry);
        p = rotateX(p, rx);
        return p;
      });

      const projected = rotated.map((p) => {
        const fov = 180;
        const distance = 120;
        const factor = fov / (distance + p.z);
        const baseScale = Math.min(width, height) / 110;
        return {
          x: width / 2 + p.x * factor * baseScale,
          y: height / 2 + p.y * factor * baseScale
        };
      });

      // Depth sort faces
      const sortedFaces = faces
        .map((face, index) => {
          const sumZ = face.indices.reduce((sum, idx) => sum + rotated[idx].z, 0);
          const avgZ = sumZ / face.indices.length;
          return { face, index, avgZ };
        })
        .sort((a, b) => b.avgZ - a.avgZ);

      // Render sorted faces
      sortedFaces.forEach(({ face }) => {
        if (face.indices.length < 2) return;

        if (face.isLine) {
          // Speed trails
          const p1 = projected[face.indices[0]];
          const p2 = projected[face.indices[1]];

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          // Outer halo
          ctx.strokeStyle = `rgba(${face.color.r}, ${face.color.g}, ${face.color.b}, 0.25)`;
          ctx.lineWidth = 4;
          ctx.stroke();

          // Core line
          ctx.strokeStyle = `rgba(${face.color.r}, ${face.color.g}, ${face.color.b}, 0.8)`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          return;
        }

        // Solid airplane face panels
        const p0 = rotated[face.indices[0]];
        const p1 = rotated[face.indices[1]];
        const p2 = rotated[face.indices[2]];

        const ax = p1.x - p0.x;
        const ay = p1.y - p0.y;
        const az = p1.z - p0.z;
        const bx = p2.x - p0.x;
        const by = p2.y - p0.y;
        const bz = p2.z - p0.z;

        const nx = ay * bz - az * by;
        const ny = az * bx - ax * bz;
        const nz = ax * by - ay * bx;

        const lenNormal = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (lenNormal === 0) return;

        const normal = { x: nx / lenNormal, y: ny / lenNormal, z: nz / lenNormal };
        
        let useNormal = { ...normal };
        if (useNormal.z > 0) {
          useNormal.x = -useNormal.x;
          useNormal.y = -useNormal.y;
          useNormal.z = -useNormal.z;
        }

        // Shading intensity
        const dot = useNormal.x * lightNormalized.x + useNormal.y * lightNormalized.y + useNormal.z * lightNormalized.z;
        const diffuse = Math.max(0.3, (dot + 1.0) / 2.0);

        const fillOpacity = 0.08 + diffuse * 0.12;
        const edgeOpacity = 0.5 + diffuse * 0.45;

        // Draw face
        ctx.beginPath();
        ctx.moveTo(projected[face.indices[0]].x, projected[face.indices[0]].y);
        for (let i = 1; i < face.indices.length; i++) {
          ctx.lineTo(projected[face.indices[i]].x, projected[face.indices[i]].y);
        }
        ctx.closePath();

        // 1. Transparent fill
        ctx.fillStyle = `rgba(${face.color.r}, ${face.color.g}, ${face.color.b}, ${fillOpacity})`;
        ctx.fill();

        // 2. Thick edge neon glow
        ctx.strokeStyle = `rgba(${face.color.r}, ${face.color.g}, ${face.color.b}, ${edgeOpacity * 0.25})`;
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // 3. Sharp edge core
        ctx.strokeStyle = `rgba(${face.color.r}, ${face.color.g}, ${face.color.b}, ${edgeOpacity})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      });

      // Joint vertices
      projected.slice(0, 5).forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.8, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(251, 146, 60, 0.45)"; // orange neon glow halos
        ctx.fill();
      });

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      resizeObserver.disconnect();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    mouseRef.current = { x, y, isHovering: true };
  };

  const handleMouseLeave = () => {
    mouseRef.current.isHovering = false;
  };

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm card-3d hover-glow relative overflow-hidden transition-all duration-300">
      {/* Decorative blurred background circle for floating glow */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-secondary/5 blur-[80px] pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Content Section */}
        <div className="lg:col-span-2 space-y-4 card-3d-content">
          <div className="flex items-center gap-2.5">
            <div className="bg-secondary/10 p-2.5 rounded-xl text-secondary animate-pulse-subtle">
              <Share2 className="w-5.5 h-5.5" />
            </div>
            <div>
              <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider mb-0.5">Spread the Knowledge</Badge>
              <h3 className="text-xl font-bold text-foreground leading-tight">Share TO KNOW with Friends & Family</h3>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
            Empower your loved ones by sharing this gateway! Help them learn about constitutional rights, check eligibility for welfare schemes, draft legal forms, and ask critical questions directly to our AI assistant.
          </p>

          {/* Quick Config Tabs */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">1. Select Share Link Destination:</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "home", label: "Home Portal" },
                { id: "chat", label: "AI Chat Room" },
                { id: "schemes", label: "Scheme Finder" },
                { id: "lawyers", label: "Advocate Directory" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDestination(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
                    destination === tab.id
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">2. Customize Your Message:</label>
            <textarea
              rows={2}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full text-xs border rounded-lg p-2.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary leading-relaxed font-medium"
              placeholder="Write a custom invite message..."
            />
          </div>

          {/* Share Actions Panel */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 bg-muted/50 p-2.5 rounded-xl border">
              <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent text-xs outline-none select-all font-semibold text-foreground truncate"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer transition-all shadow-sm ${
                  copied
                    ? "bg-emerald-500 text-white shadow-emerald-500/20"
                    : "bg-primary text-primary-foreground hover:opacity-90 btn-3d"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Invite
                  </>
                )}
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="flex flex-wrap gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[100px] bg-[#25D366] text-white py-2 px-3 rounded-lg text-xs font-bold hover:brightness-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-[#25d366]/10"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" /> WhatsApp
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[100px] bg-[#0088cc] text-white py-2 px-3 rounded-lg text-xs font-bold hover:brightness-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-[#0088cc]/10"
              >
                <Send className="w-3.5 h-3.5 fill-current" /> Telegram
              </a>
              <a
                href={emailUrl}
                className="flex-1 min-w-[100px] bg-slate-700 text-white py-2 px-3 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-slate-700/10"
              >
                <Mail className="w-3.5 h-3.5" /> Send Email
              </a>
            </div>
          </div>
        </div>

        {/* 3D Paper Airplane Graphic */}
        <div ref={containerRef} className="hidden lg:flex lg:col-span-1 items-center justify-center relative select-none">
          <div className="w-[180px] h-[180px] relative hover:scale-105 transition-transform duration-300">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />
            {/* Ambient base shadow under airplane */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/10 rounded-full blur-md animate-pulse-subtle" />
          </div>
        </div>
      </div>
    </div>
  );
}
