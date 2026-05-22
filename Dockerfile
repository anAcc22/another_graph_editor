FROM caddy:2.11.3-alpine

WORKDIR /app
COPY dist/ .
COPY Caddyfile ./Caddyfile

CMD ["caddy", "run"]