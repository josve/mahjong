import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Mahjong Master System',
        short_name: 'Master System',
        description: 'System for keeping track of mahjong scores',
        start_url: '/',
        display: 'standalone',
        orientation: 'landscape',
        background_color: '#fff',
        theme_color: '#753e27',
        icons: [
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    }
}
