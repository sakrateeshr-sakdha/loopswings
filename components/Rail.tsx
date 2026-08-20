"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";

/**
 * Horizontal carousel used when a row holds more cards than fit. Scrolls by
 * swipe, trackpad, drag or the arrow buttons; the buttons disable at each end.
 */
export default function Rail({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    // Card widths change as images finish loading.
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      observer.disconnect();
    };
  }, [sync]);

  const step = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const origin = el.getBoundingClientRect().left - el.scrollLeft;
    // Card offsets rather than a fixed stride: portrait and landscape cards are
    // different widths, so any single step distance would drift out of sync.
    const offsets = [...el.children].map((c) => c.getBoundingClientRect().left - origin);
    const current = el.scrollLeft;
    const target =
      direction === 1
        ? offsets.find((o) => o > current + 1)
        : [...offsets].reverse().find((o) => o < current - 1);

    // Assigning scrollLeft rather than scrollBy({behavior:"smooth"}): the
    // animated form is silently ignored inside a scroll-snap container in some
    // engines.
    el.scrollLeft = Math.max(0, Math.min(max, target ?? (direction === 1 ? max : 0)));
    // Update the buttons from the new position rather than waiting for the
    // scroll event, so their enabled state is never a frame behind the click.
    sync();
  };

  return (
    <div className="rail-wrap">
      <div className="rail" ref={ref}>
        {Children.map(children, (child, i) => (
          // Each card sits in a full-column cell. The cell carries the snap
          // point, so a narrower card centred inside it still snaps flush to
          // the column edge instead of dragging the carousel off-origin.
          <div className="rail-cell" key={i}>
            {child}
          </div>
        ))}
      </div>
      {!(atStart && atEnd) && (
        <div className="rail-nav">
          <button
            type="button"
            className="rail-btn"
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label={`Previous ${label}`}
          >
            &larr;
          </button>
          <span className="rail-note">Swipe or use the arrows</span>
          <button
            type="button"
            className="rail-btn"
            onClick={() => step(1)}
            disabled={atEnd}
            aria-label={`Next ${label}`}
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
