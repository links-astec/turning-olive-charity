import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion";
import GalleryGrid from "@/components/GalleryGrid";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import { galleryImages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery | Turning Olive Charity",
  description: "Photos from Turning Olive Charity's programs and community events.",
};

const SHOWCASE_COUNT = 9;

export default function GalleryPage() {
  const step = Math.floor(galleryImages.length / SHOWCASE_COUNT);
  const showcaseItems = Array.from({ length: SHOWCASE_COUNT }, (_, i) => {
    const originalIndex = i * step;
    return { image: galleryImages[originalIndex], originalIndex };
  });

  return (
    <>
      <FeaturedShowcase
        items={showcaseItems}
        allImages={galleryImages}
        eyebrow="Gallery"
        title="Moments from the work"
        description={`${galleryImages.length} photos from our distribution days, workshops, and the community that makes it all possible.`}
        scrollTargetId="gallery-grid"
      />

      <section id="gallery-grid" className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <SectionHeading eyebrow="Full Gallery" title="Browse every photo" align="center" />
        </Reveal>
        <div className="mt-14">
          <GalleryGrid images={galleryImages} />
        </div>
      </section>
    </>
  );
}
