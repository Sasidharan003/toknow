import { useState } from "react";
import { Link } from "wouter";
import { Search, FileText, ArrowRight, Star } from "lucide-react";
import { useListSchemes, useListSchemeCategories, useListFeaturedSchemes } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Schemes() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedState, setSelectedState] = useState("All");

  const { data: schemes, isLoading } = useListSchemes(search || category ? { search: search || undefined, category: category || undefined } : undefined);
  const { data: categories } = useListSchemeCategories();
  const { data: featured } = useListFeaturedSchemes();

  const STATES = [
    { value: "All", label: "All Schemes" },
    { value: "All India", label: "Central / Overall Only" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Delhi", label: "Delhi" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "West Bengal", label: "West Bengal" }
  ];

  // Client-side filtering to show only the selected state's schemes
  const filteredSchemes = schemes?.filter((s) => {
    if (selectedState === "All") return true;
    return s.stateApplicability === selectedState;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-primary" /> Government Schemes</h1>
        <p className="text-muted-foreground mt-1">Find welfare programs and benefits you qualify for</p>
      </div>

      {!search && !category && selectedState === "All" && featured && featured.length > 0 && (
        <div className="bg-gradient-to-r from-secondary/10 to-transparent border border-secondary/20 rounded-xl p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2 text-secondary"><Star className="w-4 h-4" /> Featured Schemes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {featured.slice(0, 3).map((s) => (
              <Link key={s.id} href={`/schemes/${s.id}`}>
                <div className="bg-card border rounded-lg p-4 cursor-pointer hover-lift hover-glow">
                  <Badge variant="outline" className="text-xs mb-2">{s.category}</Badge>
                  <h3 className="font-medium text-sm line-clamp-2">{s.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input placeholder="Search schemes..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* State Filter Toolbar */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">State/Region Applicability:</span>
        <div className="flex flex-wrap gap-2">
          {STATES.map((st) => (
            <button
              key={st.value}
              onClick={() => setSelectedState(st.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${selectedState === st.value ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card text-muted-foreground hover:border-primary/30"}`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Toolbar */}
      {categories && categories.length > 0 && (
        <div className="space-y-2 border-t pt-4">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Filter by Category:</span>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCategory("")} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border cursor-pointer ${!category ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground hover:border-primary/40"}`}>All Categories</button>
            {categories.map((c) => (
              <button key={c.category} onClick={() => setCategory(c.category === category ? "" : c.category)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border cursor-pointer ${category === c.category ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground hover:border-primary/40"}`}>
                {c.category} <span className="opacity-60">({c.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t pt-4">
          {[1,2,3,4,5,6].map((i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      ) : !filteredSchemes?.length ? (
        <div className="text-center py-16 text-muted-foreground border-t pt-4">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No schemes found matching the filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t pt-4">
          {filteredSchemes.map((s) => (
            <Link key={s.id} href={`/schemes/${s.id}`}>
              <div className="bg-card border rounded-xl p-5 cursor-pointer hover-lift hover-glow group h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{s.category}</Badge>
                    <div className="flex gap-1 items-center">
                      {s.stateApplicability !== "All India" && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] scale-90 origin-right shrink-0">{s.stateApplicability}</Badge>
                      )}
                      {s.isFeatured && <Star className="w-3.5 h-3.5 text-secondary fill-secondary shrink-0" />}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">{s.title}</h3>
                  <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed">{s.description}</p>
                </div>
                <div className="flex items-center gap-1 mt-4 text-xs text-primary font-medium">
                  View details <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
