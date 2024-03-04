export default function manifest() {
    console.log('manifest')
    return {
        name: 'Diogo Crava | Portfolio',
        short_name: 'Diogo Crava',
        description: '',
        start_url: '/',
        display: 'standalone',
        orientation: 'landscape',
        background_color: '#fff',
        theme_color: '#fff',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}