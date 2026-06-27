import { Link } from "wouter";
import { Bookmark, Trash2, Scale, FileText, Newspaper } from "lucide-react";
import { useListBookmarks, useDeleteBookmark, getListBookmarksQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

const ICON_MAP: Record<string, React.ElementType> = { law: Scale, scheme: FileText, news: Newspaper };
const HREF_MAP: Record<string, string> = { law: "/laws", scheme: "/schemes", news: "/news" };

export default function Bookmarks() {
  const { data: bookmarks, isLoading } = useListBookmarks();
  const deleteBookmark = useDeleteBookmark();
  const qc = useQueryClient();

  function handleDelete(id: number) {
    deleteBookmark.mutate({ id }, {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListBookmarksQueryKey() }),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Bookmark className="w-6 h-6 text-primary" /> Saved Items</h1>
        <p className="text-muted-foreground mt-1">Your bookmarked laws, schemes and news</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : !bookmarks?.length ? (
        <div className="text-center py-20 text-muted-foreground">
          <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No saved items yet</p>
          <p className="text-sm mt-1">Bookmark laws, schemes and news by clicking the bookmark icon on any page.</p>
          <div className="flex gap-3 justify-center mt-5">
            <Link href="/laws"><button className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg">Browse Laws</button></Link>
            <Link href="/schemes"><button className="text-sm bg-card border px-4 py-2 rounded-lg text-foreground">Browse Schemes</button></Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => {
            const Icon = ICON_MAP[b.contentType] ?? Bookmark;
            const href = `${HREF_MAP[b.contentType] ?? ""}/${b.contentId}`;
            return (
              <div key={b.id} className="bg-card border rounded-xl p-4 flex items-center gap-4 hover:border-primary/40 transition-all">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="outline" className="text-xs mb-1 capitalize">{b.contentType}</Badge>
                  <Link href={href} className="block font-medium text-sm hover:text-primary transition-colors truncate">{b.contentTitle}</Link>
                  <p className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <button onClick={() => handleDelete(b.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
