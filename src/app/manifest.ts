import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Mahjong Master System',
        short_name: 'Master System',
        description: 'System for keeping track of mahjong scores',
        start_url: '/',
        orientation: 'landscape',
        display: 'standalone',
        background_color: '#fff',
        theme_color: 'rgb(229,70,70)',
        icons: [
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    }
}