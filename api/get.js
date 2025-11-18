export default async function handler(request, response) {

    const headers = new Headers({
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
    })

    const url = new URL(request.query.url)
    if (!url) {
        return response.json({
            error: 'URL cannot be empty'
        })
    }

    const html = await fetch(url.href, { headers }).then(r => r.text())

    let result = {}

    const hd = html.match('"browser_native_hd_url":"(.*?)"')
    const sd = html.match('"browser_native_sd_url":"(.*?)"')

    if (hd?.length) {
        result = { ...result, hd: JSON.parse(`["${hd[1]}"]`)[0] }
    }

    if (sd?.length) {
        result = { ...result, sd: JSON.parse(`["${sd[1]}"]`)[0] }
    }

    if (!sd?.length && !hd?.length) {
        result = { error: 'Cannot find content' }
    }

    response.setHeader('Access-Control-Allow-Credentials', true)
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Content-Type', 'application/json')
    return response.send(result);
}
