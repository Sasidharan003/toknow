import { useState } from "react";
import { Link } from "wouter";
import { Search, Landmark, ArrowRight } from "lucide-react";
import { useListServices } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Services() {
  const [search, setSearch] = useState("");
  const { data: services, isLoading } = useListServices(search ? { search } : undefined);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Landmark className="w-6 h-6 text-primary" /> Government Services</h1>
        <p className="text-muted-foreground mt-1">Step-by-step guidance for essential government services</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input placeholder="Search services (Aadhaar, PAN, Passport...)" className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      ) : !services?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <Landmark className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No services found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => (
            <Link key={svc.id} href={`/services/${svc.id}`}>
              <div className="bg-card border rounded-xl p-5 cursor-pointer hover-lift hover-glow group h-full flex flex-col">
                <Badge variant="outline" className="text-xs mb-3 self-start">{svc.category}</Badge>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{svc.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 flex-1">{svc.overview}</p>
                {svc.processingTime && <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">Processing: {svc.processingTime}</p>}
                <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">View guide <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
