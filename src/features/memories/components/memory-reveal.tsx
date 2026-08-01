import { ScrollReveal } from "@/components/scroll-reveal";

export function MemoryReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return <ScrollReveal className={className} delay={delay}>{children}</ScrollReveal>;
}

