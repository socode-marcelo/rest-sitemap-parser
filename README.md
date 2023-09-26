# REST Sitemap Parser
A basic REST API that returns a JSON containing all URLs from a sitemap XML.

Written using Bun, Hono and Mapsite

## Install Bun and Dependencies
```
curl -fsSL https://bun.sh/install | bash
bun install
```

## Test
```
bun run dev
curl http://localhost:3000
```
## Start Server
```
bun run start
```
## Request URLs from a Sitemap
```
curl --header "Content-Type: application/json" \
--request POST \
--data '{"sitemap":"https://stackovercode.com/sitemap.xml"}' \
 http://localhost:3000/sitemap
```