const fs = require('fs');
const path = require('path');
const icemapDir = 'C:/Users/adv danish/.gemini/antigravity/scratch/neighbournet/prototype_extracts/icemap';

for (const file of ['0_xew7db04k4w.js', '4495b6wo_9r5z.js', '0v2azvilwavbo.js', '0d66q46efh1wk.js']) {
  const content = fs.readFileSync(path.join(icemapDir, file), 'utf8');
  console.log(`\n=== File: ${file} ===`);
  // Find strings
  const stringLiterals = content.match(/"([^"\\]{4,50})"/g) || [];
  const relevant = stringLiterals
    .map(s => s.slice(1, -1))
    .filter(s => /incident|report|hazard|pothole|water|electric|theft|animal|filter|cluster|marker|severity|vote|confirm|dispute|status|score|radius|police|fire/i.test(s));
  console.log('Sample relevant strings:', [...new Set(relevant)].slice(0, 25));
}
