import { Mountain } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-ink">
      <span className="grid h-9 w-9 place-items-center rounded-[13px] bg-forest text-white shadow-sm"><Mountain size={19} strokeWidth={1.9} /></span>
      <span className="text-lg font-semibold tracking-[-0.045em]">PeakBook</span>
    </div>
  );
}
