import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Mahjong Master System',
        short_name: 'Master System',
        description: 'System for keeping track of mahjong scores',
        start_url: '/',
        display: 'standalone',
        background_color: '#fff',
        theme_color: '#943030',
        icons: [
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    }
}