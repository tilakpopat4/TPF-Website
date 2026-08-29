/**
 * Generates an animated shimmer SVG data URL for Next.js Image blur placeholder
 */
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#181818" offset="20%" />
      <stop stop-color="#2c2c2c" offset="50%" />
      <stop stop-color="#181818" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#181818" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export const shimmerBlurDataUrl = `data:image/svg+xml;base64,${toBase64(shimmer(400, 500))}`;
export const posterBlurDataUrl = `data:image/svg+xml;base64,${toBase64(shimmer(600, 900))}`;
export const widescreenBlurDataUrl = `data:image/svg+xml;base64,${toBase64(shimmer(800, 450))}`;
