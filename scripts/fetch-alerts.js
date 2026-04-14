#!/usr/bin/env node
/**
 * fetch-alerts.js
 *
 * Fetches Google Alerts RSS (Atom) feeds and outputs new, archivable articles as JSON.
 *
 * Usage:
 *   node scripts/fetch-alerts.js "feed-url-1" "feed-url-2" ...
 *
 * Output (stdout):
 *   JSON array of objects:
 *     { url, title, date, outlet }          -- archivable article
 *     { url, title, date, skipped: true }   -- social/non-archivable URL
 *
 *   Empty array [] if nothing new.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

const SKIP_DOMAINS = new Set([
  'reddit.com', 'facebook.com', 'instagram.com',
  'youtube.com', 'youtu.be', 'x.com', 'twitter.com',
  'tiktok.com', 'msn.com',
]);

const MAX_AGE_HOURS = 48;

function htmlUnescape(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function decodeGoogleUrl(href) {
  const unescaped = htmlUnescape(href);
  try {
    const u = new URL(unescaped);
    if (u.hostname === 'www.google.com' && u.pathname === '/url') {
      const real = u.searchParams.get('url');
      if (real) return real;
    }
    return unescaped;
  } catch (_) { /* ignore */ }
  return unescaped;
}

function getOutlet(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (_) {
    return '';
  }
}

function isSkipped(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    for (const d of SKIP_DOMAINS) {
      if (host === d || host.endsWith(`.${d}`)) return true;
    }
  } catch (_) { /* ignore */ }
  return false;
}

function isRecent(dateStr) {
  const published = new Date(dateStr);
  if (isNaN(published.getTime())) return false;
  const ageMs = Date.now() - published.getTime();
  return ageMs <= MAX_AGE_HOURS * 60 * 60 * 1000;
}

function toYMD(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function getArchivedUrls() {
  const archived = new Set();
  const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.astro', 'scripts', 'src', 'public']);
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (name.startsWith('.') && name !== '.') continue;
      const full = join(dir, name);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        if (SKIP_DIRS.has(name)) continue;
        walk(full);
      } else if (extname(name) === '.md') {
        const content = readFileSync(full, 'utf8');
        for (const line of content.split('\n')) {
          const m = line.match(/^source:\s*(https?:\/\/.+)/);
          if (m) archived.add(m[1].trim());
        }
      }
    }
  };
  walk(REPO_ROOT);
  return archived;
}

function parseAtomFeed(xml) {
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = entryRegex.exec(xml)) !== null) {
    const block = m[1];
    const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/);
    const linkMatch = block.match(/<link\s+href="([^"]+)"/);
    const publishedMatch = block.match(/<published>([^<]+)<\/published>/);

    const rawTitle = titleMatch
      ? titleMatch[1]
          .replace(/<[^>]+>/g, '')
          .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
          .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
          .trim()
      : '';
    const rawLink = linkMatch ? linkMatch[1] : '';
    const published = publishedMatch ? publishedMatch[1].trim() : '';

    if (!rawLink || !published) continue;

    entries.push({ url: decodeGoogleUrl(rawLink), title: rawTitle, published });
  }
  return entries;
}

const feedUrls = process.argv.slice(2);

if (feedUrls.length === 0) {
  process.stderr.write('Usage: node scripts/fetch-alerts.js "feed-url-1" "feed-url-2" ...\n');
  process.exit(1);
}

const archived = getArchivedUrls();
const results = [];
const seen = new Set();

for (const feedUrl of feedUrls) {
  let xml;
  try {
    const res = await fetch(feedUrl);
    if (!res.ok) {
      process.stderr.write(`Warning: feed ${feedUrl} returned ${res.status}\n`);
      continue;
    }
    xml = await res.text();
  } catch (err) {
    process.stderr.write(`Warning: could not fetch ${feedUrl}: ${err.message}\n`);
    continue;
  }

  for (const { url, title, published } of parseAtomFeed(xml)) {
    if (seen.has(url)) continue;
    seen.add(url);
    if (!isRecent(published)) continue;
    if (archived.has(url)) continue;

    if (isSkipped(url)) {
      results.push({ url, title, date: toYMD(published), skipped: true });
    } else {
      results.push({ url, title, date: toYMD(published), outlet: getOutlet(url) });
    }
  }
}

console.log(JSON.stringify(results, null, 2));
