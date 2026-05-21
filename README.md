# PolyCarp

Copolymer Reactivity Prediction — a machine-learning tool for predicting the microstructure (random, block-like, or alternating) of radical copolymers from monomer pair, solvent, and reaction conditions.

The frontend is a React/Vite application served by nginx. The backend is the [copolymer-reactivity](https://github.com/lamalab-org/copolymer-reactivity) Python/FastAPI service.

## Local development

```sh
cp .env.example .env
npm install
npm run dev
```

The dev server proxies `/api/` requests to `VITE_API_URL` (default: `/api`). For local testing against the live API, set `VITE_API_URL=https://polycarp.cheminfo.org/api` in `.env`.

## Deployment

All three modes use the same `.env` file. Copy and edit it first:

```sh
cp .env.example .env
# Edit BACKEND_IMAGE, CLOUDFLARE_TUNNEL_TOKEN, DOMAIN as needed
```

### Option 1 — Port published on host

```sh
cp compose.example.yaml compose.yaml
docker compose pull && docker compose up -d
```

The frontend is available at `http://localhost:8080`. To build the image locally instead of pulling the released one:

```sh
docker compose up -d --build
```

### Option 2 — Cloudflare Tunnel (public HTTPS via cloudflared)

1. In the [Cloudflare dashboard](https://dash.cloudflare.com): Networking → Tunnels → Create a tunnel → Cloudflared connector → copy the token into `.env` as `CLOUDFLARE_TUNNEL_TOKEN=...`
2. Open the tunnel → Published applications tab → add application with Service = HTTP, URL = `frontend:80`, hostname = `polycarp.lactame.com` (or your domain).

```sh
cp compose.example.cloudflared.yaml compose.yaml
docker compose up -d
```

### Option 3 — Traefik reverse proxy

Requires an existing Traefik instance on an external Docker network named `traefik` with a `websecure` entrypoint and `letsencrypt` cert resolver. Adjust the `DOMAIN` in `.env` (default: `polycarp.cheminfo.org`).

```sh
cp compose.example.traefik.yaml compose.yaml
docker compose up -d
```

## Updating

```sh
docker compose pull && docker compose up -d
```
