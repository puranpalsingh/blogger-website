"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { type Post } from "@/lib/posts";

export function PostSearch({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query, posts]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">
            // All posts
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Search the archive
          </h2>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, tags, topics…"
            className="pl-9 font-mono text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No posts match "{query}".
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </>
  );
}