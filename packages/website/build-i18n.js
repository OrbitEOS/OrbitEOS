#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// ── Configuration ──────────────────────────────────────────────
const ROOT = __dirname;
const TEMPLATE = path.join(ROOT, 'index.html');
const LOCALES_DIR = path.join(ROOT, 'locales');
const DIST = path.join(ROOT, 'dist');

const DEFAULT_LOCALE = 'en';

// Each locale maps to its own domain
const LOCALE_DOMAINS = {
    en: 'https://orbiteos.com',
    nl: 'https://orbiteos.nl',
};

// Discover locales from JSON files
const locales = fs.readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));

console.log(`Building ${locales.length} locale(s): ${locales.join(', ')}`);

// ── Helpers ────────────────────────────────────────────────────
function getNestedValue(obj, keyPath) {
    return keyPath.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// ── Build each locale ──────────────────────────────────────────
const template = fs.readFileSync(TEMPLATE, 'utf-8');

for (const locale of locales) {
    const translations = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, `${locale}.json`), 'utf-8'));
    let html = template;

    // 1. Set <html lang="xx">
    html = html.replace(/<html\s+lang="[^"]*"/, `<html lang="${locale}"`);

    // 2. Replace <title data-i18n="...">...</title>
    html = html.replace(
        /(<title\s+data-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/title>)/,
        (match, open, key, content, close) => {
            const val = getNestedValue(translations, key);
            return val !== undefined ? `${open}${val}${close}` : match;
        }
    );

    // 3. Replace <meta data-i18n-attr="..." content="...">
    html = html.replace(
        /(<meta[^>]*data-i18n-attr="([^"]+)"[^>]*content=")([^"]*)("[^>]*>)/g,
        (match, before, key, oldContent, after) => {
            const val = getNestedValue(translations, key);
            return val !== undefined ? `${before}${val}${after}` : match;
        }
    );

    // 4. Inject hreflang tags after <meta name="theme-color">
    const hreflangTags = locales.map(l => {
        const domain = LOCALE_DOMAINS[l] || LOCALE_DOMAINS[DEFAULT_LOCALE];
        return `    <link rel="alternate" hreflang="${l}" href="${domain}/">`;
    }).join('\n');
    const xDefaultTag = `    <link rel="alternate" hreflang="x-default" href="${LOCALE_DOMAINS[DEFAULT_LOCALE]}/">`;
    const allHreflang = `${hreflangTags}\n${xDefaultTag}`;
    html = html.replace(
        /(<meta name="theme-color"[^>]*>)/,
        `$1\n${allHreflang}`
    );

    // 5. Replace data-i18n-html (innerHTML replacement, matches same tag name)
    html = html.replace(
        /<(\w+)([^>]*\bdata-i18n-html="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g,
        (match, tag, attrs, key, content) => {
            const val = getNestedValue(translations, key);
            return val !== undefined ? `<${tag}${attrs}>${val}</${tag}>` : match;
        }
    );

    // 6. Replace data-i18n on regular HTML elements (textContent replacement)
    html = html.replace(
        /<(\w+)([^>]*\bdata-i18n="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g,
        (match, tag, attrs, key, content) => {
            const val = getNestedValue(translations, key);
            return val !== undefined ? `<${tag}${attrs}>${val}</${tag}>` : match;
        }
    );

    // 7. Replace data-i18n on SVG <text> elements
    //    (already handled by step 6 since <text> matches <(\w+)>)

    // 8. Update language switcher links to use full domain URLs
    for (const l of locales) {
        const domain = LOCALE_DOMAINS[l] || LOCALE_DOMAINS[DEFAULT_LOCALE];
        html = html.replace(
            new RegExp(`href="[^"]*"(\\s+class="lang-option[^"]*"\\s+data-lang="${l}")`),
            `href="${domain}/"$1`
        );
    }

    // 9. Set active language in switcher
    const langLabel = locale.toUpperCase();
    html = html.replace(
        /(<button[^>]*id="lang-switcher-btn"[^>]*>[\s\S]*?<span>)\w+(<\/span>)/,
        `$1${langLabel}$2`
    );
    // Mark active language option
    html = html.replace(/class="lang-option active"/g, 'class="lang-option"');
    html = html.replace(
        new RegExp(`class="lang-option"(\\s+data-lang="${locale}")`),
        `class="lang-option active"$1`
    );

    // 10. Write output — each locale gets its own directory (separate FTP deploy)
    const outDir = path.join(DIST, locale);
    ensureDir(outDir);
    const outFile = path.join(outDir, 'index.html');
    fs.writeFileSync(outFile, html, 'utf-8');
    console.log(`  ✓ ${locale} → ${path.relative(ROOT, outFile)}`);

    // Copy static assets into each locale dir
    const assetDirs = ['css', 'js', 'img'];
    for (const dir of assetDirs) {
        const src = path.join(ROOT, dir);
        if (fs.existsSync(src)) {
            copyDirSync(src, path.join(outDir, dir));
        }
    }
}

function copyDirSync(src, dest) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log(`\nDone! Deploy each folder via FTP:`);
console.log(`  dist/en/ → orbiteos.com`);
console.log(`  dist/nl/ → orbiteos.nl`);
