# Recruitment app

A local developer-assessment prototype. Candidates can query a sample PostgreSQL database and fix a JavaScript API handler on the same page. No account or Postman installation is required.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the URL printed by Vite. Run `npm test` for the challenge checks and `npm run build` to create a static production build.

## How it works

- Each SQL run starts with a fresh in-browser PostgreSQL database using PGlite. Five related tables contain 1,005 fictional customers, contact details, dates of birth, licences, and licence types. An ER diagram and the schema are visible in the assessment.
- The API challenge runs candidate JavaScript against a simulated `GET /api/customers/:id` request and an in-memory database. It is not a real HTTP endpoint and cannot be called from Postman.
- Candidate code executes in a short-lived sandboxed browser frame and worker with a timeout. This is a local prototype, not a secure environment for administering assessments to untrusted users. There is no authentication, server-side grading, persistence, or protection against tampering. Do not use real or sensitive data.
- Editor changes are lost when the page is refreshed or closed.
- The built files are static and can be hosted on a static web host, subject to that host's pricing and limits.

## GitHub Pages

The included workflow builds and deploys changes from `main`. Enable GitHub Pages in the repository settings and select **GitHub Actions** as the source. GitHub Pages availability for private repositories depends on the account's plan. The site itself is public: do not add confidential data or assessment answers to it.

The production build uses the `/recruitment-app/` base path for this repository's Pages URL.
