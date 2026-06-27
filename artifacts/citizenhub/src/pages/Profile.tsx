import { useState, useEffect, useRef } from "react";
import { User, Shield, Trophy, Bookmark, LogOut, Mail, Phone, MapPin, Award, CheckCircle2, Lock, ArrowRight, Download, RefreshCw, Key, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useListBookmarks, useDeleteBookmark, getListBookmarksQueryKey } from "@workspace/api-client-react";

interface UserSession {
  name: string;
  email: string;
  phone: string;
  state: string;
  role: "Citizen" | "Verified Expert" | "Admin";
}

const BADGES = [
  { id: "constitution", name: "Constitution Guardian", desc: "Completed Constitutional Rights quiz", icon: Shield, quizId: 1 },
  { id: "consumer", name: "Consumer Advocate", desc: "Completed Consumer Protection quiz", icon: Trophy, quizId: 2 },
  { id: "rti", name: "RTI Champion", desc: "Completed RTI Act quiz", icon: Award, quizId: 3 },
  { id: "labour", name: "Labour Protector", desc: "Completed Labour Law quiz", icon: Award, quizId: 4 }
];

export default function Profile() {
  const queryClient = useQueryClient();
  const { data: bookmarks, isLoading: loadingBookmarks } = useListBookmarks();
  const removeBookmark = useDeleteBookmark();

  // Auth States
  const [user, setUser] = useState<UserSession | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "otp" | "google">("email");
  
  // Form Inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedState, setSelectedState] = useState("Tamil Nadu");
  const [selectedRole, setSelectedRole] = useState<"Citizen" | "Verified Expert" | "Admin">("Citizen");
  
  // OTP simulation states
  const [otpSent, setOtpSent] = useState(false);

  // User Stats
  const [xp, setXp] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState<number[]>([]);
  const [completedCourses, setCompletedCourses] = useState<number[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeCertCourse, setActiveCertCourse] = useState<string | null>(null);

  // 1. Fetch localStorage profile & stats on mount
  useEffect(() => {
    function loadSession() {
      try {
        const session = localStorage.getItem("citizenhub_user");
        if (session) setUser(JSON.parse(session));

        const storedXp = parseInt(localStorage.getItem("citizenhub_xp") ?? "0") || 0;
        setXp(storedXp);

        const storedQuizzes = JSON.parse(localStorage.getItem("citizenhub_completed_quizzes") ?? "[]");
        setCompletedQuizzes(storedQuizzes);

        const storedCourses = JSON.parse(localStorage.getItem("citizenhub_completed_courses") ?? "[]");
        setCompletedCourses(storedCourses);
      } catch (err) {
        console.error("Failed to load user state:", err);
      }
    }
    loadSession();
    const interval = setInterval(loadSession, 1500); // Poll local XP updates
    return () => clearInterval(interval);
  }, []);

  // 2. Perform Mock Login/Register
  function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    let userData: UserSession;

    if (authMethod === "google") {
      userData = {
        name: "Google User",
        email: "googleuser@gmail.com",
        phone: "+91 98765 43210",
        state: "Tamil Nadu",
        role: "Citizen"
      };
    } else if (authMethod === "otp") {
      if (!otpSent) {
        setOtpSent(true);
        alert("Simulated OTP sent to phone: 123456");
        return;
      }
      if (otp !== "123456") {
        alert("Invalid OTP! Try entering 123456");
        return;
      }
      userData = {
        name: "Mobile Citizen",
        email: "otpuser@toknow.org",
        phone: phone,
        state: selectedState,
        role: selectedRole
      };
    } else {
      // Email auth
      userData = {
        name: isRegister ? name : email.split("@")[0],
        email: email,
        phone: "+91 94440 12345",
        state: selectedState,
        role: selectedRole
      };
    }

    localStorage.setItem("citizenhub_user", JSON.stringify(userData));
    setUser(userData);
    resetAuthForms();
  }

  function handleGoogleLogin() {
    const userData: UserSession = {
      name: "Ramesh Kumar",
      email: "ramesh.kumar@gmail.com",
      phone: "+91 99620 54321",
      state: "Tamil Nadu",
      role: "Citizen"
    };
    localStorage.setItem("citizenhub_user", JSON.stringify(userData));
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem("citizenhub_user");
    setUser(null);
  }

  function resetAuthForms() {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setOtp("");
    setOtpSent(false);
  }

  function handleDeleteBookmark(id: number) {
    removeBookmark.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBookmarksQueryKey() });
      }
    });
  }

  // 3. Render Canvas Digital Certificate
  function drawCertificate(courseName: string) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset canvas size (high DPI output)
    canvas.width = 800;
    canvas.height = 600;

    // Background border & structure
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 800, 600);

    // Decorative outer gold border
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 15;
    ctx.strokeRect(20, 20, 760, 560);

    // Inner thin border
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 3;
    ctx.strokeRect(35, 35, 730, 530);

    // Draw background seal watermark
    ctx.fillStyle = "rgba(30, 58, 138, 0.03)";
    ctx.beginPath();
    ctx.arc(400, 300, 160, 0, Math.PI * 2);
    ctx.fill();

    // Headers
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "bold 32px 'Times New Roman', Times, serif";
    ctx.textAlign = "center";
    ctx.fillText("TO KNOW DIGITAL ACADEMY", 400, 100);

    ctx.fillStyle = "#d97706";
    ctx.font = "italic 18px Georgia, serif";
    ctx.fillText("Verifiable Certificate of Course Completion", 400, 140);

    ctx.fillStyle = "#334155";
    ctx.font = "16px Arial, sans-serif";
    ctx.fillText("This is proudly awarded to", 400, 210);

    // Student Name
    ctx.fillStyle = "#111827";
    ctx.font = "bold 36px 'Times New Roman', Times, serif";
    ctx.fillText(user?.name.toUpperCase() || "CITIZEN HUB MEMBER", 400, 265);

    // Line separator
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(250, 290);
    ctx.lineTo(550, 290);
    ctx.stroke();

    // Body text
    ctx.fillStyle = "#475569";
    ctx.font = "15px Arial, sans-serif";
    ctx.fillText("for successfully demonstrating core knowledge and completing the course", 400, 330);

    ctx.fillStyle = "#1e3a8a";
    ctx.font = "bold 24px Arial, sans-serif";
    ctx.fillText(`"${courseName}"`, 400, 375);

    // Date and Verification ID
    ctx.fillStyle = "#64748b";
    ctx.font = "12px monospace";
    ctx.fillText(`Date: ${new Date().toLocaleDateString("en-IN")}`, 250, 470);
    ctx.fillText(`Certificate ID: CH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 250, 495);

    // Signatures
    ctx.strokeStyle = "#64748b";
    ctx.beginPath();
    ctx.moveTo(500, 465);
    ctx.lineTo(650, 465);
    ctx.stroke();

    ctx.fillStyle = "#111827";
    ctx.font = "italic 14px 'Times New Roman', serif";
    ctx.fillText("Director, TO KNOW", 575, 485);
  }

  function downloadCertificate() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `Certificate_${activeCertCourse?.replace(/\s+/g, "_")}.png`;
    a.click();
  }

  useEffect(() => {
    if (activeCertCourse) {
      drawCertificate(activeCertCourse);
    }
  }, [activeCertCourse, user]);

  const levelName = xp < 100 ? "Beginner" : xp < 300 ? "Learner" : xp < 600 ? "Citizen" : xp < 1000 ? "Expert" : "Champion";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-page-enter">
      {/* ─── GUEST LOGIN PANEL ──────────────────────────────────────── */}
      {!user ? (
        <div key={isRegister ? "register" : "login"} className="max-w-md mx-auto bg-card border rounded-2xl p-6 md:p-8 shadow-lg space-y-6 animate-tab-enter">
          <div className="text-center space-y-2">
            <div className="bg-primary/5 p-3.5 rounded-full inline-block text-primary">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{isRegister ? "Join TO KNOW" : "Access your Profile"}</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">Save legal resources, track course progress, and earn digital certs</p>
          </div>

          {/* Auth Methods Switch */}
          <div className="grid grid-cols-3 bg-muted rounded-lg p-1 text-xs font-semibold">
            <button onClick={() => { setAuthMethod("email"); setOtpSent(false); }} className={`py-1.5 rounded-md cursor-pointer transition-colors ${authMethod === "email" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>Email</button>
            <button onClick={() => { setAuthMethod("otp"); setOtpSent(false); }} className={`py-1.5 rounded-md cursor-pointer transition-colors ${authMethod === "otp" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>Phone OTP</button>
            <button onClick={() => setAuthMethod("google")} className={`py-1.5 rounded-md cursor-pointer transition-colors ${authMethod === "google" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>Google</button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMethod === "email" && (
              <>
                {isRegister && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground block">Full Name</label>
                    <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground block">Email Address</label>
                  <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground block">Password</label>
                  <Input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </>
            )}

            {authMethod === "otp" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground block">Mobile Number</label>
                  <Input placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={otpSent} required />
                </div>
                {otpSent && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground block">Enter 6-Digit OTP</label>
                    <Input placeholder="Enter OTP (type 123456)" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                  </div>
                )}
              </>
            )}

            {authMethod === "google" && (
              <div className="py-4 text-center space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">Log in instantly using a mocked Google Account integration.</p>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.83 0 3.22.78 3.93 1.45l2.94-2.87C17.09 1.83 14.81 1 12 1 7.24 1 3.28 3.73 1.41 7.74l3.52 2.73C5.77 7.02 8.6 5.04 12 5.04z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.46h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.71 2.87c2.16-1.99 3.42-4.92 3.42-8.56z"/><path fill="#FBBC05" d="M4.93 10.47c-.24-.72-.38-1.5-.38-2.31s.14-1.59.38-2.31L1.41 5.12C.51 6.92 0 8.92 0 11s.51 4.08 1.41 5.88l3.52-2.73c-.24-.72-.38-1.5-.38-2.31z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.71-2.87c-1.03.69-2.35 1.1-4.25 1.1-3.4 0-6.23-1.98-7.26-4.99l-3.52 2.73C3.28 20.27 7.24 23 12 23z"/></svg>
                  Login with Google
                </button>
              </div>
            )}

            {authMethod !== "google" && (
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:opacity-95 transition-opacity cursor-pointer shadow"
              >
                {authMethod === "otp" && !otpSent ? "Request OTP" : isRegister ? "Sign Up" : "Log In"}
              </button>
            )}
          </form>

          {authMethod !== "google" && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-primary font-medium hover:underline cursor-pointer"
              >
                {isRegister ? "Already have an account? Log In" : "Need an account? Register Now"}
              </button>
            </div>
          )}
        </div>
      ) : (
        // ─── LOGGED IN PROFILE PAGE ───────────────────────────────────
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Info Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-card border rounded-2xl p-6 shadow-sm text-center relative">
              <div className="absolute top-4 right-4">
                <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive cursor-pointer p-1.5 rounded-lg hover:bg-muted" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <div className="w-20 h-20 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-3xl mx-auto shadow border border-white/20">
                {user.name.substring(0, 2).toUpperCase()}
              </div>

              <h2 className="text-lg font-bold text-foreground mt-4">{user.name}</h2>
              <div className="flex justify-center mt-1">
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary">{user.role}</Badge>
              </div>

              <div className="border-t mt-5 pt-5 space-y-3.5 text-left text-xs text-muted-foreground leading-relaxed">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>{user.state}</span>
                </div>
              </div>
            </div>

            {/* Gamification Stats Card */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b pb-2">
                <Trophy className="w-4.5 h-4.5 text-yellow-500" /> Civic Progress Stats
              </h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50/50 border rounded-xl p-3">
                  <span className="text-lg font-bold text-primary">{xp}</span>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">Total XP</p>
                </div>
                <div className="bg-slate-50/50 border rounded-xl p-3">
                  <span className="text-lg font-bold text-secondary">{levelName}</span>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">Level</p>
                </div>
                <div className="bg-slate-50/50 border rounded-xl p-3">
                  <span className="text-lg font-bold text-foreground">{completedCourses.length}</span>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">Courses</p>
                </div>
                <div className="bg-slate-50/50 border rounded-xl p-3">
                  <span className="text-lg font-bold text-foreground">{completedQuizzes.length}</span>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">Quizzes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bookmarks, Badges & Certificates */}
          <div className="md:col-span-2 space-y-6">
            {/* Badges Panel */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-foreground border-b pb-2">Unlocked Badges</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {BADGES.map((b) => {
                  const isUnlocked = completedQuizzes.includes(b.quizId);
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.id}
                      className={`text-center p-4 border rounded-xl flex flex-col items-center justify-between shadow-sm relative group transition-all duration-150 ${isUnlocked ? "bg-amber-50/20 border-amber-200" : "bg-muted/10 opacity-55 border-slate-100"}`}
                    >
                      {!isUnlocked && (
                        <div className="absolute top-2 right-2 text-muted-foreground/60"><Lock className="w-3 h-3" /></div>
                      )}
                      <div className={`p-3 rounded-full mb-2 ${isUnlocked ? "bg-amber-100 text-amber-600 animate-pulse" : "bg-slate-200 text-slate-400"}`}>
                        <Icon className="w-5 h-5 fill-current" />
                      </div>
                      <span className="font-bold text-xs leading-tight text-foreground">{b.name}</span>
                      <p className="text-[9px] text-muted-foreground mt-1 leading-snug">{b.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verifiable Completion Certificates */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-foreground border-b pb-2">Course Certificates</h3>
              {completedCourses.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Award className="w-8 h-8 mx-auto mb-2 opacity-35" />
                  <p className="text-xs">No certificates unlocked yet. Complete any course to download a certificate.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {completedCourses.map((cId) => {
                      const courseTitle = cId === 1 ? "Constitutional Rights" : cId === 2 ? "RTI" : cId === 3 ? "Consumer Protection Act 2019" : "Women's Safety and Legal Rights";
                      return (
                        <div key={cId} className="bg-slate-50/50 border rounded-xl p-4 flex justify-between items-center shadow-sm">
                          <div>
                            <h4 className="font-bold text-xs text-foreground line-clamp-1">{courseTitle}</h4>
                            <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1 mt-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Certificate Unlocked
                            </span>
                          </div>
                          <button
                            onClick={() => setActiveCertCourse(courseTitle)}
                            className="bg-primary text-primary-foreground p-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                            title="Preview Certificate"
                          >
                            <Award className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Certificate Preview Drawer */}
                  {activeCertCourse && (
                    <div className="bg-slate-100 border rounded-xl p-4 space-y-4 flex flex-col items-center">
                      <div className="flex items-center justify-between w-full border-b pb-2">
                        <span className="text-xs font-bold text-muted-foreground">Certificate Preview</span>
                        <button onClick={() => setActiveCertCourse(null)} className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded-md hover:bg-slate-200">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="overflow-x-auto w-full flex justify-center bg-white p-2 border shadow-sm rounded-lg">
                        <canvas ref={canvasRef} className="w-full max-w-[480px] aspect-[4/3] border" />
                      </div>
                      <button
                        onClick={downloadCertificate}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download Certificate (PNG)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bookmarks Section */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-foreground border-b pb-2">My Saved Resources</h3>
              {loadingBookmarks ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 rounded-xl" />
                  <Skeleton className="h-12 rounded-xl" />
                </div>
              ) : !bookmarks || bookmarks.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-35" />
                  <p className="text-xs">No bookmarks saved yet. Save items while browsing laws or schemes.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarks.map((bm) => (
                    <div key={bm.id} className="bg-slate-50/50 border rounded-xl p-4 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-primary/5 p-2 rounded-lg text-primary shrink-0">
                          <Bookmark className="w-4 h-4 fill-current" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-[9px] uppercase font-semibold">{bm.contentType}</Badge>
                          <h4 className="font-bold text-xs text-foreground line-clamp-1 mt-1">{bm.contentTitle}</h4>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a href={`/${bm.contentType}s/${bm.contentId}`} className="p-2 border border-slate-200 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer" title="View details">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDeleteBookmark(bm.id)}
                          className="p-2 border border-slate-200 hover:border-destructive text-muted-foreground hover:text-destructive rounded-lg transition-colors cursor-pointer"
                          title="Remove bookmark"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
