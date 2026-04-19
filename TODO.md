# TODO — NDP Transition Research Archive

## Automation — Running

- [x] Source list: Google Alerts RSS feeds for "Avi Lewis" and "federal ndp" — feed URLs stored in the scheduled task prompt (not committed to repo)
- [x] Fetch script: `scripts/fetch-alerts.js` — fetches Atom feeds, decodes Google redirect URLs, filters social domains, deduplicates against existing archive `source:` fields, outputs JSON
- [x] Scheduled task: `ndp-daily-archive` — runs daily at 9:00 AM, fetches new articles, runs defuddle, creates stubs for paywalled content, opens a PR with skipped items listed for follow-up
- [x] First automated PRs confirmed working (Apr 14–18 daily archives merged)
- [x] Content linter + weekly CI scan (`scripts/lint-content.py`, `.github/workflows/lint.yml`)
- [ ] Monitor for a week — adjust task prompt if formatting or editorial judgment is off

## Open PRs (as of Apr 18)

- [ ] #12 — daily archive 2026-04-18
- [ ] #11 — CTV Alberta Primetime transcript (Avi Lewis panel, Apr 16)
- [ ] #13 — Rabble: Lewis surveillance/pricing press conference, Apr 14
- [ ] #15 — Dependabot + weekly link rot checker

## Astro Site

- [x] Dynamic section discovery — nav, home page, section indexes derive from content collection at build time
- [x] Pinned Astro and Pagefind versions exactly
- [x] Nav dropdowns (Convention / Transition) with CSS-only hover
- [x] Fixed topnav abbreviations (Mar/Apr not Marc/Apri)
- [x] Day of week in index cards
- [x] Speeches section renamed to "Avi Lewis Speeches"
- [x] transcript-archive consolidated
- [x] GitHub Pages deployment live
- [ ] Add light/dark toggle
- [ ] Add OpenGraph and meta tags (not urgent)
- [ ] Enable search engine indexing — update `robots.txt` to `Allow: /` once ready
- [ ] Add `sitemap.xml` when content warrants it
- [ ] Consider custom domain

## Content — Ongoing (Manual)

- [ ] Archive full coverage from La Presse and Le Devoir (paywalled — add manually or via Dispatch)
- [ ] Archive full Bloomberg profile (paywalled — add manually or via Dispatch)
- [ ] Expand `stephen-lewis/` — currently three archival speeches

---

*Last updated: 2026-04-18*
