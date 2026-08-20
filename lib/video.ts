/** Turns a pasted YouTube/Vimeo/file URL into something we can embed. */
export type VideoSource =
  | { kind: "embed"; src: string }
  | { kind: "file"; src: string }
  | { kind: "link"; src: string };

export function resolveVideo(url: string): VideoSource | null {
  if (!url) return null;

  const youtube =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/i.exec(url);
  if (youtube) {
    return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1` };
  }

  const vimeo = /vimeo\.com\/(?:video\/)?(\d+)/i.exec(url);
  if (vimeo) {
    return { kind: "embed", src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` };
  }

  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) {
    return { kind: "file", src: url };
  }

  return { kind: "link", src: url };
}
