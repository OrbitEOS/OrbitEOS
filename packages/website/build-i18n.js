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

// Domain mapping for hreflang and language switcher
const LOCALE_URLS = {
    en: 'https://orbiteos.com/',
    nl: 'https://orbiteos.nl/',
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
        const href = LOCALE_URLS[l] || `${LOCALE_URLS[DEFAULT_LOCALE]}${l}/`;
        return `    <link rel="alternate" hreflang="${l}" href="${href}">`;
    }).join('\n');
    const xDefaultTag = `    <link rel="alternate" hreflang="x-default" href="${LOCALE_URLS[DEFAULT_LOCALE]}">`;
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

    // 7. Language switcher uses relative paths: / for EN, /nl/ for NL
    //    (keeps users on the same domain — orbiteos.com or orbiteos.nl)

    // 8. Fix asset paths for non-default locales (served from /nl/ subdirectory)
    if (locale !== DEFAULT_LOCALE) {
        html = html.replace(/href="css\//g, 'href="../css/');
        html = html.replace(/src="js\//g, 'src="../js/');
        html = html.replace(/href="img\//g, 'href="../img/');
        html = html.replace(/src="img\//g, 'src="../img/');
    }

    // 9. Set active language in switcher
    const langLabel = locale.toUpperCase();
    html = html.replace(
        /(<button[^>]*id="lang-switcher-btn"[^>]*>[\s\S]*?<span>)\w+(<\/span>)/,
        `$1${langLabel}$2`
    );
    html = html.replace(/class="lang-option active"/g, 'class="lang-option"');
    html = html.replace(
        new RegExp(`class="lang-option"(\\s+data-lang="${locale}")`),
        `class="lang-option active"$1`
    );

    // 10. Write output: EN → dist/, NL → dist/nl/
    const outDir = locale === DEFAULT_LOCALE ? DIST : path.join(DIST, locale);
    ensureDir(outDir);
    const outFile = path.join(outDir, 'index.html');
    fs.writeFileSync(outFile, html, 'utf-8');
    console.log(`  ✓ ${locale} → ${path.relative(ROOT, outFile)}`);
}

// Copy static assets to dist root (shared by all locales)
const assetDirs = ['css', 'js', 'img'];
for (const dir of assetDirs) {
    const src = path.join(ROOT, dir);
    if (fs.existsSync(src)) {
        copyDirSync(src, path.join(DIST, dir));
        console.log(`  ✓ ${dir}/ copied`);
    }
}

// Generate .htaccess for domain-based routing
const htaccess = `# Route orbiteos.nl to Dutch version
RewriteEngine On

# Skip ACME challenges (Let's Encrypt SSL validation)
RewriteRule ^.well-known/ - [L]

# If visitor comes via orbiteos.nl, serve /nl/ content
RewriteCond %{HTTP_HOST} ^(www\\.)?orbiteos\\.nl$ [NC]
RewriteCond %{REQUEST_URI} !^/nl/
RewriteRule ^(.*)$ /nl/$1 [L]
`;
fs.writeFileSync(path.join(DIST, '.htaccess'), htaccess, 'utf-8');
console.log('  ✓ .htaccess generated');

console.log(`\nDone! Upload dist/ to hosting root.`);
console.log(`  orbiteos.com  → serves dist/index.html (EN)`);
console.log(`  orbiteos.nl   → .htaccess rewrites to dist/nl/index.html (NL)`);
