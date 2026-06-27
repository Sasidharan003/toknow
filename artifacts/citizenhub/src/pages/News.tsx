import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Newspaper, Bookmark, RefreshCw, Clock, Wifi } from "lucide-react";
import { useListNews, useCreateBookmark, getListBookmarksQueryKey, getListNewsQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = ["New Laws", "Government Notifications", "Scheme Updates", "Public Advisories"];

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function News() {
  const [category, setCategory] = useState("");
  const { data: news, isLoading } = useListNews(category ? { category } : undefined);
  const createBookmark = useCreateBookmark();
  const qc = useQueryClient();

  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    fetch(`${BASE}/api/news/status`)
      .then((r) => r.json())
      .then((d) => {
        setLastRefreshedAt(d.lastRefreshedAt ?? null);
        setIsRefreshing(d.isRefreshing ?? false);
      })
      .catch(() => {});
  }, [refreshTick]);

  useEffect(() => {
    if (!isRefreshing) return;
    const interval = setInterval(() => setRefreshTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, [isRefreshing]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`${BASE}/api/news/refresh`, { method: "POST" });
      const data = await res.json();
      setLastRefreshedAt(data.lastRefreshedAt ?? null);
      qc.invalidateQueries({ queryKey: getListNewsQueryKey() });
    } catch {
    } finally {
      setIsRefreshing(false);
    }
  }, [qc]);

  function handleBookmark(e: React.MouseEvent, n: { id: number; title: string }) {
    e.preventDefault();
    createBookmark.mutate({ data: { contentType: "news", contentId: n.id, contentTitle: n.title } }, {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListBookmarksQueryKey() }),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-primary" /> News & Updates
          </h1>
          <p className="text-muted-foreground mt-1">Live news from PIB India, NDTV, The Hindu — refreshed daily</p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card text-sm font-medium hover:border-primary/40 hover:bg-muted transition-all disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            {isRefreshing ? "Refreshing…" : "Refresh Now"}
          </button>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Updated: {timeAgo(lastRefreshedAt)}</span>
          </div>
        </div>
      </div>

      {isRefreshing && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-sm text-primary">
          <Wifi className="w-4 h-4 animate-pulse" />
          Fetching latest news from PIB India, NDTV &amp; The Hindu…
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${!category ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground hover:border-primary/40"}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c === category ? "" : c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${category === c ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground hover:border-primary/40"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      ) : !news?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No articles yet</p>
          <p className="text-sm mt-1">Click "Refresh Now" to fetch the latest news</p>
        </div>
      ) : (
        <div className="space-y-3">
          {news.map((n) => (
            <Link key={n.id} href={`/news/${n.id}`}>
              <div className="bg-card border rounded-xl p-5 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all group flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{n.category}</Badge>
                    {n.source && <span className="text-xs text-muted-foreground">{n.source}</span>}
                  </div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{n.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{n.summary}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(n.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <button
                  onClick={(e) => handleBookmark(e, n)}
                  title="Bookmark"
                  className="p-2 rounded-lg border hover:bg-muted transition-colors shrink-0 mt-1"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
