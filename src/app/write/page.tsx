"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

import {
  ArrowLeft,
  Eye,
  Save,
  Trash2,
  FileText,
  Upload,
  Download,
  Columns2,
  Pencil,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/atom-one-dark.css";

import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

const STORAGE_KEY = "devlog:drafts";

const draftSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(140),

  excerpt: z
    .string()
    .trim()
    .min(10, "Excerpt is too short")
    .max(280),

  category: z.enum([
    "Tutorial",
    "Debugging",
    "Deployment",
    "Experiment",
  ]),

  tags: z.string().trim().max(120).optional(),

  content: z
    .string()
    .trim()
    .min(20, "Content must be at least 20 characters")
    .max(20000),
});

type Draft = z.infer<typeof draftSchema> & {
  id: string;
  updatedAt: number;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function loadDrafts(): Draft[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function WritePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] =
    useState<Draft["category"]>("Tutorial");

  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  const [view, setView] = useState<
    "edit" | "split" | "preview"
  >("edit");

  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    setDrafts(loadDrafts());
  }, []);

  const handleSave = (publish = false) => {
    const parsed = draftSchema.safeParse({
      title,
      excerpt,
      category,
      tags,
      content,
    });

    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ?? "Invalid input"
      );

      return;
    }

    const all = loadDrafts();

    const draft: Draft = {
      id: slugify(title) || crypto.randomUUID(),
      ...parsed.data,
      updatedAt: Date.now(),
    };

    const next = [
      draft,
      ...all.filter((d) => d.id !== draft.id),
    ];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next)
    );

    setDrafts(next);

    toast.success(
      publish ? "Post saved locally" : "Draft saved"
    );

    if (publish) {
      router.push("/");
    }
  };

  const loadDraft = (d: Draft) => {
    setTitle(d.title);
    setExcerpt(d.excerpt);
    setCategory(d.category);
    setTags(d.tags ?? "");
    setContent(d.content);
    setView("edit");
  };

  const deleteDraft = (id: string) => {
    const next = loadDrafts().filter(
      (d) => d.id !== id
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next)
    );

    setDrafts(next);

    toast.success("Draft deleted");
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          back
        </Link>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">
              // New post
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Write something
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Markdown supported. Drafts are saved locally in
              your browser.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              id="md-import"
              type="file"
              accept=".md,.markdown,text/markdown"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                const reader = new FileReader();

                reader.onload = () => {
                  const text = String(
                    reader.result ?? ""
                  );

                  const fm = text.match(
                    /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/
                  );

                  let body = text;

                  if (fm) {
                    body = fm[2];

                    for (const line of fm[1].split("\n")) {
                      const m = line.match(
                        /^(\w+):\s*(.*)$/
                      );

                      if (!m) continue;

                      const v = m[2].replace(
                        /^["']|["']$/g,
                        ""
                      );

                      if (m[1] === "title")
                        setTitle(v);

                      else if (
                        m[1] === "excerpt" ||
                        m[1] === "description"
                      )
                        setExcerpt(v);

                      else if (
                        m[1] === "category" &&
                        [
                          "Tutorial",
                          "Debugging",
                          "Deployment",
                          "Experiment",
                        ].includes(v)
                      )
                        setCategory(
                          v as Draft["category"]
                        );

                      else if (m[1] === "tags")
                        setTags(
                          v.replace(/^\[|\]$/g, "")
                        );
                    }
                  }

                  if (!title) {
                    const h1 = body.match(
                      /^#\s+(.+)$/m
                    );

                    if (h1)
                      setTitle(h1[1].trim());
                  }

                  setContent(body.trimStart());

                  toast.success(
                    `Imported ${file.name}`
                  );
                };

                reader.readAsText(file);

                e.target.value = "";
              }}
            />

            <Button variant="outline" asChild>
              <label
                htmlFor="md-import"
                className="cursor-pointer"
              >
                <Upload className="mr-2 h-4 w-4" />
                Import .md
              </label>
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const fm = `---\ntitle: "${title}"\nexcerpt: "${excerpt}"\ncategory: ${category}\ntags: [${tags}]\n---\n\n`;

                const blob = new Blob(
                  [fm + content],
                  {
                    type: "text/markdown",
                  }
                );

                const url =
                  URL.createObjectURL(blob);

                const a =
                  document.createElement("a");

                a.href = url;

                a.download = `${
                  slugify(title) || "post"
                }.md`;

                a.click();

                URL.revokeObjectURL(url);
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export .md
            </Button>

            <div className="inline-flex rounded-md border border-border bg-card p-0.5">
              <Button
                size="sm"
                variant={view === "edit" ? "secondary" : "ghost"}
                onClick={() => setView("edit")}
                className="h-8 px-2"
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                size="sm"
                variant={view === "split" ? "secondary" : "ghost"}
                onClick={() => setView("split")}
                className="h-8 px-2"
              >
                <Columns2 className="mr-1.5 h-3.5 w-3.5" />
                Split
              </Button>
              <Button
                size="sm"
                variant={view === "preview" ? "secondary" : "ghost"}
                onClick={() => setView("preview")}
                className="h-8 px-2"
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Preview
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => handleSave(false)}
            >
              <Save className="mr-2 h-4 w-4" />
              Save draft
            </Button>

            <Button
              onClick={() => handleSave(true)}
              className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
            >
              Publish
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
          <div className="space-y-4">
            {view !== "preview" && (
              <>
                <Input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Post title"
                  maxLength={140}
                  className="h-12 text-lg font-semibold tracking-tight"
                />

                <Textarea
                  value={excerpt}
                  onChange={(e) =>
                    setExcerpt(e.target.value)
                  }
                  placeholder="Short excerpt — one or two sentences shown on the post card."
                  maxLength={280}
                  rows={2}
                  className="resize-none"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <Select
                    value={category}
                    onValueChange={(v) =>
                      setCategory(v as Draft["category"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tutorial">
                        Tutorial
                      </SelectItem>
                      <SelectItem value="Debugging">
                        Debugging
                      </SelectItem>
                      <SelectItem value="Deployment">
                        Deployment
                      </SelectItem>
                      <SelectItem value="Experiment">
                        Experiment
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    value={tags}
                    onChange={(e) =>
                      setTags(e.target.value)
                    }
                    placeholder="tags, comma, separated"
                    maxLength={120}
                    className="font-mono text-sm"
                  />
                </div>
              </>
            )}

            {view === "edit" && (
              <>
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <span>
                    {(slugify(title) || "untitled") +
                      ".md"}
                  </span>
                  <span>markdown</span>
                </div>

                <Textarea
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
                  }
                  placeholder={
                    "# Heading\n\nWrite your post in **markdown**…\n\n- bullet one\n- bullet two\n\n```python\nprint('hello')\n```"
                  }
                  rows={22}
                  maxLength={20000}
                  className="font-mono text-sm leading-7"
                />

                <p className="text-right font-mono text-xs text-muted-foreground">
                  {content.length} / 20000
                </p>
              </>
            )}

            {view === "split" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span>
                      {(slugify(title) || "untitled") +
                        ".md"}
                    </span>
                    <span>source</span>
                  </div>

                  <Textarea
                    value={content}
                    onChange={(e) =>
                      setContent(e.target.value)
                    }
                    placeholder={
                      "# Heading\n\nWrite markdown here…"
                    }
                    rows={24}
                    maxLength={20000}
                    className="font-mono text-sm leading-7 h-[600px]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    rendered
                  </div>

                  <div className="markdown-body h-[600px] overflow-y-auto rounded-md border border-border bg-card p-5">
                    {content ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                        {content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Start typing markdown to see it
                        rendered here.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {view === "preview" && (
              <article className="rounded-xl border border-border bg-card p-8">
                <span className="mb-3 inline-block font-mono text-xs uppercase tracking-wider text-primary">
                  {category}
                </span>

                <h2 className="mb-3 text-3xl font-semibold tracking-tight">
                  {title || "Untitled"}
                </h2>

                {excerpt && (
                  <p className="mb-6 text-muted-foreground">
                    {excerpt}
                  </p>
                )}

                <div className="markdown-body">
                  {content ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">
                      Nothing to preview yet.
                    </p>
                  )}
                </div>
              </article>
            )}
          </div>

          <aside>
            <div className="sticky top-20 rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                Drafts ({drafts.length})
              </div>

              {drafts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No drafts yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {drafts.map((d) => (
                    <li
                      key={d.id}
                      className="group flex items-start justify-between gap-2 rounded-md p-2 hover:bg-muted"
                    >
                      <button
                        onClick={() => loadDraft(d)}
                        className="flex-1 text-left"
                      >
                        <p className="line-clamp-1 text-sm font-medium">
                          {d.title}
                        </p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {new Date(
                            d.updatedAt
                          ).toLocaleString()}
                        </p>
                      </button>

                      <button
                        onClick={() => deleteDraft(d.id)}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Delete draft"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}