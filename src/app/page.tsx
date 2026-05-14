import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PostCard } from "@/components/PostCard";
import { PostSearch } from "@/components/PostSearch";
import { NewsletterForm } from "@/components/NewsletterForm";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { getAllPosts, projects, categories } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts.slice(0, 3); // Get 3 most recent posts

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover opacity-40 dark:opacity-60"
        />
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="animate-fade-up max-w-3xl">
            {/* <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Currently shipping: a tiny inference server in Rust</span>
            </div> */}

            <h1 className="mb-6 text-4xl font-semibold tracking-tight sm:text-6xl">
              Learning AI by{" "}
              <span className="text-gradient">building real projects</span>.
            </h1>

            <p className="mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg">
              I'm an AI/ML learner and builder writing about LLMs, training
              pipelines, and the messy debugging that happens between idea and
              deployment. No fluff — just notes from the terminal.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground glow"
              >
                <a href="#posts">
                  Read the blog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="https://github.com/puranpalsingh" target="_blank">
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">
              // Featured
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Recent writing
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((p, i) => (
            <div
              key={p.slug}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <PostCard post={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Search — client component receives posts as props */}
      <section id="posts" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <PostSearch posts={posts} />
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10">
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">
            // Categories
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Browse by topic
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <a
              key={c.slug}
              href="#posts"
              className="card-hover group rounded-xl border border-border bg-card p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold tracking-tight">{c.name}</h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {c.count}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{c.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10">
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">
            // Projects
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            AI projects I've shipped
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {projects.map((p) => (
            <a
              key={p.title}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight">
                  {p.title}
                </h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="mb-5 flex-1 text-sm text-muted-foreground">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-12">
          <div
            className="absolute inset-0 opacity-50"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="relative max-w-xl">
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">
              // Newsletter
            </p>
            <h2 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              One email. Every other Sunday.
            </h2>
            <p className="mb-6 text-muted-foreground">
              New posts, the bug I broke my brain on, and one paper worth
              reading. No spam, ever.
            </p>
            {/* Newsletter form needs to stay in a client component */}
            <NewsletterForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}