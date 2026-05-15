import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
};

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(".mdx", "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        category: data.category,
        date: data.date,
        readTime: data.readTime,
        tags: data.tags ?? [],
      } as Post;
    })
    .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
}

export function getPostBySlug(slug: string): Post & { content: string } {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    date: data.date,
    readTime: data.readTime,
    tags: data.tags ?? [],
    content,
  };
}

// keep these as-is, they don't need filesystem
export const projects = [
  {
    title: "Citation Intent Classifier",
    description: "Fine-tuned SciBERT with Focal Loss and ensemble learning to classify citation intents in academic papers. Deployed as a FastAPI microservice with per-class threshold inference.",
    tech: ["SciBERT", "PyTorch", "FastAPI", "FAISS"],
    link: "https://github.com/puranpalsingh/Citation_Intent",
  },
  {
    title: "Git Summarizer",
    description: "Paste any GitHub repo URL and get an instant LLM-generated summary of the entire codebase — plus individual file-level breakdowns. Built with TypeScript and the GitHub API.",
    tech: ["LLMs", "GitHub API", "TypeScript"],
    link: "https://github.com/Devansh-rookie/git_summariser",
  },
];

export function getCategories() {
  const posts = getAllPosts();
  const categoryMap: Record<string, number> = {
    tutorial: 0,
    debugging: 0,
    deployment: 0,
    experiment: 0,
  };

  posts.forEach((post) => {
    const key = post.category.toLowerCase();
    if (key.includes("tutorial")) categoryMap.tutorial++;
    else if (key.includes("debugging")) categoryMap.debugging++;
    else if (key.includes("deployment")) categoryMap.deployment++;
    else if (key.includes("experiment")) categoryMap.experiment++;
  });

  return [
    { name: "Tutorials", slug: "tutorials", count: categoryMap.tutorial, description: "Step-by-step builds of real AI systems, from dataset to deployment." },
    { name: "Debugging Fixes", slug: "debugging", count: categoryMap.debugging, description: "Errors I hit, why they happened, and exactly how I fixed them." },
    { name: "Deployment Guides", slug: "deployment", count: categoryMap.deployment, description: "Getting models out of notebooks and into production." },
    { name: "AI Experiments", slug: "experiments", count: categoryMap.experiment, description: "Half-broken ideas that taught me something useful." },
  ];
}

// For backward compatibility
export const categories = getCategories();