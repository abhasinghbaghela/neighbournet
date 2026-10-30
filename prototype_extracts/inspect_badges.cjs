const fs = require('fs');
const cq = fs.readFileSync('C:/Users/adv danish/.gemini/antigravity/scratch/neighbournet/prototype_extracts/civicquest_bundle.js', 'utf8');

const target = 'badges:';
let pos = 0;
while (true) {
  const idx = cq.indexOf(target, pos);
  if (idx === -1) break;
  console.log('--- Badges occurrence at', idx, '---');
  console.log(cq.substring(Math.max(0, idx - 150), Math.min(cq.length, idx + 350)));
  pos = idx + target.length;
}
