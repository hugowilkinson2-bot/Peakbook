"use client";

import Image, { type ImageLoader } from "next/image";
import { useEffect, useState } from "react";

const passthroughLoader: ImageLoader = ({ src }) => src;

export function ResponsivePhoto({
  src,
  fallbackSrc,
  alt,
  sizes,
  className = "",
  priority = false,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const [resolvedSrc, setResolvedSrc] = useState(src);
  const isExternal = /^https?:\/\//.test(resolvedSrc);

  useEffect(() => { setResolvedSrc(src); }, [src]);

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      loader={isExternal ? passthroughLoader : undefined}
      unoptimized={isExternal}
      onError={() => { if (resolvedSrc !== fallbackSrc) setResolvedSrc(fallbackSrc); }}
    />
  );
}

