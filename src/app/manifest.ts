import type { MetadataRoute } from 'next'
import { getTranslations } from 'next-intl/server'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const t = await getTranslations('app')
    return {
        name: t('manifestName'),
        short_name: t('manifestShortName'),
        description: t('manifestDescription'),
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
