import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PostCard } from "@/components/PostCard";
import { ReadingProgress } from "@/components/ReadingProgress";

import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

import { getAllPosts, getPostBySlug } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

// Tells Next.js which slugs exist at build time
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  try {
    const post = getPostBySlug(slug);
    return {
      title: `${post.title} — devlog/ai`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
      },
    };
  } catch {
    return { title: "Post not found" };
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const allPosts = getAllPosts();
  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  // Auto-generate TOC from MDX headings
  const headings = [...post.content.matchAll(/^#{2}\s+(.+)$/gm)].map((m) => ({
    label: m[1],
    id: m[1]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
  }));

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <SiteNav />

      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          back
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1fr_220px]">
          <div>
            <header className="mb-10">
              <span className="mb-3 inline-block font-mono text-xs uppercase tracking-wider text-primary">
                {post.category}
              </span>

              <h1 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {post.title}
              </h1>

              <p className="mb-6 text-lg text-muted-foreground">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime}
                </span>
                <div className="flex gap-1.5">
                  {post.tags.map((t: string) => (
                    <span key={t} className="rounded-md bg-muted px-2 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {/* MDX renders here instead of hardcoded sections */}
            <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-code:font-mono prose-pre:bg-card prose-pre:border prose-pre:border-border">
              <MDXRemote
                source={post.content}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug, rehypeHighlight],
                  },
                }}
              />
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                On this page
              </p>
              <ul className="space-y-2 text-sm">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {h.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-border/60 pt-12">
            <h3 className="mb-6 text-xl font-semibold tracking-tight">
              Related posts
            </h3>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </article>

      <SiteFooter />
    </div>
  );
}