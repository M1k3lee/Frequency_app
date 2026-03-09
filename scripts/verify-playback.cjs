const fs = require('fs');
const path = require('path');

function extractLiteral(text, marker, openChar, closeChar) {
  const markerIndex = text.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Marker not found: ${marker}`);
  }
  const equalsIndex = text.indexOf('=', markerIndex);
  if (equalsIndex === -1) {
    throw new Error(`Assignment not found for marker: ${marker}`);
  }
  const start = text.indexOf(openChar, equalsIndex);
  if (start === -1) {
    throw new Error(`Opening ${openChar} not found for marker: ${marker}`);
  }

  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (inSingle) {
      if (!escaped && ch === "'") inSingle = false;
      escaped = !escaped && ch === '\\';
      continue;
    }
    if (inDouble) {
      if (!escaped && ch === '"') inDouble = false;
      escaped = !escaped && ch === '\\';
      continue;
    }
    if (inTemplate) {
      if (!escaped && ch === '`') inTemplate = false;
      escaped = !escaped && ch === '\\';
      continue;
    }

    if (ch === '/' && next === '/') {
      inLineComment = true;
      i++;
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      i++;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      escaped = false;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      escaped = false;
      continue;
    }
    if (ch === '`') {
      inTemplate = true;
      escaped = false;
      continue;
    }

    if (ch === openChar) depth++;
    if (ch === closeChar) {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  throw new Error(`Could not find matching ${closeChar} for marker: ${marker}`);
}

function evalLiteral(literal) {
  return Function(`"use strict"; return (${literal});`)();
}

function classifyMode(targetHz) {
  if (targetHz < 10) return 'fm-carrier';
  if (targetHz <= 40) return 'binaural';
  return 'tone';
}

function getBinauralCarrierFrequency(beatFreq, headphoneQuality) {
  const preferredBase = headphoneQuality === 'high-quality' ? 260 : 432;
  const minSafeCarrier = beatFreq / 2 + 60;
  return Math.min(1600, Math.max(preferredBase, minSafeCarrier));
}

function fail(messages) {
  console.error('\n[verify:playback] Validation failed:');
  for (const message of messages) {
    console.error(`- ${message}`);
  }
  process.exit(1);
}

function main() {
  const repoRoot = process.cwd();
  const frequenciesPath = path.join(repoRoot, 'src', 'data', 'frequencies.ts');
  const frequencyText = fs.readFileSync(frequenciesPath, 'utf8');
  const frequenciesLiteral = extractLiteral(frequencyText, 'export const frequencies', '[', ']');
  const frequencies = evalLiteral(frequenciesLiteral);

  const problems = [];
  const modeCounts = { 'fm-carrier': 0, binaural: 0, tone: 0 };
  const idCounts = new Map();

  for (const freq of frequencies) {
    const id = String(freq.id || '').trim();
    const name = String(freq.name || '').trim();
    const targetHz = Number(freq.frequency);

    if (!id) {
      problems.push(`Found a frequency with missing id (${name || 'unnamed'}).`);
      continue;
    }

    idCounts.set(id, (idCounts.get(id) || 0) + 1);

    if (!Number.isFinite(targetHz) || targetHz <= 0) {
      problems.push(`Frequency "${id}" (${name}) has invalid frequency value: ${freq.frequency}`);
      continue;
    }

    const mode = classifyMode(targetHz);
    modeCounts[mode] += 1;

    if (mode === 'fm-carrier') {
      if (targetHz >= 10) {
        problems.push(`Frequency "${id}" should not be in FM carrier mode at ${targetHz}Hz.`);
      }
      continue;
    }

    if (mode === 'binaural') {
      const carrier = getBinauralCarrierFrequency(targetHz, 'standard');
      const left = carrier - targetHz / 2;
      const right = carrier + targetHz / 2;
      const measuredBeat = right - left;

      if (left < 20 || right > 20000) {
        problems.push(`Frequency "${id}" binaural carriers out of audible range (L=${left}, R=${right}).`);
      }
      if (Math.abs(measuredBeat - targetHz) > 1e-6) {
        problems.push(`Frequency "${id}" binaural beat mismatch: expected ${targetHz}, measured ${measuredBeat}.`);
      }
      continue;
    }

    if (mode === 'tone' && targetHz <= 40) {
      problems.push(`Frequency "${id}" should not be in exact-tone mode at ${targetHz}Hz.`);
    }
  }

  for (const [id, count] of idCounts.entries()) {
    if (count > 1) {
      problems.push(`Duplicate frequency id detected: "${id}" appears ${count} times.`);
    }
  }

  if (problems.length > 0) {
    fail(problems);
  }

  const beta15 = frequencies.find((f) => f.id === 'beta-15');
  if (beta15) {
    const carrier = getBinauralCarrierFrequency(beta15.frequency, 'standard');
    const left = carrier - beta15.frequency / 2;
    const right = carrier + beta15.frequency / 2;
    console.log(`\n[verify:playback] beta-15 -> carrier ${carrier}Hz, L ${left.toFixed(2)}Hz, R ${right.toFixed(2)}Hz`);
  }

  console.log('\n[verify:playback] OK');
  console.log(`- Frequencies audited: ${frequencies.length}`);
  console.log(`- Render modes: ${JSON.stringify(modeCounts)}`);
}

main();
