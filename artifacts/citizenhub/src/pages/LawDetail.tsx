import { Link } from "wouter";
import { ArrowLeft, Scale, Bookmark, ExternalLink } from "lucide-react";
import { useGetLaw, useCreateBookmark, getListBookmarksQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

export default function LawDetail({ id }: { id: string }) {
  const lawId = parseInt(id, 10);
  const { data: law, isLoading } = useGetLaw(lawId, { query: { enabled: !!lawId } as any });
  const createBookmark = useCreateBookmark();
  const qc = useQueryClient();

  function handleBookmark() {
    if (!law) return;
    createBookmark.mutate({ data: { contentType: "law", contentId: law.id, contentTitle: law.title } }, {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListBookmarksQueryKey() }),
    });
  }

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full rounded-xl" /></div>;
  if (!law) return <div className="text-center py-20 text-muted-foreground"><Scale className="w-12 h-12 mx-auto mb-3 opacity-20" /><p>Law not found</p></div>;

  const sections = [
    { key: "purpose", label: "Purpose" },
    { key: "rights", label: "Your Rights" },
    { key: "responsibilities", label: "Responsibilities" },
    { key: "penalties", label: "Penalties" },
    { key: "examples", label: "Real Examples" },
    { key: "faq", label: "FAQ" },
    { key: "references", label: "References" },
  ] as const;

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/laws" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Laws
      </Link>

      <div className="bg-card border rounded-2xl p-7">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <Badge variant="outline" className="mb-2">{law.category}</Badge>
            <h1 className="text-2xl font-bold">{law.title}</h1>
          </div>
          <button onClick={handleBookmark} title="Bookmark" className="p-2 rounded-lg border hover:bg-muted transition-colors shrink-0">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
        <p className="text-muted-foreground leading-relaxed">{law.summary}</p>
      </div>

      {sections.map(({ key, label }) => {
        const value = law[key as keyof typeof law] as string | null | undefined;
        if (!value) return null;
        return (
          <div key={key} className="bg-card border rounded-xl p-6">
            <h2 className="font-semibold text-base mb-3 text-primary">{label}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{value}</p>
          </div>
        );
      })}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <ExternalLink className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800">This information is for educational purposes only. For legal matters, please consult a qualified legal professional or contact a legal aid center near you.</p>
      </div>
    </div>
  );
}
