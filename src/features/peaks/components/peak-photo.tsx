import { ResponsivePhoto } from "@/components/responsive-photo";

export function PeakPhoto({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return <ResponsivePhoto src={src} fallbackSrc="/peak-aneto.png" alt={alt} sizes={sizes} className={className} priority={priority} />;
}

