import { Mountain } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-ink">
      <span className="grid h-9 w-9 place-items-center rounded-2xl bg-forest text-lime"><Mountain size={20} strokeWidth={2.4} /></span>
      <span className="text-xl font-semibold tracking-[-0.04em]">PeakBook</span>
    </div>
  );
}
