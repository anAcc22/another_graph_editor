FROM caddy:2.11.3-alpine

WORKDIR /app
COPY /app/dist/ .
COPY Caddyfile ./Caddyfile

CMD ["caddy", "run"]