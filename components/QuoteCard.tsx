import type { Testimonial } from "@/lib/types";

export default function QuoteCard({ item }: { item: Testimonial }) {
  const line = [item.role, item.company].filter(Boolean).join(" — ");
  return (
    <article className="quote">
      <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
      <div className="meta">
        {item.avatar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.avatar} alt="" />
        )}
        <div>
          <strong>{item.author}</strong>
          <span>{[line, item.location].filter(Boolean).join(" · ")}</span>
        </div>
      </div>
    </article>
  );
}
