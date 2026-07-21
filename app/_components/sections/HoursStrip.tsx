import { CONTACT } from "@/lib/content";
import { Reveal } from "../ui/Reveal";

function Time({ time }: { time: string }) {
  if (!time.endsWith(" Uhr")) {
    return (
      <p className="font-display text-2xl font-light text-paper/40">{time}</p>
    );
  }
  return (
    <p className="font-display text-2xl font-light text-paper">
      {time.slice(0, -4)} <span className="text-accent">Uhr</span>
    </p>
  );
}

export function HoursStrip() {
  return (
    <section aria-label="Öffnungszeiten" className="border-b border-paper/10">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <div className="grid divide-y divide-paper/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {CONTACT.hours.map((h) => (
              <div
                key={h.days}
                className="flex flex-col items-center gap-3 py-10 text-center"
              >
                <p className="font-display text-[11px] uppercase tracking-[0.3em] text-paper/50">
                  {h.days}
                </p>
                <Time time={h.time} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
