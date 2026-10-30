const fs = require('fs');
const html = fs.readFileSync('C:/Users/adv danish/.gemini/antigravity/brain/e8a502e2-77e4-488c-aa58-6bdc2663bfc3/.system_generated/steps/10/output.txt', 'utf8');

console.log('HTML size:', html.length);
// Extract categories or text from the page
const textPieces = html.match(/"([^"]{4,80})"/g) || [];
const incidentPieces = textPieces.filter(t => /incident|report|alert|marker|map|severity|safe|theft|hazard|police|fire/i.test(t));
console.log('Incident-related text pieces sample:', [...new Set(incidentPieces)].slice(0, 30));

// Look for inline JSON data (like Next.js data or state)
const scripts = html.match(/<script[^>]*>(.*?)<\/script>/gs) || [];
console.log('Scripts count:', scripts.length);
for (const s of scripts) {
  if (s.includes('category') || s.includes('incident') || s.includes('location') || s.includes('lat') || s.includes('lng')) {
    console.log('Interesting script snippet:', s.slice(0, 300));
  }
}
