import { Link } from "wouter";
import { ArrowLeft, Newspaper, Bookmark } from "lucide-react";
import { useGetNewsArticle, useCreateBookmark, getListBookmarksQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

export default function NewsDetail({ id }: { id: string }) {
  const newsId = parseInt(id, 10);
  const { data: article, isLoading } = useGetNewsArticle(newsId, { query: { enabled: !!newsId } as any });
  const createBookmark = useCreateBookmark();
  const qc = useQueryClient();

  function handleBookmark() {
    if (!article) return;
    createBookmark.mutate({ data: { contentType: "news", contentId: article.id, contentTitle: article.title } }, {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListBookmarksQueryKey() }),
    });
  }

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full rounded-xl" /></div>;
  if (!article) return <div className="text-center py-20 text-muted-foreground"><p>Article not found</p></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/news" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to News
      </Link>

      <div className="bg-card border rounded-2xl p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Badge variant="outline" className="mb-3">{article.category}</Badge>
            <h1 className="text-2xl font-bold mb-3">{article.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {article.source && <span>Source: {article.source}</span>}
              <span>{new Date(article.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>
          <button onClick={handleBookmark} title="Bookmark" className="p-2 rounded-lg border hover:bg-muted transition-colors shrink-0">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-6">
        <p className="text-muted-foreground leading-relaxed">{article.summary}</p>
        {article.content && <p className="text-muted-foreground leading-relaxed mt-4 whitespace-pre-line">{article.content}</p>}
      </div>
    </div>
  );
}
