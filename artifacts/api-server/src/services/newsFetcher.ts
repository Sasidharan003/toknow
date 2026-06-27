import { XMLParser } from "fast-xml-parser";
import { eq } from "drizzle-orm";
import { db, newsTable } from "@workspace/db";
import { logger } from "../lib/logger";

export let lastRefreshedAt: Date | null = null;
export let isRefreshing = false;

const RSS_FEEDS: Array<{ url: string; defaultCategory: string; source: string }> = [
  {
    url: "https://pib.gov.in/RSSFeedDynamic.aspx",
    defaultCategory: "Government Notifications",
    source: "PIB India",
  },
  {
    url: "https://pib.gov.in/RSSFeedDynamic.aspx?MNID=6",
    defaultCategory: "Scheme Updates",
    source: "PIB Finance Ministry",
  },
  {
    url: "https://pib.gov.in/RSSFeedDynamic.aspx?MNID=15",
    defaultCategory: "New Laws",
    source: "PIB Law Ministry",
  },
  {
    url: "https://feeds.feedburner.com/ndtvnews-india-news",
    defaultCategory: "Public Advisories",
    source: "NDTV India",
  },
  {
    url: "https://www.thehindu.com/news/national/?service=rss",
    defaultCategory: "Government Notifications",
    source: "The Hindu",
  },
];

function categorize(title: string, desc: string, defaultCat: string): string {
  const text = (title + " " + desc).toLowerCase();
  if (text.match(/\bact\b|bill|amendment|ordinance|judiciary|supreme court|tribunal|legal|legislation/))
    return "New Laws";
  if (text.match(/scheme|yojana|subsidy|welfare|pm kisan|ayushman|benefit|pradhan mantri|launch|portal/))
    return "Scheme Updates";
  if (text.match(/advisory|alert|warning|public notice|caution|fraud|beware|health|safety|scam/))
    return "Public Advisories";
  return defaultCat;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractText(val: unknown): string {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    const obj = val as Record<string, unknown>;
    if (typeof obj["#text"] === "string") return obj["#text"];
    if (typeof obj["_"] === "string") return obj["_"];
  }
  return "";
}

export async function fetchAndStoreNews(): Promise<number> {
  if (isRefreshing) return 0;
  isRefreshing = true;
  const parser = new XMLParser({
    ignoreAttributes: false,
    htmlEntities: true,
    processEntities: true,
    allowBooleanAttributes: true,
  });
  let totalInserted = 0;

  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        signal: AbortSignal.timeout(12000),
        headers: { "User-Agent": "CitizenHub/1.0 RSS Reader" },
      });
      if (!res.ok) {
        logger.warn({ url: feed.url, status: res.status }, "RSS feed returned non-200");
        continue;
      }
      const xml = await res.text();
      const parsed = parser.parse(xml);

      const rawItems =
        parsed?.rss?.channel?.item ??
        parsed?.feed?.entry ??
        parsed?.["rdf:RDF"]?.item ??
        [];
      const items: unknown[] = Array.isArray(rawItems) ? rawItems : [rawItems];

      for (const raw of items.slice(0, 12)) {
        const item = raw as Record<string, unknown>;
        const title = stripHtml(extractText(item["title"]));
        if (!title || title.length < 5) continue;

        const desc = extractText(item["description"] ?? item["summary"] ?? item["content"]);
        const pubDate = extractText(item["pubDate"] ?? item["published"] ?? item["updated"] ?? "");
        const link = extractText(item["link"] ?? "");

        const publishedAt = pubDate ? new Date(pubDate) : new Date();
        if (Number.isNaN(publishedAt.getTime())) continue;

        const existing = await db
          .select({ id: newsTable.id })
          .from(newsTable)
          .where(eq(newsTable.title, title.slice(0, 255)))
          .limit(1);
        if (existing.length > 0) continue;

        const category = categorize(title, desc, feed.defaultCategory);
        const summary = stripHtml(desc).slice(0, 350) || title;

        await db.insert(newsTable).values({
          title: title.slice(0, 255),
          category,
          summary,
          content: link ? `${stripHtml(desc)}\n\nSource: ${link}` : stripHtml(desc),
          source: feed.source,
          publishedAt,
        });
        totalInserted++;
      }

      logger.info({ url: feed.url, inserted: totalInserted }, "RSS feed processed");
    } catch (err) {
      logger.warn({ err, url: feed.url }, "RSS feed fetch/parse failed");
    }
  }

  lastRefreshedAt = new Date();
  isRefreshing = false;
  logger.info({ totalInserted, lastRefreshedAt }, "News refresh complete");
  return totalInserted;
}

const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;

export function startNewsRefreshScheduler(): void {
  logger.info("Starting news refresh scheduler");
  fetchAndStoreNews().catch((err) => logger.error({ err }, "Initial news fetch failed"));
  setInterval(() => {
    fetchAndStoreNews().catch((err) => logger.error({ err }, "Scheduled news fetch failed"));
  }, REFRESH_INTERVAL_MS);
}
