import { Link } from "wouter";
import { Scale, FileText, Landmark, AlertTriangle, Newspaper, MessageCircle, BookOpen, Bookmark, User, ArrowRight, TrendingUp, MapPin, FilePlus, Sparkles, CheckCircle2 } from "lucide-react";
import { useGetDashboardSummary, useListNews, useListFeaturedSchemes, useListSchemes } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Interactive3DScale } from "@/components/Interactive3DScale";



const MODULES = [
  { href: "/laws", icon: Scale, label: "Laws & Rights", desc: "Know your constitutional and legal rights", color: "bg-blue-50/75 text-blue-700 border-blue-100 hover:bg-blue-50" },
  { href: "/schemes", icon: FileText, label: "Gov Schemes", desc: "Find programs you qualify for", color: "bg-orange-50/75 text-orange-700 border-orange-100 hover:bg-orange-50" },
  { href: "/services", icon: Landmark, label: "Public Services", desc: "Aadhaar, PAN, Passport & more", color: "bg-purple-50/75 text-purple-700 border-purple-100 hover:bg-purple-50" },
  { href: "/complaints", icon: AlertTriangle, label: "Complaint Center", desc: "Step-by-step complaint guidance", color: "bg-red-50/75 text-red-700 border-red-100 hover:bg-red-50" },
  { href: "/documents", icon: FilePlus, label: "Documents Creator", desc: "Draft rental agreements, letters, etc.", color: "bg-indigo-50/75 text-indigo-700 border-indigo-100 hover:bg-indigo-50" },
  { href: "/nearby", icon: MapPin, label: "Nearby Services", desc: "Locate courts, police stations & RTOs", color: "bg-pink-50/75 text-pink-700 border-pink-100 hover:bg-pink-50" },
  { href: "/chat", icon: MessageCircle, label: "AI Assistant", desc: "Ask any civic question in plain language", color: "bg-green-50/75 text-green-700 border-green-100 hover:bg-green-50" },
  { href: "/learning", icon: BookOpen, label: "Learning Center", desc: "Courses, quizzes & earn XP badges", color: "bg-teal-50/75 text-teal-700 border-teal-100 hover:bg-teal-50" },
  { href: "/news", icon: Newspaper, label: "News & Updates", desc: "Latest laws, schemes & notifications", color: "bg-yellow-50/75 text-yellow-700 border-yellow-100 hover:bg-yellow-50" },
  { href: "/profile", icon: User, label: "My Profile & Stats", desc: "View earned badges and certificates", color: "bg-slate-50/75 text-slate-700 border-slate-100 hover:bg-slate-50" },
];

function StatCard({ label, value, isLoading }: { label: string; value?: number; isLoading: boolean }) {
  return (
    <div className="bg-card border rounded-xl p-5 flex flex-col gap-1 shadow-sm card-3d hover-glow">
      <span className="text-2xl font-bold text-primary card-3d-content">{isLoading ? <Skeleton className="h-7 w-16" /> : value?.toLocaleString()}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();
  const { data: featuredSchemes } = useListFeaturedSchemes();
  const { data: news } = useListNews({ limit: 4 });
  const { data: allSchemes } = useListSchemes();

  // Eligibility Matcher state
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [occupation, setOccupation] = useState("all");
  const [results, setResults] = useState<any[]>([]);
  const [checked, setChecked] = useState(false);

  function handleCheckEligibility() {
    if (!allSchemes) return;
    const incVal = parseFloat(income) || 0;
    const ageVal = parseInt(age) || 0;

    const matched = allSchemes.filter((s) => {
      // Direct filters matching scheme titles and descriptions
      const sTitle = s.title.toLowerCase();
      const sDesc = s.description.toLowerCase();

      // Check healthcare
      if (sTitle.includes("ayushman") || sDesc.includes("ayushman") || sDesc.includes("insurance")) {
        if (ageVal >= 70) return true; // Seniors above 70 get free card
        if (incVal < 25000) return true; // Low income families qualify
        return false;
      }
      // Check farmer scheme
      if (sTitle.includes("kisan") || sDesc.includes("farmer")) {
        return occupation === "farmer";
      }
      // Check housing PMAY
      if (sTitle.includes("awas") || sTitle.includes("housing")) {
        return incVal <= 100000; // Under EWS/LIG cap
      }
      // Check rural employment
      if (sTitle.includes("nrega") || sTitle.includes("guaranteed employment")) {
        return occupation === "rural" || incVal < 15000;
      }
      return true; // Default match other general schemes
    });

    setResults(matched);
    setChecked(true);
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-primary-foreground text-primary-foreground rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-lg border border-primary/20 hero-3d">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent animate-pulse" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 max-w-2xl">
            <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 mb-4 px-3 py-1 font-semibold card-3d-badge">India's Civic Digital Platform</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight tracking-tight card-3d-content">Empowering Every Indian Citizen</h1>
            <p className="text-primary-foreground/75 text-lg mb-6 leading-relaxed">Access your rights, draft legal documents, verify government schemes eligibility, and get AI guidance — in simple language.</p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/chat">
                <button className="bg-secondary text-white px-6 py-2.5 rounded-lg font-semibold hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer shadow btn-3d">
                  <MessageCircle className="w-4 h-4" /> Ask AI Assistant
                </button>
              </Link>
              <Link href="/laws">
                <button className="bg-white/10 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center gap-2 cursor-pointer border border-white/10 btn-3d">
                  <Scale className="w-4 h-4" /> Browse Laws
                </button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block md:col-span-1 animate-fade-in-up">
            <div className="relative group max-w-[260px] mx-auto hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <Interactive3DScale />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground"><TrendingUp className="w-5 h-5 text-secondary" /> Platform Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Laws & Rights" value={summary?.totalLaws} isLoading={isLoading} />
          <StatCard label="Gov Schemes" value={summary?.totalSchemes} isLoading={isLoading} />
          <StatCard label="Public Services" value={summary?.totalServices} isLoading={isLoading} />
          <StatCard label="News Articles" value={summary?.totalNews} isLoading={isLoading} />
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Access Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((mod) => (
            <Link key={mod.href} href={mod.href}>
              <div className={`border rounded-xl p-5 cursor-pointer hover-lift ${mod.color}`}>
                <div className="flex items-start gap-3">
                  <mod.icon className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">{mod.label}</div>
                    <div className="text-xs opacity-75 mt-0.5 leading-relaxed">{mod.desc}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Eligibility Matcher Widget */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Scheme Eligibility Matcher</h3>
            <p className="text-xs text-muted-foreground">Find out which government welfare programs you qualify for instantly</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Your Age (Years)</label>
            <input type="number" placeholder="Enter age" value={age} onChange={(e) => setAge(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm bg-background" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Monthly Income (Rs.)</label>
            <input type="number" placeholder="Enter monthly income" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm bg-background" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Occupation / Sector</label>
            <select value={occupation} onChange={(e) => setOccupation(e.target.value)} className="w-full border rounded-lg p-2.5 text-sm bg-background">
              <option value="all">General / Salaried</option>
              <option value="farmer">Farmer / Landowner</option>
              <option value="rural">Rural Worker / Daily wage</option>
              <option value="unemployed">Unemployed Student</option>
            </select>
          </div>
        </div>

        <button onClick={handleCheckEligibility} className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm cursor-pointer shadow-sm">
          Match Schemes
        </button>

        {checked && (
          <div className="mt-5 border-t pt-5 space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Matched Schemes ({results.length})</h4>
            {results.length === 0 ? (
              <p className="text-xs text-muted-foreground">No direct matching schemes found. Adjust your filters or browse schemes directly.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((s) => (
                  <Link key={s.id} href={`/schemes/${s.id}`}>
                    <div className="bg-muted/40 border rounded-lg p-3 hover:border-primary/30 transition-all cursor-pointer">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-semibold text-xs text-foreground line-clamp-1">{s.title}</span>
                        <Badge variant="secondary" className="text-[10px] scale-90 origin-right shrink-0">{s.category}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1">{s.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Featured Schemes */}
      {featuredSchemes && featuredSchemes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Popular Schemes</h2>
            <Link href="/schemes" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredSchemes.slice(0, 3).map((s) => (
              <Link key={s.id} href={`/schemes/${s.id}`}>
                <div className="bg-card border rounded-xl p-5 cursor-pointer flex flex-col justify-between h-36 card-3d hover-glow">
                  <div>
                    <Badge variant="outline" className="mb-2 text-xs card-3d-badge">{s.category}</Badge>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1 card-3d-content">{s.title}</h3>
                    <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Latest News */}
      {news && news.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Latest Updates & Notices</h2>
            <Link href="/news" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {news.map((n) => (
              <Link key={n.id} href={`/news/${n.id}`}>
                <div className="bg-card border rounded-xl p-4 cursor-pointer hover-lift flex items-start gap-4 justify-between">
                  <div className="flex-1 min-w-0">
                    <Badge variant="outline" className="text-xs mb-1">{n.category}</Badge>
                    <h3 className="font-medium text-sm line-clamp-1">{n.title}</h3>
                    <p className="text-muted-foreground text-xs line-clamp-1 mt-0.5">{n.summary}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap self-center">{new Date(n.publishedAt).toLocaleDateString("en-IN")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
