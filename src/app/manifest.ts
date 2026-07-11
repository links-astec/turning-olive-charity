import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Turning Olive Charity",
    short_name: "Olive Charity",
    description: "Newsletter admin for Turning Olive Charity.",
    start_url: "/admin/newsletter",
    scope: "/admin/",
    display: "standalone",
    background_color: "#faf7f0",
    theme_color: "#363b25",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
