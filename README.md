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
## Usage
To test the API, run `bun run dev` and then use `curl http://localhost:3000` to test the API.

To start the server, run `bun run start`.

To request URLs from a sitemap, send a POST request with the following data:
{"sitemap":"https://stackovercode.com/sitemap.xml"}

To request a sitemap from a domain, send a POST request with the following data:
{"domain":"stackovercode.com"}

## Docker

### Commands
```
docker build -t rest-sitemap-parser . && docker run -d -p 3000:3000 --name bun_app rest-sitemap-parser
```

### Compose
```
docker-compose up -d --build
```

## Examples
### Request URLs from a Sitemap

```
curl --header "Content-Type: application/json" \
--request POST \
--data '{"sitemap":"https://stackovercode.com/sitemap.xml"}' \
 http://localhost:3000/sitemap
```
### Request URLs from Domain
```
curl --header "Content-Type: application/json" \
--request POST \
--data '{"domain":"stackovercode.com"}' \
 http://localhost:3000/domain
```

### Response
```
{
   "errors": [],
   "type": "sitemap",
   "urls": [
      "https://www.stackovercode.com/",
      "https://www.stackovercode.com/schedule",
      "https://www.stackovercode.com/contact-us",
      "https://www.stackovercode.com/disclaimer",
      "https://www.stackovercode.com/privacy",
      "https://www.stackovercode.com/terms-conditions",
      "https://www.stackovercode.com/signthis"
   ]
}
```