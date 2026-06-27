import { useEffect, useRef } from "react";

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

// 1. Build static mesh geometry for the Scales of Justice (Initialized once outside component)
const vertices: Point3D[] = [];
const faces: Face[] = [];

const segments = 12;

// --- BASE (Low Cylinder) ---
const baseCenterBottom = vertices.length;
vertices.push({ x: 0, y: 60, z: 0 }); // Bottom center
const baseCenterTop = vertices.length;
vertices.push({ x: 0, y: 53, z: 0 }); // Top center

const baseBottomRing = vertices.length;
for (let i = 0; i < segments; i++) {
  const angle = (i * 2 * Math.PI) / segments;
  vertices.push({ x: Math.cos(angle) * 26, y: 60, z: Math.sin(angle) * 26 });
}

const baseTopRing = vertices.length;
for (let i = 0; i < segments; i++) {
  const angle = (i * 2 * Math.PI) / segments;
  vertices.push({ x: Math.cos(angle) * 22, y: 53, z: Math.sin(angle) * 22 });
}

// Base Faces (Glowing Saffron Orange: 249, 115, 22)
const baseColor = { r: 249, g: 115, b: 22 };
for (let i = 0; i < segments; i++) {
  const next = (i + 1) % segments;
  // Side quads
  faces.push({
    indices: [baseBottomRing + i, baseBottomRing + next, baseTopRing + next, baseTopRing + i],
    color: baseColor,
  });
  // Top caps (triangles connecting to center top)
  faces.push({
    indices: [baseCenterTop, baseTopRing + next, baseTopRing + i],
    color: { r: 251, g: 146, b: 60 },
  });
}

// --- PILLAR/STAND (Thick vertical tube) ---
const pillarSegments = 8;
const pillarBottomRing = vertices.length;
for (let i = 0; i < pillarSegments; i++) {
  const angle = (i * 2 * Math.PI) / pillarSegments;
  vertices.push({ x: Math.cos(angle) * 4.5, y: 53, z: Math.sin(angle) * 4.5 });
}

const pillarTopRing = vertices.length;
for (let i = 0; i < pillarSegments; i++) {
  const angle = (i * 2 * Math.PI) / pillarSegments;
  vertices.push({ x: Math.cos(angle) * 3.5, y: -45, z: Math.sin(angle) * 3.5 });
}

// Pillar side faces (Glowing Saffron Orange)
const pillarColor = { r: 249, g: 115, b: 22 };
for (let i = 0; i < pillarSegments; i++) {
  const next = (i + 1) % pillarSegments;
  faces.push({
    indices: [pillarBottomRing + i, pillarBottomRing + next, pillarTopRing + next, pillarTopRing + i],
    color: pillarColor,
  });
}

// --- CENTRAL ORNAMENTAL SPHERE (Octahedron at y = -45) ---
const topSphereIdx = vertices.length;
vertices.push({ x: 0, y: -49, z: 0 }); // Top
vertices.push({ x: 0, y: -41, z: 0 }); // Bottom
vertices.push({ x: -4.5, y: -45, z: 0 }); // Left
vertices.push({ x: 4.5, y: -45, z: 0 }); // Right
vertices.push({ x: 0, y: -45, z: 4.5 }); // Front
vertices.push({ x: 0, y: -45, z: -4.5 }); // Back

const sphereColor = { r: 251, g: 146, b: 60 };
faces.push({ indices: [topSphereIdx, topSphereIdx + 4, topSphereIdx + 3], color: sphereColor }); // Top Front Right
faces.push({ indices: [topSphereIdx, topSphereIdx + 3, topSphereIdx + 5], color: sphereColor }); // Top Right Back
faces.push({ indices: [topSphereIdx, topSphereIdx + 5, topSphereIdx + 2], color: sphereColor }); // Top Back Left
faces.push({ indices: [topSphereIdx, topSphereIdx + 2, topSphereIdx + 4], color: sphereColor }); // Top Left Front
faces.push({ indices: [topSphereIdx + 1, topSphereIdx + 3, topSphereIdx + 4], color: sphereColor }); // Bottom Right Front
faces.push({ indices: [topSphereIdx + 1, topSphereIdx + 5, topSphereIdx + 3], color: sphereColor }); // Bottom Back Right
faces.push({ indices: [topSphereIdx + 1, topSphereIdx + 2, topSphereIdx + 5], color: sphereColor }); // Bottom Left Back
faces.push({ indices: [topSphereIdx + 1, topSphereIdx + 4, topSphereIdx + 2], color: sphereColor }); // Bottom Front Left

// --- CROSSBEAM (Prism) ---
const beamLeftTopFront = vertices.length; vertices.push({ x: -52, y: -41, z: 1.8 });
const beamLeftBottomFront = vertices.length; vertices.push({ x: -52, y: -37, z: 1.8 });
const beamLeftBottomBack = vertices.length; vertices.push({ x: -52, y: -37, z: -1.8 });
const beamLeftTopBack = vertices.length; vertices.push({ x: -52, y: -41, z: -1.8 });

const beamRightTopFront = vertices.length; vertices.push({ x: 52, y: -41, z: 1.8 });
const beamRightBottomFront = vertices.length; vertices.push({ x: 52, y: -37, z: 1.8 });
const beamRightBottomBack = vertices.length; vertices.push({ x: 52, y: -37, z: -1.8 });
const beamRightTopBack = vertices.length; vertices.push({ x: 52, y: -41, z: -1.8 });

// Crossbeam side faces (Glowing Blue-Silver/Gray: 203, 213, 225)
const beamColor = { r: 203, g: 213, b: 225 };
faces.push({ indices: [beamLeftTopFront, beamRightTopFront, beamRightBottomFront, beamLeftBottomFront], color: beamColor }); // Front
faces.push({ indices: [beamRightTopBack, beamLeftTopBack, beamLeftBottomBack, beamRightBottomBack], color: beamColor }); // Back
faces.push({ indices: [beamLeftTopBack, beamRightTopBack, beamRightTopFront, beamLeftTopFront], color: { r: 241, g: 245, b: 249 } }); // Top
faces.push({ indices: [beamLeftBottomFront, beamRightBottomFront, beamRightBottomBack, beamLeftBottomBack], color: { r: 148, g: 163, b: 184 } }); // Bottom

// Crossbeam ends
faces.push({ indices: [beamLeftTopBack, beamLeftTopFront, beamLeftBottomFront, beamLeftBottomBack], color: beamColor }); // Left end
faces.push({ indices: [beamRightTopFront, beamRightTopBack, beamRightBottomBack, beamRightBottomFront], color: beamColor }); // Right end

// --- LEFT PLATE (Conical Bowl) ---
const leftCenter = vertices.length;
vertices.push({ x: -52, y: 22, z: 0 }); // Bottom tip
const leftRimStart = vertices.length;
const plateSegments = 10;
const plateRad = 15;

for (let i = 0; i < plateSegments; i++) {
  const angle = (i * 2 * Math.PI) / plateSegments;
  vertices.push({ x: -52 + Math.cos(angle) * plateRad, y: 14, z: Math.sin(angle) * plateRad });
}

// Left Plate faces (Glowing Teal/Cyan: 6, 182, 212)
const leftPlateColor = { r: 6, g: 182, b: 212 };
for (let i = 0; i < plateSegments; i++) {
  const next = (i + 1) % plateSegments;
  faces.push({
    indices: [leftCenter, leftRimStart + next, leftRimStart + i],
    color: leftPlateColor,
  });
}

// --- RIGHT PLATE (Conical Bowl) ---
const rightCenter = vertices.length;
vertices.push({ x: 52, y: 22, z: 0 }); // Bottom tip
const rightRimStart = vertices.length;

for (let i = 0; i < plateSegments; i++) {
  const angle = (i * 2 * Math.PI) / plateSegments;
  vertices.push({ x: 52 + Math.cos(angle) * plateRad, y: 14, z: Math.sin(angle) * plateRad });
}

// Right Plate faces (Glowing Purple/Violet: 168, 85, 247)
const rightPlateColor = { r: 168, g: 85, b: 247 };
for (let i = 0; i < plateSegments; i++) {
  const next = (i + 1) % plateSegments;
  faces.push({
    indices: [rightCenter, rightRimStart + next, rightRimStart + i],
    color: rightPlateColor,
  });
}

// --- SUSPENSION STRINGS (Wireframe Lines) ---
const beamLeftCenterIdx = vertices.length; vertices.push({ x: -52, y: -39, z: 0 });
const beamRightCenterIdx = vertices.length; vertices.push({ x: 52, y: -39, z: 0 });

// Connect left string lines (Teal/Cyan)
for (let i = 0; i < plateSegments; i += 3) {
  faces.push({
    indices: [beamLeftCenterIdx, leftRimStart + i],
    color: leftPlateColor,
    isLine: true,
  });
}

// Connect right string lines (Purple/Violet)
for (let i = 0; i < plateSegments; i += 3) {
  faces.push({
    indices: [beamRightCenterIdx, rightRimStart + i],
    color: rightPlateColor,
    isLine: true,
  });
}

// Rotation math helpers
function rotateY(pt: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: pt.x * cos - pt.z * sin,
    y: pt.y,
    z: pt.x * sin + pt.z * cos,
  };
}

function rotateX(pt: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: pt.x,
    y: pt.y * cos - pt.z * sin,
    z: pt.y * sin + pt.z * cos,
  };
}

export function Interactive3DScale() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isHovering: false });
  const anglesRef = useRef({ rx: 0.25, ry: 0.8 });
  const velocityRef = useRef({ rx: 0, ry: 0.015 });

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

    // Directional light to give volume/depth to the holographic glow
    const l1 = { x: -0.6, y: -0.8, z: -0.5 };
    const len1 = Math.sqrt(l1.x * l1.x + l1.y * l1.y + l1.z * l1.z);
    const light1Dir = { x: l1.x / len1, y: l1.y / len1, z: l1.z / len1 };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      if (mouse.isHovering) {
        const targetRy = (mouse.x / width) * 2 * Math.PI - Math.PI;
        const targetRx = (mouse.y / height - 0.5) * Math.PI * 0.4;
        const diffRy = targetRy - anglesRef.current.ry;
        const diffRx = targetRx - anglesRef.current.rx;
        anglesRef.current.ry += diffRy * 0.08;
        anglesRef.current.rx += diffRx * 0.08;
        velocityRef.current.ry = diffRy * 0.08;
        velocityRef.current.rx = diffRx * 0.08;
      } else {
        velocityRef.current.ry = velocityRef.current.ry * 0.95 + 0.012 * 0.05;
        velocityRef.current.rx = velocityRef.current.rx * 0.95 + (0.2 - anglesRef.current.rx) * 0.05;
        anglesRef.current.ry += velocityRef.current.ry;
        anglesRef.current.rx += velocityRef.current.rx;
      }

      const rx = anglesRef.current.rx;
      const ry = anglesRef.current.ry;

      const rotated = vertices.map((pt) => {
        let p = { ...pt };
        p = rotateY(p, ry);
        p = rotateX(p, rx);
        return p;
      });

      const projected = rotated.map((p) => {
        const scale = 1.35;
        const fov = 200;
        const distance = 160;
        const factor = (fov / (distance + p.z)) * scale;
        const baseScale = Math.min(width, height) / 230;
        return {
          x: width / 2 + p.x * factor * baseScale,
          y: height / 2 + p.y * factor * baseScale,
        };
      });

      // 2. Depth Sorting (still important to render back faces behind front faces)
      const sortedFaces = faces.map((face, index) => {
        const sumZ = face.indices.reduce((sum, idx) => sum + rotated[idx].z, 0);
        const avgZ = sumZ / face.indices.length;
        return { face, index, avgZ };
      }).sort((a, b) => b.avgZ - a.avgZ);

      // 3. Draw & shade holographic faces
      sortedFaces.forEach(({ face }) => {
        if (face.indices.length < 2) return;

        if (face.isLine) {
          // Render wireframe lines (strings) with a neon glow
          const p1 = projected[face.indices[0]];
          const p2 = projected[face.indices[1]];

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          // Outer edge neon glow
          ctx.strokeStyle = `rgba(${face.color.r}, ${face.color.g}, ${face.color.b}, 0.22)`;
          ctx.lineWidth = 3.5;
          ctx.stroke();

          // Inner core line
          ctx.strokeStyle = `rgba(${face.color.r}, ${face.color.g}, ${face.color.b}, 0.75)`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
          return;
        }

        // Render solid polygons
        const p0 = rotated[face.indices[0]];
        const p1 = rotated[face.indices[1]];
        const p2 = rotated[face.indices[2]];

        // Calculate surface normal vector
        const ax = p1.x - p0.x;
        const ay = p1.y - p0.y;
        const az = p1.z - p0.z;
        const bx = p2.x - p0.x;
        const by = p2.y - p0.y;
        const bz = p2.z - p0.z;

        const nx = ay * bz - az * by;
        const ny = az * bx - ax * bz;
        const nz = ax * by - ay * bx;

        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (len === 0) return;

        const normal = { x: nx / len, y: ny / len, z: nz / len };

        // Two-sided shading
        let useNormal = { ...normal };
        if (useNormal.z > 0) {
          useNormal.x = -useNormal.x;
          useNormal.y = -useNormal.y;
          useNormal.z = -useNormal.z;
        }

        // Calculate volume intensity using key light direction
        const dot1 = useNormal.x * light1Dir.x + useNormal.y * light1Dir.y + useNormal.z * light1Dir.z;
        const diffuse = Math.max(0.2, (dot1 + 1.0) / 2.0); // Rescale to [0.2, 1.0]

        // Dynamic opacities based on lighting angle to convey depth
        const fillOpacity = 0.05 + diffuse * 0.06;
        const edgeOpacity = 0.4 + diffuse * 0.45;

        // Draw face polygon
        ctx.beginPath();
        ctx.moveTo(projected[face.indices[0]].x, projected[face.indices[0]].y);
        for (let i = 1; i < face.indices.length; i++) {
          ctx.lineTo(projected[face.indices[i]].x, projected[face.indices[i]].y);
        }
        ctx.closePath();

        // 1. Semi-transparent holographic fill
        ctx.fillStyle = `rgba(${face.color.r}, ${face.color.g}, ${face.color.b}, ${fillOpacity})`;
        ctx.fill();

        // 2. Outer glowing wireframe edge
        ctx.strokeStyle = `rgba(${face.color.r}, ${face.color.g}, ${face.color.b}, ${edgeOpacity * 0.22})`;
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // 3. Inner bright wireframe core
        ctx.strokeStyle = `rgba(${face.color.r}, ${face.color.g}, ${face.color.b}, ${edgeOpacity})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      });

      // 4. Draw glowing nodes/vertices at each joint
      projected.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.8, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(56, 189, 248, 0.45)"; // Sky blue neon halo glow
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
    <div ref={containerRef} className="w-full aspect-square min-h-[200px] relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
