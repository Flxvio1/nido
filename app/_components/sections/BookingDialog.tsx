"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { CONTACT, SERVICE_GROUPS } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

const SERVICES = SERVICE_GROUPS.flatMap((group) =>
  group.items.map((item) => ({ ...item, category: group.category }))
);

// Mo–Sa 10:00–20:00, halbstündliche Slots.
const SLOTS = Array.from({ length: 20 }, (_, i) => {
  const hour = 10 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});
const SLOTS_PREVIEW = 10;

const DAYS_PER_PAGE = 7;
const WEEKS_AHEAD = 4;

type Day = {
  key: string;
  closed: boolean;
  weekday: string;
  dayNr: string;
  monthLabel: string;
  longLabel: string;
};

function buildDays(): Day[] {
  const days: Day[] = [];
  const cursor = new Date();
  for (let i = 0; i < DAYS_PER_PAGE * WEEKS_AHEAD; i++) {
    const weekday =
      i === 0
        ? "Heute"
        : i === 1
          ? "Morgen"
          : cursor.toLocaleDateString("de-CH", { weekday: "short" });
    days.push({
      key: cursor.toISOString().slice(0, 10),
      closed: cursor.getDay() === 0,
      weekday,
      dayNr: cursor.toLocaleDateString("de-CH", { day: "numeric" }),
      monthLabel: cursor.toLocaleDateString("de-CH", {
        month: "long",
        year: "numeric",
      }),
      longLabel: cursor.toLocaleDateString("de-CH", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function PagerArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Frühere Tage" : "Spätere Tage"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
        disabled
          ? "border-paper/10 text-paper/20"
          : "border-paper/20 text-paper/70 hover:border-accent hover:text-accent"
      }`}
    >
      {direction === "prev" ? "←" : "→"}
    </button>
  );
}

export function BookingDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [service, setService] = useState<string | null>(null);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [allSlots, setAllSlots] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const days = useMemo(buildDays, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selectedService = SERVICES.find((s) => s.name === service);
  const selectedDay = days.find((d) => d.key === dayKey);
  const complete = Boolean(selectedService && selectedDay && time);

  const message = complete
    ? `Hallo Nido Coiffeur! Ich möchte gerne einen Termin buchen:\n• ${selectedService!.name} (${selectedService!.price})\n• ${selectedDay!.longLabel}\n• ${time} Uhr\n\nGeht das bei euch? Danke!`
    : "";
  const waHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(message)}`;

  const pageDays = days.slice(
    page * DAYS_PER_PAGE,
    (page + 1) * DAYS_PER_PAGE
  );
  const monthLabel =
    pageDays.length === 0
      ? ""
      : pageDays[0].monthLabel === pageDays[pageDays.length - 1].monthLabel
        ? pageDays[0].monthLabel
        : `${pageDays[0].monthLabel.split(" ")[0]} – ${pageDays[pageDays.length - 1].monthLabel}`;
  const visibleSlots = allSlots ? SLOTS : SLOTS.slice(0, SLOTS_PREVIEW);

  function close() {
    setOpen(false);
  }

  const dialog = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Termin buchen"
            className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-card border border-paper/15 bg-ink shadow-[0_40px_120px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(242,237,228,0.12)]"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="flex items-start justify-between border-b border-paper/10 px-6 py-5 sm:px-8">
              <div>
                <p className="font-display text-[11px] uppercase tracking-[0.25em] text-paper/50">
                  Schritt {step} von 2
                </p>
                <h3 className="mt-1 font-display text-2xl font-light text-paper">
                  {step === 1 ? "Leistung wählen" : "Datum & Zeit wählen"}
                </h3>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Schliessen"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 text-paper/70 transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {step === 1 ? (
                <div className="space-y-2">
                  {SERVICES.map((s) => {
                    const selected = service === s.name;
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => setService(s.name)}
                        aria-pressed={selected}
                        className={`flex w-full items-baseline justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-colors duration-300 ${
                          selected
                            ? "border-accent/70 bg-accent/10"
                            : "border-paper/10 hover:border-paper/30"
                        }`}
                      >
                        <span>
                          <span
                            className={`block font-display text-base ${
                              selected ? "text-accent" : "text-paper"
                            }`}
                          >
                            {s.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-paper/50">
                            {s.description}
                          </span>
                        </span>
                        <span
                          className={`whitespace-nowrap font-display text-sm ${
                            selected ? "text-accent" : "text-paper/60"
                          }`}
                        >
                          {s.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-sm text-paper/70">
                      {monthLabel}
                    </p>
                    <div className="flex gap-2">
                      <PagerArrow
                        direction="prev"
                        disabled={page === 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                      />
                      <PagerArrow
                        direction="next"
                        disabled={page === WEEKS_AHEAD - 1}
                        onClick={() =>
                          setPage((p) => Math.min(WEEKS_AHEAD - 1, p + 1))
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-7 gap-1 border-b border-paper/10 pb-4">
                    {pageDays.map((d) => {
                      const selected = dayKey === d.key;
                      return (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => !d.closed && setDayKey(d.key)}
                          disabled={d.closed}
                          aria-pressed={selected}
                          className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 transition-colors duration-300 ${
                            d.closed
                              ? "cursor-not-allowed text-paper/20"
                              : selected
                                ? "bg-accent/10 text-accent"
                                : "text-paper/70 hover:bg-paper/5 hover:text-paper"
                          }`}
                        >
                          <span className="font-display text-[9px] uppercase tracking-[0.04em] sm:text-[10px] sm:tracking-[0.12em]">
                            {d.weekday}
                          </span>
                          <span className="font-display text-lg">
                            {d.dayNr}
                          </span>
                          <span
                            aria-hidden
                            className={`h-px w-5 ${
                              selected ? "bg-accent" : "bg-transparent"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {visibleSlots.map((slot) => {
                      const selected = time === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          aria-pressed={selected}
                          className={`rounded-full border py-2 font-display text-sm transition-colors duration-300 ${
                            selected
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-paper/10 text-paper/70 hover:border-paper/35 hover:text-paper"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllSlots((v) => !v)}
                    className="mt-4 font-display text-xs uppercase tracking-[0.2em] text-accent/90 transition-colors hover:text-accent"
                  >
                    {allSlots
                      ? "Weniger Zeiten anzeigen"
                      : `Mehr Zeiten anzeigen (${SLOTS.length - SLOTS_PREVIEW} weitere)`}
                  </button>

                  <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/5 px-5 py-4">
                    <p className="font-display text-[10px] uppercase tracking-[0.25em] text-paper/50">
                      Aktuell gewählt
                    </p>
                    <p className="mt-1.5 text-sm text-paper/85">
                      {selectedService?.name}
                      {selectedDay && ` · ${selectedDay.longLabel}`}
                      {time && ` · ${time} Uhr`}
                      {!selectedDay && !time && " — wähle Datum und Zeit"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-paper/10 px-6 py-5 sm:px-8">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-full border border-paper/20 px-6 py-3 font-display text-sm text-paper/80 transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  Zurück
                </button>
              ) : (
                <p className="text-xs text-paper/40">
                  Bestätigung per WhatsApp
                </p>
              )}
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => service && setStep(2)}
                  disabled={!service}
                  className={`rounded-full px-7 py-3 font-display text-sm tracking-wide transition-colors duration-300 ${
                    service
                      ? "bg-paper text-ink hover:bg-accent"
                      : "cursor-not-allowed border border-paper/15 text-paper/40"
                  }`}
                >
                  Weiter
                </button>
              ) : (
                <a
                  href={complete ? waHref : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!complete}
                  className={`rounded-full px-7 py-3 text-center font-display text-sm tracking-wide transition-colors duration-300 ${
                    complete
                      ? "bg-paper text-ink hover:bg-accent"
                      : "cursor-not-allowed border border-paper/15 text-paper/40"
                  }`}
                >
                  Termin per WhatsApp buchen
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-full bg-paper px-8 py-4 font-display text-sm tracking-wide text-ink transition-colors duration-300 hover:bg-accent"
      >
        Termin buchen
      </button>
      {mounted && createPortal(dialog, document.body)}
    </>
  );
}
