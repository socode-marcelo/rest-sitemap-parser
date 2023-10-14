import { Hono } from 'hono'

import { SitemapParser } from "mapsite";

const app = new Hono()

/**
 * GET / - Returns a text response with instructions on how to request URLs.
 */
app.get('/', (c) => c.text('To request URLs, post the link to the XML as {"sitemap":"https://stackovercode.com/sitemap.xml"}'))

/**
 * POST /echo - Echoes back the JSON data sent in the request body.
 */
app.post('/echo', async (c) => {
    const body = await c.req.json()
    return c.json(body)
})

/**
 * POST /sitemap - Downloads and returns a sitemap based on the URL provided in the request body.
 */
app.post('/sitemap', async (c) => {
    const body = await c.req.json()
    const results = await sitemapDownloader(body.sitemap ?? '')
    return c.json(results)
})

/**
 * POST /domain - Downloads and returns a sitemap based on the domain provided in the request body.
 */
app.post('/domain', async (c) => {
    const body = await c.req.json()
    const sitemap = await getSitemapURLFromDomain(body?.domain)
    const results = await sitemapDownloader(sitemap ?? '')
    return c.json(results)
})

export default app

/**
 * isValidDomain(domain)
 * Checks if a given domain name is valid according to RFC 952 and RFC 1123.
 * @param {string} domain - Domain name to validate.
 * @returns {boolean} true if the domain name is valid, false otherwise.
 */
function isValidDomain(domain) {
    // Check if the input is a string
    if (typeof domain !== 'string') return false;

    // Check if the input is a valid domain name
    const regex = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return regex.test(domain);
}

/**
 * getSitemapURLFromDomain(domain)
 * Gets the sitemap URL for a given domain name by fetching the robots.txt file and parsing it.
 * @param {string} domain - Domain name to get the sitemap URL for.
 * @returns {Promise<string>} A promise that resolves with the sitemap URL if found, or rejects with an error message otherwise.
 */
async function getSitemapURLFromDomain(domain) {
    try {
        // Check if the input is a valid domain name
        if (!isValidDomain(domain)) throw new Error(`Failed to validate ${domain}`);
        //Define list of common sitemap locations
        const sitemapLocations = [
            `https://${domain}/sitemap.xml`,
            `https://${domain}/sitemap.txt`,
            `https://${domain}/sitemap_index.xml`,
            `https://${domain}/sitemap/`,
            `https://${domain}/sitemap-index.xml`,
            `https://${domain}/sitemaps/`,
            `https://${domain}/sitemap-indexes/`,
            `https://${domain}/post-sitemap.xml`,
            `https://${domain}/page-sitemap.xml`,
            `https://${domain}/category-sitemap.xml `,
            `https://${domain}/tag-sitemap.xml `,
            `https://${domain}/pages-sitemap.xml`,
            `https://${domain}/blog-pages-sitemap.xml`,
            `https://${domain}/member-profile-sitemap.xml`,
            `https://${domain}/dynamic-pages-sitemap.xml`,
            `https://${domain}/other-pages-sitemap.xml`,
            `https://${domain}/sitemap.xml.gz`,
            `https://${domain}/sitemap1.xml`,
            `https://${domain}/sitemapindex.xml`,
            `https://${domain}/sitemap_index.xml.gz`,
            `https://${domain}/sitemap/index.xml`,
        ];
        for (const location of sitemapLocations) {
            const response = await fetch(location);
            if (response.ok) return location;
        }
        // Fetch the robots.txt file and parse it for the sitemap URL
        const url = `https://${domain}/robots.txt`;
        const response = await fetch(url);
        if (response.ok) {
            return parseSitemapFromRobotsTxt(await response.text());
        } else {
            throw new Error(`Failed to fetch robots.txt from ${domain}`);
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * parseSitemapFromRobotsTxt(robotsTxt)
 * Parses the sitemap URL from a robots.txt file.
 * @param {string} robotsTxt - The contents of the robots.txt file to parse.
 * @returns {string} The sitemap URL if found, or an empty string otherwise.
 */
function parseSitemapFromRobotsTxt(robotsTxt) {
    const sitemapMatch = /^Sitemap: (\S+)$/m.exec(robotsTxt);
    return sitemapMatch ? sitemapMatch[1] : '';
}

/**
 * sitemapDownloader(sitemap)
 * Downloads the sitemap and parses it using a SitemapParser instance.
 * @param {string} sitemap - The URL of the sitemap to download.
 * @returns {Promise<SitemapParser>} A promise that resolves with the parsed sitemap or rejects with an error message otherwise.
 */
async function sitemapDownloader(sitemap) {
    // Check if the input is a valid URL
    if (typeof sitemap !== "string" || !sitemap.startsWith("http")) return {error: 'Not a valid URL'};

    // Create an options object for the SitemapParser instance
    const options = {
        rejectInvalidContentType: true,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
        maximumRetries: 3,
        maximumDepth: 5,
        timeout: 5000,
        debug: false,
    };

    // Create a new SitemapParser instance with the options object
    const parser = new SitemapParser(options);

    // Run the sitemap downloader and return the parsed sitemap or an error message
    try {
        return await parser.run(sitemap);
    } catch (error) {
        console.error(error);
        return {error: 'Failed to parse sitemap'};
    }
}
