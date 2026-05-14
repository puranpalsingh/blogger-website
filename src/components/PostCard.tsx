import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { type Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card-hover group block rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-primary">{post.category}</span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold leading-snug tracking-tight">
        {post.title}
      </h3>
      <p className="mb-5 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex gap-1.5">
          {post.tags.slice(0, 2).map((t : any) => (
            <span key={t} className="rounded-md bg-muted px-2 py-0.5 font-mono">{t}</span>
          ))}
        </div>
        <span className="font-mono">{post.readTime}</span>
      </div>
    </Link>
  );
}
