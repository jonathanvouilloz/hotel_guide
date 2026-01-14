import type { APIRoute } from 'astro';
import { getSettings } from '../lib/content';

function getMimeType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'image/png';
  }
}

export const GET: APIRoute = async () => {
  const settings = await getSettings();

  const icon192 = settings.pwaIcon192 || "/images/icon-192.png";
  const icon512 = settings.pwaIcon512 || "/images/icon-512.png";

  const manifest = {
    name: settings.hostelName,
    short_name: settings.hostelName.split(' ')[0],
    description: "Your digital guide to the hostel",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: `#${settings.primaryColor || '008080'}`,
    icons: [
      {
        src: icon192,
        sizes: "192x192",
        type: getMimeType(icon192),
        purpose: "any maskable"
      },
      {
        src: icon512,
        sizes: "512x512",
        type: getMimeType(icon512),
        purpose: "any maskable"
      }
    ]
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json' }
  });
};
