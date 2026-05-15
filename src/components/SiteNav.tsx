import Link from "next/link";
import { PenLine, Terminal } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Terminal className="h-4 w-4" />
          </span>
          <span>Puranpal <span className="text-muted-foreground">/ devlog·ai</span></span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <a href="/#posts" className="transition-colors hover:text-foreground">Posts</a>
          <a href="/#projects" className="transition-colors hover:text-foreground">Projects</a>
          <a href="/#categories" className="transition-colors hover:text-foreground">Categories</a>
          <a href="/#newsletter" className="transition-colors hover:text-foreground">Newsletter</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
