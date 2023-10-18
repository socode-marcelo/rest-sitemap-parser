FROM oven/bun

WORKDIR /app
COPY . .
RUN bun install
EXPOSE 3000

HEALTHCHECK --interval=60s --timeout=4s CMD bash -c ':> /dev/tcp/127.0.0.1/3000' || exit 1
CMD ["bun", "run", "start"]