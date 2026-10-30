const fs = require('fs');
const path = require('path');
const cq = fs.readFileSync('C:/Users/adv danish/.gemini/antigravity/scratch/neighbournet/prototype_extracts/civicquest_bundle.js', 'utf8');

// Find Firebase config (apiKey, authDomain, projectId, storageBucket, etc.)
const fbConfigMatch = cq.match(/\{[^}]*apiKey:[^}]*projectId:[^}]*\}/);
console.log('Firebase config:');
console.log(fbConfigMatch ? fbConfigMatch[0] : 'None directly matched');

// Find collection names (collection(db, "...") or doc(db, "..."))
const colMatches = cq.match(/collection\([^,]+,\s*["']([^"']+)["']\)/g) || [];
console.log('\nFirestore collections:', [...new Set(colMatches)]);

// Find Gemini calls or prompt texts
const geminiPrompts = cq.match(/generateContent[^}]{0,500}/g) || [];
console.log('\nGemini content calls sample:');
geminiPrompts.forEach((p, i) => console.log(`[${i}]:`, p.slice(0, 200)));

// Let's search for "gemini" case-insensitive contexts
const geminiIdx = cq.indexOf('gemini');
if (geminiIdx !== -1) {
  console.log('\nGemini context:', cq.substring(Math.max(0, geminiIdx - 200), Math.min(cq.length, geminiIdx + 300)));
}
const geminiUpper = cq.indexOf('GEMINI');
if (geminiUpper !== -1) {
  console.log('\nGEMINI context:', cq.substring(Math.max(0, geminiUpper - 200), Math.min(cq.length, geminiUpper + 300)));
}
