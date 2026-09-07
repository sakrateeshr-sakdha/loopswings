"use client";

import { useState } from "react";
import { resolveVideo } from "@/lib/video";
import type { Testimonial } from "@/lib/types";

/** Click-to-play: nothing third-party loads until the visitor asks for it. */
export default function VideoTestimonial({ item }: { item: Testimonial }) {
  const [playing, setPlaying] = useState(false);
  const video = resolveVideo(item.videoUrl);
  const label = `Play video testimonial from ${item.author}`;
  const frameClass = item.orientation === "portrait" ? "frame portrait" : "frame";

  const poster = item.avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.avatar} alt="" />
  ) : null;

  let frame;
  if (!video) {
    frame = (
      <div className={frameClass} aria-hidden="true">
        {poster}
        <div className="play" />
      </div>
    );
  } else if (playing && video.kind === "embed") {
    frame = (
      <div className={frameClass}>
        <iframe
          src={video.src}
          title={`Video testimonial from ${item.author}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  } else if (playing && video.kind === "file") {
    frame = (
      <div className={frameClass}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video src={video.src} controls autoPlay playsInline />
      </div>
    );
  } else if (video.kind === "link") {
    frame = (
      <a className={frameClass} href={video.src} target="_blank" rel="noreferrer" aria-label={label}>
        {poster}
        <span className="play" />
      </a>
    );
  } else {
    frame = (
      <button type="button" className={frameClass} onClick={() => setPlaying(true)} aria-label={label}>
        {poster}
        <span className="play" />
      </button>
    );
  }

  const isPortrait = item.orientation === "portrait";

  return (
    <div className={`video ${isPortrait ? "video-portrait" : ""}`}>
      {frame}
      <div className="vmeta">
        <strong>{item.author}</strong>
        <span>
          {[item.company, item.location].filter(Boolean).join(" · ")}
        </span>
      </div>
    </div>
  );
}
