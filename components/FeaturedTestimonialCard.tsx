"use client";

import { useState, useEffect } from "react";
import { resolveVideo } from "@/lib/video";
import type { Testimonial } from "@/lib/types";

interface FeaturedTestimonialCardProps {
  items?: Testimonial[];
  item?: Testimonial | null;
}

export default function FeaturedTestimonialCard({
  items,
  item,
}: FeaturedTestimonialCardProps) {
  // Normalize items array
  const activeItems: Testimonial[] =
    items && items.length > 0 ? items : item ? [item] : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Safety clamp if activeItems length changes
  useEffect(() => {
    if (currentIndex >= activeItems.length && activeItems.length > 0) {
      setCurrentIndex(0);
      setPlaying(false);
    }
  }, [activeItems.length, currentIndex]);

  const currentItem = activeItems[currentIndex] || null;
  const video = currentItem?.videoUrl ? resolveVideo(currentItem.videoUrl) : null;
  const authorName = currentItem?.author || "Founder Name";
  const label = `Play video testimonial from ${authorName}`;

  // Detect orientation (portrait if explicitly specified or if YouTube Shorts)
  const isPortrait =
    currentItem?.orientation === "portrait" ||
    Boolean(currentItem?.videoUrl?.includes("/shorts/"));

  const defaultQuote =
    "Add your strongest founder testimonial here — focused on lead quality, campaign experience and what improved.";
  const quoteText = currentItem?.quote?.trim() || defaultQuote;

  const agencyMeta = [
    currentItem?.company || "Travel Agency",
    currentItem?.location || "Location",
  ]
    .filter(Boolean)
    .join(" · ");

  const hasMultiple = activeItems.length > 1;

  const handlePrev = () => {
    if (!hasMultiple) return;
    setPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? activeItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!hasMultiple) return;
    setPlaying(false);
    setCurrentIndex((prev) => (prev === activeItems.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStart(null);
  };

  return (
    <div
      className={`proof-card ${isPortrait ? "portrait" : "landscape"}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={hasMultiple ? 0 : undefined}
      onKeyDown={(e) => {
        if (!hasMultiple) return;
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }}
    >
      <div
        className={`proof-video-wrapper ${isPortrait ? "portrait" : "landscape"}`}
      >
        {playing && video?.kind === "embed" ? (
          <iframe
            className="proof-video-player"
            src={video.src}
            title={`Video testimonial from ${authorName}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : playing && video?.kind === "file" ? (
          <video
            className="proof-video-player"
            src={video.src}
            controls
            autoPlay
            playsInline
          />
        ) : video?.kind === "link" ? (
          <a
            className="proof-video-poster-btn"
            href={video.src}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
          >
            {currentItem?.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentItem.avatar}
                alt={authorName}
                className="proof-video-poster-img"
              />
            )}
            <div className="proof-play-circle" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#111111">
                <path d="M8 5V19L19 12L8 5Z" />
              </svg>
            </div>
          </a>
        ) : (
          <button
            type="button"
            className="proof-video-poster-btn"
            onClick={() => {
              if (video) setPlaying(true);
            }}
            aria-label={label}
          >
            {currentItem?.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentItem.avatar}
                alt={authorName}
                className="proof-video-poster-img"
              />
            )}
            <div className="proof-play-circle" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#111111">
                <path d="M8 5V19L19 12L8 5Z" />
              </svg>
            </div>
          </button>
        )}
      </div>

      <div className="proof-content">
        <div className="proof-content-header">
          <div className="proof-card-kicker">
            <span>VIDEO TESTIMONIAL</span>
            <div className="proof-kicker-flourish" aria-hidden="true">
              <svg width="56" height="8" viewBox="0 0 56 8" fill="none">
                <path
                  d="M2 5C16 2 36 2 54 6"
                  stroke="#facc15"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {hasMultiple && (
            <div className="proof-nav-controls" aria-label="Testimonial controls">
              <button
                type="button"
                className="proof-nav-btn"
                onClick={handlePrev}
                aria-label="Previous testimonial"
                title="Previous testimonial"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <span className="proof-nav-counter">
                {currentIndex + 1} / {activeItems.length}
              </span>

              <button
                type="button"
                className="proof-nav-btn"
                onClick={handleNext}
                aria-label="Next testimonial"
                title="Next testimonial"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <blockquote className="proof-card-quote">
          &ldquo;{quoteText}&rdquo;
        </blockquote>

        <div className="proof-card-footer">
          <div className="proof-card-author">
            <strong>{authorName}</strong>
            <span>{agencyMeta}</span>
          </div>

          {hasMultiple && (
            <div className="proof-dots" aria-label="Slide indicators">
              {activeItems.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`proof-dot ${idx === currentIndex ? "active" : ""}`}
                  onClick={() => {
                    setPlaying(false);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
