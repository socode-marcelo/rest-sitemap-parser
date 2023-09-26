import { Hono } from 'hono'

import { SitemapParser } from "mapsite";

const app = new Hono()

app.get('/', (c) => c.text('To request URLs post the link to the xml as {"sitemap":"https://stackovercode.com/sitemap.xml"}'))

app.post('/echo', async (c) => {
    const body = await c.req.json()
    return c.json(body)
})
app.post('/sitemap', async (c) => {
    const body = await c.req.json()
    const options = {
        rejectInvalidContentType: true,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
        maximumRetries: 3,
        maximumDepth: 5,
        timeout: 5000,
        debug: false,
      };
    const parser = new SitemapParser(options)
    const results = await parser.run(body.sitemap)
    return c.json(results)
})

export default app
