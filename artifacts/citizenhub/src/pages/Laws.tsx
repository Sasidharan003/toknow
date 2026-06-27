import { useState } from "react";
import { Link } from "wouter";
import { Search, Scale, ArrowRight } from "lucide-react";
import { useListLaws, useListLawCategories } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Laws() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { data: laws, isLoading } = useListLaws(search || category ? { search: search || undefined, category: category || undefined } : undefined);
  const { data: categories } = useListLawCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Scale className="w-6 h-6 text-primary" /> Laws & Rights</h1>
        <p className="text-muted-foreground mt-1">Know your constitutional and legal protections</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input placeholder="Search laws..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCategory("")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${!category ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground hover:border-primary/40"}`}>All</button>
          {categories.map((c) => (
            <button key={c.category} onClick={() => setCategory(c.category === category ? "" : c.category)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${category === c.category ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground hover:border-primary/40"}`}>
              {c.category} <span className="opacity-60">({c.count})</span>
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : !laws?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <Scale className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No laws found</p>
          <p className="text-sm">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {laws.map((law) => (
            <Link key={law.id} href={`/laws/${law.id}`}>
              <div className="bg-card border rounded-xl p-5 cursor-pointer hover-lift hover-glow group h-full flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{law.category}</Badge>
                  {law.isFeatured && <Badge className="text-xs bg-secondary/10 text-secondary border-secondary/20">Featured</Badge>}
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{law.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 flex-1">{law.summary}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
                  Read more <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
