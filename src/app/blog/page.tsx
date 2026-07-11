import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { PhotoPanel } from "@/components/decor";
import { RevealGroup, RevealItem } from "@/components/motion";
import { blogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Stories | Turning Olive Charity",
  description: "News and stories from the field, from Turning Olive Charity.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Stories"
        title="News from the field"
        description="Updates on our programs, the people we work with, and how your support is making a difference."
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <RevealGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <RevealItem key={post.slug}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-olive-200/70 bg-cream-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-olive-900/10">
                <PhotoPanel
                  src={post.image}
                  alt={post.title}
                  className="relative aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="flex flex-1 flex-col p-7">
                  <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-600">
                    {post.category}
                  </span>
                  <h2 className="mt-3 font-serif text-lg font-medium leading-snug text-olive-950">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-olive-700">
                    {post.excerpt}
                  </p>
                  <time className="mt-5 text-xs text-olive-500">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
