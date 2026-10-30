const fs = require('fs');
const path = require('path');
const icemapDir = 'C:/Users/adv danish/.gemini/antigravity/scratch/neighbournet/prototype_extracts/icemap';

const files = fs.readdirSync(icemapDir).filter(f => f.endsWith('.js'));
for (const file of files) {
  const content = fs.readFileSync(path.join(icemapDir, file), 'utf8');
  console.log(`\n=== File: ${file} (length: ${content.length}) ===`);
  
  // Search for interesting keywords
  const keywords = ['category', 'severity', 'incident', 'report', 'anonymous', 'upvote', 'confirm', 'verify', 'duplicate', 'heatmap', 'cluster', 'health', 'leaflet', 'mapbox', 'score', 'admin'];
  for (const kw of keywords) {
    const regex = new RegExp(kw, 'gi');
    const matches = content.match(regex);
    if (matches && matches.length > 5) {
      console.log(`  Keyword '${kw}': ${matches.length} matches`);
    }
  }

  // Look for category lists or severity levels
  const catMatches = content.match(/categories|SEVERITY|severityLevel|incidentType/gi);
  if (catMatches) {
    console.log(`  Found category/severity references in ${file}`);
  }
}
