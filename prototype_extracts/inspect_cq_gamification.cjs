const fs = require('fs');
const cq = fs.readFileSync('C:/Users/adv danish/.gemini/antigravity/scratch/neighbournet/prototype_extracts/civicquest_bundle.js', 'utf8');

// Let's find component definitions, lucide icons used, styles, etc.
console.log('--- LUCIDE ICONS USED ---');
const iconMatches = cq.match(/lucide-[a-z-]+/g) || [];
console.log('Lucide classes:', [...new Set(iconMatches)].slice(0, 30));

// Search for badges / levels / gamification constants
const xpMatch = cq.match(/xp|level|badge|points/gi) || [];
console.log('XP/Level/Badge matches:', xpMatch.length);

// Let's search for the gamification logic (level thresholds, badges definitions)
const badgeDefMatch = cq.match(/\{[^}]*name:[^}]*badge[^}]*\}/gi) || [];
console.log('Badge definitions sample:', badgeDefMatch.slice(0, 5));

// Let's look for Level or XP calculation
const xpIdx = cq.indexOf('awardUserXpAndStats');
if (xpIdx !== -1) {
  console.log('\n--- awardUserXpAndStats logic ---');
  console.log(cq.substring(xpIdx - 200, xpIdx + 800));
}
