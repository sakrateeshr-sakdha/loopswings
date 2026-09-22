import type { Brand } from "@/lib/types";

interface ProofBrandsMarqueeProps {
  brands: Brand[];
}

export default function ProofBrandsMarquee({ brands }: ProofBrandsMarqueeProps) {
  if (!brands || brands.length === 0) {
    return (
      <div className="proof-brands-marquee" aria-label="Partner agency logos">
        <div className="proof-brands-track static">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div className="proof-brand-card" key={`placeholder-${idx}`}>
              <span className="proof-brand-placeholder">AGENCY LOGO</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Ensure enough repeats so the marquee is wider than any viewport for seamless infinite loop
  const repeats = Math.max(3, Math.ceil(12 / brands.length));

  return (
    <div className="proof-brands-marquee" aria-label="Partner travel agencies">
      <div
        className="proof-brands-track"
        style={
          {
            "--sets": repeats,
            "--duration": `${Math.max(18, brands.length * 4.5)}s`,
          } as React.CSSProperties
        }
      >
        {Array.from({ length: repeats }, (_, setIndex) => (
          <div className="proof-brands-set" key={setIndex} aria-hidden={setIndex > 0}>
            {brands.map((brand) => {
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

              return brand.website ? (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noreferrer"
                  className="proof-brand-card"
                  key={`${setIndex}-${brand.id}`}
                  title={brand.name}
                >
                  {cardContent}
                </a>
              ) : (
                <div
                  className="proof-brand-card"
                  key={`${setIndex}-${brand.id}`}
                  title={brand.name}
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
