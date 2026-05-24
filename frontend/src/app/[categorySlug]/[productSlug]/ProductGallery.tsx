"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { getStrapiUrl } from "@/lib/auth";

interface GalleryImage {
  url?: string;
  alternativeText?: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productTitle: string;
}

function toAbsoluteUrl(url?: string) {
  if (!url) {
    return "";
  }

  if (url.startsWith("http")) {
    return url;
  }

  return `${getStrapiUrl()}${url}`;
}

export default function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const validImages = useMemo(() => images.map((image) => ({
    ...image,
    url: toAbsoluteUrl(image.url),
  })).filter((image) => Boolean(image.url)), [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const active = validImages[activeIndex];

  if (!active) {
    return (
      <div className="panel-surface overflow-hidden p-4 md:p-6">
        <div className="flex aspect-[4/5] items-center justify-center border border-zinc-800 bg-[radial-gradient(circle_at_30%_20%,#272732_0%,#0b0b10_65%)] text-7xl text-zinc-500 md:text-8xl">
          {productTitle.slice(0, 1).toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <div className="panel-surface overflow-hidden p-4 md:p-6">
      <button
        type="button"
        onClick={() => setZoomed((current) => !current)}
        className="group relative block w-full overflow-hidden border border-zinc-800 bg-black"
      >
        <div className="relative aspect-[4/5]">
          <Image
            src={active.url || ""}
            alt={active.alternativeText || productTitle}
            fill
            className={`object-cover transition duration-300 ${zoomed ? "scale-125" : "scale-100"}`}
            sizes="(max-width: 768px) 100vw, 55vw"
            unoptimized
            priority
          />
        </div>

        <span className="absolute bottom-3 right-3 rounded-full border border-zinc-600 bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-white">
          {zoomed ? "Zoom out" : "Zoom in"}
        </span>
      </button>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {validImages.map((image, index) => (
          <button
            type="button"
            key={image.url}
            onClick={() => {
              setActiveIndex(index);
              setZoomed(false);
            }}
            className={`relative aspect-square overflow-hidden border ${
              index === activeIndex ? "border-[#5e000e]" : "border-zinc-800"
            }`}
          >
            <Image
              src={image.url || ""}
              alt={image.alternativeText || `${productTitle} ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
              sizes="120px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
