import { Info } from "lucide-react";
import { Reveal } from "@/components/motion";

export default function NameChangeNotice({ className = "" }: { className?: string }) {
  return (
    <Reveal className={className}>
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-olive-200 bg-olive-100/70 px-8 py-7 text-center sm:flex-row sm:text-left">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-olive-600 text-cream-50">
          <Info size={22} />
        </span>
        <p className="text-lg font-medium leading-snug text-olive-800">
          Olive Charity is now{" "}
          <strong className="font-serif text-xl font-bold text-olive-900 sm:text-2xl">
            Turning Olive Charity
          </strong>
          , following our official registration as an NGO.
        </p>
      </div>
    </Reveal>
  );
}
