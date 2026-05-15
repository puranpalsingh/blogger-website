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

      <article className="mx-auto w-full max-w-4xl px-3 py-6 sm:px-6 sm:py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground sm:mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5 flex-shrink-0" />
          back
        </Link>

        <div className="grid gap-6 lg:gap-12 lg:grid-cols-[1fr_220px]">
          <div className="min-w-0">
            <header className="mb-6 sm:mb-10">
              <span className="mb-2 inline-block font-mono text-xs uppercase tracking-wider text-primary sm:mb-3">
                {post.category}
              </span>

              <h1 className="mb-3 text-xl font-semibold leading-tight tracking-tight sm:mb-4 sm:text-4xl">
                {post.title}
              </h1>

              <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:mb-6 sm:text-base">
                {post.excerpt}
              </p>

              <div className="flex flex-col gap-2.5 font-mono text-xs text-muted-foreground sm:flex-wrap sm:items-center sm:gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  {post.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                  {post.readTime}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((t: string) => (
                    <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {/* MDX renders here instead of hardcoded sections */}
            <div className="prose prose-invert max-w-3xl prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-8 prose-h2:mb-4 sm:prose-h2:mt-10 sm:prose-h2:mb-6 prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-lg sm:prose-h3:text-xl prose-p:text-sm sm:prose-p:text-base prose-p:leading-7 sm:prose-p:leading-8 prose-li:text-sm sm:prose-li:text-base prose-li:leading-6 sm:prose-li:leading-7 prose-ul:my-4 prose-ol:my-4 prose-li:my-2 prose-code:font-mono prose-code:text-xs sm:prose-code:text-sm prose-pre:my-4 sm:prose-pre:my-6 prose-pre:p-3 sm:prose-pre:p-4 prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:text-xs sm:prose-pre:text-sm prose-pre:overflow-x-auto prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground">
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
          <section className="mt-10 border-t border-border/60 pt-8 sm:mt-16 sm:pt-12">
            <h3 className="mb-4 text-base font-semibold tracking-tight sm:mb-6 sm:text-lg">
              Related posts
            </h3>
            <div className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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