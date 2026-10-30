const fs = require('fs');
const cq = fs.readFileSync('C:/Users/adv danish/.gemini/antigravity/scratch/neighbournet/prototype_extracts/civicquest_bundle.js', 'utf8');

const target = 'VITE_GEMINI_API_KEY';
const idx = cq.indexOf(target);
console.log('--- AI Vision / Gemini Code in CivicQuest ---');
console.log(cq.substring(idx - 100, idx + 2500));
