# Auth Worker

Stores the candidate login encrypted (AES-256-GCM) in Cloudflare KV. The key and the admin password are Worker secrets, so nothing sensitive is in the site code. The admin screen lets you change the candidate username/password without redeploying.

## One-time setup (free Cloudflare account)
Run these in this `worker` folder (requires Node.js):

1. `npx wrangler login`
2. `npx wrangler kv namespace create CONFIG` and paste the returned `id` into `wrangler.toml`
3. Secrets:
   - `npx wrangler secret put ADMIN_PASSWORD` (your admin password)
   - `npx wrangler secret put ENC_KEY` (a 32-byte base64 key; generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`)
4. `npx wrangler deploy`
5. Put the printed `https://recruitment-auth.<subdomain>.workers.dev` URL in `src/config.js`, merge, then sign in as Admin and set the first candidate password.

Keep `ENC_KEY` safe: changing it makes the stored password unreadable (just set a new one in the admin screen).
