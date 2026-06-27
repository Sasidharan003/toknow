import { Link } from "wouter";
import { ArrowLeft, Landmark, Clock, IndianRupee, ExternalLink } from "lucide-react";
import { useGetService } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceDetail({ id }: { id: string }) {
  const serviceId = parseInt(id, 10);
  const { data: service, isLoading } = useGetService(serviceId, { query: { enabled: !!serviceId } as any });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full rounded-xl" /></div>;
  if (!service) return <div className="text-center py-20 text-muted-foreground"><p>Service not found</p></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/services" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </Link>

      <div className="bg-card border rounded-2xl p-7">
        <Badge variant="outline" className="mb-3">{service.category}</Badge>
        <h1 className="text-2xl font-bold mb-3">{service.title}</h1>
        <p className="text-muted-foreground leading-relaxed">{service.overview}</p>

        <div className="flex flex-wrap gap-4 mt-5">
          {service.fees && <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100"><IndianRupee className="w-4 h-4" /> Fees: {service.fees}</div>}
          {service.processingTime && <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100"><Clock className="w-4 h-4" /> {service.processingTime}</div>}
        </div>
      </div>

      {service.eligibility && (
        <div className="bg-card border rounded-xl p-6">
          <h2 className="font-semibold mb-3 text-primary">Eligibility</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{service.eligibility}</p>
        </div>
      )}
      {service.requiredDocuments && (
        <div className="bg-card border rounded-xl p-6">
          <h2 className="font-semibold mb-3 text-primary">Required Documents</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{service.requiredDocuments}</p>
        </div>
      )}
      {service.applicationProcess && (
        <div className="bg-card border rounded-xl p-6">
          <h2 className="font-semibold mb-3 text-primary">How to Apply</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{service.applicationProcess}</p>
        </div>
      )}
      {service.officialUrl && (
        <a href={service.officialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary font-medium hover:underline">
          <Landmark className="w-4 h-4" /><ExternalLink className="w-4 h-4" /> Apply at Official Portal
        </a>
      )}
    </div>
  );
}
