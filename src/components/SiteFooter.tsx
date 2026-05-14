import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} devlog/ai — built while learning.
        </p>
        <div className="flex items-center gap-2">
          {[
            { Icon: FaGithub, href: "https://github.com/puranpalsingh", label: "GitHub" },
            { Icon: FaLinkedin, href: "https://www.linkedin.com/in/puranpal-singh-7b3115290/", label: "LinkedIn" },
            { Icon: FaXTwitter, href: "https://x.com/SinghS14703", label: "Twitter" },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
