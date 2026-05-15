import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TPF Admin Dashboard',
    short_name: 'TPF Admin',
    description: 'Admin Portal for The Production Firm',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/tpf-logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/tpf-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
