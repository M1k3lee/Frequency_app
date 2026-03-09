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

function fail(message) {
  console.error(`\n[verify:frequencies] ${message}`);
  process.exit(1);
}

function main() {
  const repoRoot = process.cwd();
  const frequenciesPath = path.join(repoRoot, 'src', 'data', 'frequencies.ts');
  const gatewayConfigPath = path.join(repoRoot, 'src', 'audio', 'gateway', 'GatewaySignalConfig.ts');

  const frequencyText = fs.readFileSync(frequenciesPath, 'utf8');
  const frequenciesLiteral = extractLiteral(frequencyText, 'export const frequencies', '[', ']');
  const frequencies = evalLiteral(frequenciesLiteral);

  const gatewayText = fs.readFileSync(gatewayConfigPath, 'utf8');

  const configNameMatches = [...gatewayText.matchAll(/export const ([A-Z0-9_]+): GatewaySignalConfig =/g)];
  if (configNameMatches.length === 0) {
    fail('No Gateway configs found.');
  }

  const configObjects = {};
  for (const match of configNameMatches) {
    const configName = match[1];
    const literal = extractLiteral(gatewayText, `export const ${configName}: GatewaySignalConfig =`, '{', '}');
    configObjects[configName] = evalLiteral(literal);
  }

  const configMapLiteral = extractLiteral(
    gatewayText,
    'const configs: Record<string, GatewaySignalConfig> =',
    '{',
    '}'
  );

  const configMapBuilder = Function(
    ...Object.keys(configObjects),
    `"use strict"; return (${configMapLiteral});`
  );
  const configMap = configMapBuilder(...Object.values(configObjects));

  const gatewayFrequencies = frequencies.filter(
    (f) => f.isGatewaySignal || (Array.isArray(f.tags) && f.tags.includes('gateway'))
  );

  const problems = [];

  for (const [id, config] of Object.entries(configMap)) {
    if (!config || typeof config !== 'object') {
      problems.push(`Config map id "${id}" points to an invalid config object.`);
      continue;
    }

    if (!Array.isArray(config.carrierLayers) || config.carrierLayers.length === 0) {
      problems.push(`Config "${config.name}" (${id}) has no carrier layers.`);
    }

    for (const [index, layer] of (config.carrierLayers || []).entries()) {
      const measuredBeat = layer.rightFreq - layer.leftFreq;
      if (Math.abs(measuredBeat - layer.beatFreq) > 1e-6) {
        problems.push(
          `Config "${config.name}" layer ${index + 1}: beat mismatch (right-left=${measuredBeat}, beatFreq=${layer.beatFreq}).`
        );
      }

      if (Math.abs(layer.beatFreq - config.targetBeatFreq) > 1e-6) {
        problems.push(
          `Config "${config.name}" layer ${index + 1}: beatFreq ${layer.beatFreq} does not match targetBeatFreq ${config.targetBeatFreq}.`
        );
      }

      if (layer.leftFreq <= 0 || layer.rightFreq <= 0) {
        problems.push(`Config "${config.name}" layer ${index + 1}: non-positive carrier frequency.`);
      }
    }

    for (const [index, layer] of (config.isochronicLayers || []).entries()) {
      if (layer.frequency <= 0 || layer.pulseRate <= 0) {
        problems.push(`Config "${config.name}" isochronic layer ${index + 1}: non-positive frequency or pulse rate.`);
      }
      if (layer.dutyCycle <= 0 || layer.dutyCycle >= 1) {
        problems.push(`Config "${config.name}" isochronic layer ${index + 1}: dutyCycle out of safe range (0,1).`);
      }
    }
  }

  for (const freq of gatewayFrequencies) {
    if (!configMap[freq.id]) {
      problems.push(`Gateway-tagged frequency "${freq.id}" (${freq.name}) has no GatewaySignalConfig mapping.`);
    }
  }

  if (problems.length > 0) {
    console.error('\n[verify:frequencies] Validation failed:');
    for (const problem of problems) {
      console.error(`- ${problem}`);
    }
    process.exit(1);
  }

  const categoryCounts = frequencies.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  console.log('\n[verify:frequencies] OK');
  console.log(`- Frequencies validated: ${frequencies.length}`);
  console.log(`- Gateway-tagged frequencies: ${gatewayFrequencies.length}`);
  console.log(`- Gateway config ids mapped: ${Object.keys(configMap).length}`);
  console.log(`- Categories: ${JSON.stringify(categoryCounts)}`);
}

main();
