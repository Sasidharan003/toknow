import { useState } from "react";
import { Link } from "wouter";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useListComplaints } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["Consumer Complaint", "Cyber Crime", "Labour Complaint", "Women Safety", "Police Complaint", "Municipal Complaint", "Public Grievance"];

export default function Complaints() {
  const [category, setCategory] = useState("");
  const { data: complaints, isLoading } = useListComplaints(category ? { category } : undefined);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-primary" /> Complaint Center</h1>
        <p className="text-muted-foreground mt-1">Step-by-step guidance to file complaints with the right authority</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCategory("")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${!category ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground hover:border-primary/40"}`}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c === category ? "" : c)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${category === c ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground hover:border-primary/40"}`}>{c}</button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      ) : !complaints?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No guides found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <Link key={c.id} href={`/complaints/${c.id}`}>
              <div className="bg-card border rounded-xl p-5 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all group flex items-start justify-between gap-4">
                <div>
                  <Badge variant="outline" className="text-xs mb-2">{c.category}</Badge>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{c.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-1">{c.issue}</p>
                </div>
                <ArrowRight className="w-4 h-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
