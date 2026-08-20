import type { Brand } from "@/lib/types";

function Tile({ brand }: { brand: Brand }) {
  return (
    <>
      {brand.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={brand.logo} alt={brand.name} />
      ) : (
        <div>{brand.name}</div>
      )}
      {brand.location && <span>{brand.location}</span>}
    </>
  );
}

function Card({ brand }: { brand: Brand }) {
  return brand.website ? (
    <a className="logo" href={brand.website} target="_blank" rel="noreferrer">
      <Tile brand={brand} />
    </a>
  ) : (
    <div className="logo">
      <Tile brand={brand} />
    </div>
  );
}

/**
 * Continuously scrolling logo strip. The set is repeated so the track is wider
 * than any viewport, and the animation shifts by exactly one set — at which
 * point the next copy is in the same place, so the loop is seamless.
 */
export default function BrandGrid({ brands }: { brands: Brand[] }) {
  if (!brands.length) {
    return (
      <div className="empty-note">
        No agencies added yet. Add them from the admin panel under Brands.
      </div>
    );
  }

  // Enough tiles that the strip still fills a wide screen with only a few brands.
  const repeats = Math.max(2, Math.ceil(10 / brands.length));

  return (
    <div className="marquee">
      <div
        className="marquee-track"
        style={
          {
            "--sets": repeats,
            // One cycle travels a single set, so the duration scales with the
            // number of brands — not the repeated total — to hold a steady
            // ~55px/sec regardless of how many logos there are.
            "--duration": `${brands.length * 4.8}s`,
          } as React.CSSProperties
        }
      >
        {Array.from({ length: repeats }, (_, set) => (
          <div className="marquee-set" key={set} aria-hidden={set > 0}>
            {brands.map((brand) => (
              <Card key={`${set}-${brand.id}`} brand={brand} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
