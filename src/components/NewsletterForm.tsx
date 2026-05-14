"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        alert(`Subscribed: ${fd.get("email")}`);
        e.currentTarget.reset();
      }}
      className="flex flex-col gap-2 sm:flex-row"
    >
      <Input
        name="email"
        type="email"
        required
        placeholder="you@domain.dev"
        className="font-mono"
      />
      <Button
        type="submit"
        className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
      >
        Subscribe
      </Button>
    </form>
  );
}