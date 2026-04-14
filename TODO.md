# TODO — NDP Transition Research Archive

Active work to move this project toward automated daily updates via Claude Code Desktop.

## Setup — Claude Code Desktop

- [ ] Open this repo folder in Claude Code Desktop
- [ ] Verify `CLAUDE.md` is picked up on session start (ask Claude "what project is this?")
- [ ] Verify `gh` CLI is installed and authenticated on your Mac (`gh auth status` in any terminal)
- [ ] Verify `defuddle` is installed globally on your Mac (`npm install -g defuddle`)
- [ ] Test a manual run: ask Claude Code to fetch one article with Defuddle, format it, and save it to the right folder

## Write CLAUDE.md

- [ ] Review the draft `CLAUDE.md` in this commit — adjust anything that doesn't match your intent
- [ ] Confirm Claude Code reads it on session start
- [ ] Test formatting: give Claude an article URL and ask it to add it to the archive — check the output matches existing files
- [ ] Iterate on the `CLAUDE.md` instructions until output is consistently right

## Automation — Done

- [x] Source list: Google Alerts RSS feeds for "Avi Lewis" and "federal ndp" — feed URLs stored in the scheduled task prompt (not committed to repo)
- [x] Fetch script: `scripts/fetch-alerts.js` — fetches Atom feeds, decodes Google redirect URLs, filters social domains, deduplicates against existing archive `source:` fields, outputs JSON
- [x] Scheduled task: `ndp-daily-archive` — runs daily at 9:00 AM, fetches new articles, runs defuddle, creates stubs for paywalled content, opens a PR with skipped items listed for follow-up

## Automation — Still to do

- [ ] Run the task manually once ("Run now" in the Scheduled sidebar) and approve tool permissions so future runs don't pause
- [ ] Review the first daily PR for quality — adjust task prompt if formatting or editorial judgment is off
- [ ] Monitor for a week

## Test the Dispatch Workflow (Mobile)

- [ ] From your phone, send Dispatch a URL with a message like "add this to the NDP archive"
- [ ] Confirm Dispatch spawns a Code session against this repo
- [ ] Check that the session reads `CLAUDE.md`, uses Defuddle, and creates a PR
- [ ] Test the paywalled case: paste article text + source URL to Dispatch, confirm it creates the file without Defuddle
- [ ] Confirm you get a push notification when the session finishes or needs approval

## Content — Ongoing (Manual)

- [ ] Archive full coverage from La Presse and Le Devoir (paywalled — add manually or via Dispatch)
- [ ] Archive full Bloomberg profile (paywalled — add manually or via Dispatch)
- [ ] Complete `transcript-archive/` with remaining relevant video transcripts
- [ ] Expand `stephen-lewis/` — currently three archival speeches
- [ ] Add `march-27-28/` folder for convention run-up coverage
- [ ] Continue expanding `april-01/` and beyond with post-transition coverage

## Astro Site — Hardened for Automation

Done in this session (Cowork, April 13):
- [x] Dynamic section discovery — nav, home page, section indexes, and breadcrumbs now derive from content collection at build time. New date folders are picked up automatically.
- [x] Pinned Astro and Pagefind versions exactly (no caret ranges) to prevent surprise breakage on CI
- [x] Added validation constraints to `CLAUDE.md` so Claude never produces frontmatter that breaks the Zod schema
- [x] Created `src/lib/sections.ts` as single source of truth for section slugs, labels, and nav

Still to do:
- [ ] **Verify the build works** — run `pnpm install && pnpm build` in Claude Code Desktop after committing these changes
- [ ] Fix topnav short date names — three letters, not four (Mar not Marc, Apr not Apri)
- [ ] Dated entries in nav should appear in a dropdown rather than listed one-by-one
- [ ] Include days of the week in the index cards (e.g., "March 29 — Saturday") but not in the nav entries
- [ ] Consolidate `transcript-archive/` — move entries into their dated folders
- [ ] Rename `speeches/` section label to "Avi Lewis Speeches"
- [ ] Add light/dark toggle
- [ ] Add OpenGraph and meta tags (not urgent — do when content is substantial)
- [ ] Enable search engine indexing — update `robots.txt` to `Allow: /` once ready
- [ ] Add `sitemap.xml` when content warrants it
- [ ] Consider custom domain when the archive has enough gravity to justify it

---

*Last updated: 2026-04-13*
