// Génère les icônes PNG de la PWA à partir du design d'icon.svg
// (carré rouge #dc2626 aux coins arrondis + « I » blanc).
// Chrome exige des icônes PNG 192/512 pour proposer l'installation —
// le SVG seul ne suffit pas.
// Usage : node scripts/generate-icons.mjs   (écrit dans public/)

import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

// --- PNG minimal (RGBA 8 bits, filtre 0) ---

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function encodePng(size, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // profondeur
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- Dessin (calqué sur public/icon.svg : viewBox 512, rx=96, « I » bold) ---

const RED = [0xdc, 0x26, 0x26, 0xff];

function roundedRectContains(x, y, size, radius) {
  if (radius <= 0) return true;
  const cx = Math.max(radius, Math.min(x, size - 1 - radius));
  const cy = Math.max(radius, Math.min(y, size - 1 - radius));
  // Hors de la zone centrale → tester le coin
  if (cx !== x || cy !== y) {
    const dx = x - cx, dy = y - cy;
    return dx * dx + dy * dy <= radius * radius;
  }
  return true;
}

function renderIcon(size, { maskable }) {
  const pixels = Buffer.alloc(size * size * 4);
  const k = size / 512;
  const radius = maskable ? 0 : Math.round(96 * k);
  // Barre du « I » : plus resserrée en maskable (zone sûre de 80 %)
  const barW = Math.round((maskable ? 62 : 74) * k);
  const barH = Math.round((maskable ? 220 : 268) * k);
  const x0 = Math.round((size - barW) / 2);
  const y0 = Math.round((size - barH) / 2);
  const barRadius = Math.round(barW / 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const off = (y * size + x) * 4;
      if (!roundedRectContains(x, y, size, radius)) continue; // transparent
      pixels.set(RED, off);
      // « I » blanc : barre verticale aux extrémités arrondies
      const lx = x - x0, ly = y - y0;
      if (lx >= 0 && lx < barW && ly >= 0 && ly < barH) {
        const inCoreX = lx >= barRadius && lx < barW - barRadius;
        const inCoreY = ly >= barRadius && ly < barH - barRadius;
        let inside = inCoreX || inCoreY;
        if (!inside) {
          const ccx = lx < barRadius ? barRadius : barW - 1 - barRadius;
          const ccy = ly < barRadius ? barRadius : barH - 1 - barRadius;
          inside = (lx - ccx) ** 2 + (ly - ccy) ** 2 <= barRadius * barRadius;
        }
        if (inside) pixels.set([0xff, 0xff, 0xff, 0xff], off);
      }
    }
  }
  return encodePng(size, pixels);
}

for (const { name, size, maskable } of [
  { name: 'icon-192.png', size: 192, maskable: false },
  { name: 'icon-512.png', size: 512, maskable: false },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
]) {
  fs.writeFileSync(path.join(ROOT, name), renderIcon(size, { maskable }));
  console.log(`${name} généré (${size}x${size}${maskable ? ', maskable' : ''})`);
}
