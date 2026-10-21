"use client";

import { useEffect, useRef, useState } from "react";
import type { Brand } from "@/lib/types";

interface ProofBrandsMarqueeProps {
  brands: Brand[];
}

function BrandCard({ brand, setIndex }: { brand: Brand; setIndex?: number }) {
  const cardContent = brand.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={brand.logo}
      alt={brand.name}
      className="proof-brand-img"
      loading="lazy"
    />
  ) : (
    <span className="proof-brand-name">{brand.name}</span>
  );

  const key = setIndex !== undefined ? `${setIndex}-${brand.id}` : `static-${brand.id}`;

  return brand.website ? (
    <a
      href={brand.website}
      target="_blank"
      rel="noreferrer"
      className="proof-brand-card"
      key={key}
      title={brand.name}
    >
      {cardContent}
    </a>
  ) : (
    <div
      className="proof-brand-card"
      key={key}
      title={brand.name}
    >
      {cardContent}
    </div>
  );
}

export default function ProofBrandsMarquee({ brands }: ProofBrandsMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState<boolean>(false);

  useEffect(() => {
    const checkOverflow = () => {
      const container = containerRef.current;
      const singleSet = singleSetRef.current;
      if (!container || !singleSet) return;

      const containerWidth = container.clientWidth;
      // In marquee mode, singleSet has paddingRight equal to the gap.
      // Subtracting paddingRight normalizes contentWidth between static and scrolling states.
      const style = window.getComputedStyle(singleSet);
      const paddingRight = parseFloat(style.paddingRight) || 0;
      const contentWidth = singleSet.scrollWidth - paddingRight;

      // Small 4px buffer to avoid fractional subpixel oscillation
      setShouldScroll(contentWidth > containerWidth + 4);
    };

    checkOverflow();

    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      checkOverflow();
    });

    ro.observe(container);

    return () => ro.disconnect();
  }, [brands]);

  if (!brands || brands.length === 0) {
    return (
      <div className="proof-brands-marquee static" aria-label="Partner agency logos">
        <div className="proof-brands-track static">
          <div className="proof-brands-set static">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div className="proof-brand-card" key={`placeholder-${idx}`}>
                <span className="proof-brand-placeholder">AGENCY LOGO</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If not overflowing view width, render a single static set centered without scrolling
  if (!shouldScroll) {
    return (
      <div
        ref={containerRef}
        className="proof-brands-marquee static"
        aria-label="Partner travel agencies"
      >
        <div className="proof-brands-track static">
          <div className="proof-brands-set static" ref={singleSetRef}>
            {brands.map((brand) => (
              <BrandCard brand={brand} key={brand.id} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // When overflowing, repeat enough sets for an infinite marquee loop
  const repeats = Math.max(3, Math.ceil(24 / brands.length));

  return (
    <div
      ref={containerRef}
      className="proof-brands-marquee"
      aria-label="Partner travel agencies"
    >
      <div
        className="proof-brands-track"
        style={
          {
            "--sets": repeats,
            "--duration": `${Math.max(16, brands.length * 4.5)}s`,
          } as React.CSSProperties
        }
      >
        {Array.from({ length: repeats }, (_, setIndex) => (
          <div
            className="proof-brands-set"
            key={setIndex}
            ref={setIndex === 0 ? singleSetRef : undefined}
            aria-hidden={setIndex > 0}
          >
            {brands.map((brand) => (
              <BrandCard brand={brand} setIndex={setIndex} key={`${setIndex}-${brand.id}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
