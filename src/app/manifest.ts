import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tilak Popat Films',
    short_name: 'TPF',
    description: 'Premier film production house in India creating cinematic films, music videos, and visual media.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/tpf-logo-new.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/tpf-logo-new.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
