const fs = require('fs');
const content = fs.readFileSync('C:/Users/adv danish/.gemini/antigravity/scratch/neighbournet/prototype_extracts/icemap/0_xew7db04k4w.js', 'utf8');
console.log('Size:', content.length);
console.log(content.slice(0, 3000));
