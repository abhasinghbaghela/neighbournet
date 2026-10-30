const fs = require('fs');
const path = require('path');

const extractDir = 'C:/Users/adv danish/.gemini/antigravity/scratch/neighbournet/prototype_extracts';

console.log('=== ANALYZING CIVICQUEST ===');
try {
  const cq = fs.readFileSync(path.join(extractDir, 'civicquest_bundle.js'), 'utf8');
  console.log('CivicQuest bundle size:', cq.length);

  // Search Supabase
  const sbUrlMatch = cq.match(/https:\/\/[a-z0-9-]+\.supabase\.co/g);
  console.log('Supabase URLs:', sbUrlMatch);

  // Search Firebase
  const fbMatches = cq.match(/firebase[a-zA-Z0-9_.]*/gi);
  console.log('Firebase mentions sample:', fbMatches ? fbMatches.slice(0, 10) : 'none');

  // Search for Gemini / OpenAI
  const aiMatches = cq.match(/(gemini|generativeai|openai|claude|groq)/gi);
  console.log('AI provider mentions:', aiMatches ? [...new Set(aiMatches)] : 'none');

  // Search for routes or view names
  const routeMatches = cq.match(/path:\s*["']([^"']+)["']/g) || [];
  console.log('Route paths found:', [...new Set(routeMatches)].slice(0, 20));

  // Search for common UI text / pages
  const textMatches = cq.match(/["']([A-Z][a-zA-Z0-9\s]{3,30})["']/g) || [];
  const uniqueTexts = [...new Set(textMatches.map(s => s.replace(/["']/g, '')))]
    .filter(s => s.includes('Report') || s.includes('Feed') || s.includes('Dashboard') || s.includes('Map') || s.includes('Quest') || s.includes('Badge') || s.includes('Points') || s.includes('Leaderboard') || s.includes('Health') || s.includes('Incident') || s.includes('Verify'));
  console.log('Key UI Texts / Feature clues:', uniqueTexts.slice(0, 30));

  // Search for table names (e.g. .from('...'))
  const tableMatches = cq.match(/\.from\(["']([a-zA-Z0-9_]+)["']\)/g) || [];
  console.log('Supabase tables referenced:', [...new Set(tableMatches)]);

} catch (e) {
  console.error('Error analyzing CQ:', e.message);
}

console.log('\n=== ANALYZING ICEMAP ===');
try {
  const icemapDir = path.join(extractDir, 'icemap');
  const files = fs.readdirSync(icemapDir);
  for (const f of files) {
    if (!f.endsWith('.js')) continue;
    const content = fs.readFileSync(path.join(icemapDir, f), 'utf8');
    
    // Check interesting keywords
    const matches = content.match(/(category|severity|upvote|confirm|verify|duplicate|heatmap|leaflet|mapbox|incident|cluster|anonymous)/gi);
    if (matches && matches.length > 5) {
      console.log(`File ${f} (${content.length} chars) - incident/map keyword count: ${matches.length}`);
      
      // Look for categories list
      const catLists = content.match(/\[(?:["'][a-zA-Z0-9\s_-]+["'],\s*){3,}[^\]]+\]/g);
      if (catLists) {
        console.log(`  Sample array literals in ${f}:`, catLists.slice(0, 3));
      }
      
      // Look for endpoints
      const apiCalls = content.match(/\/api\/[a-zA-Z0-9_\-\/]+/g);
      if (apiCalls) {
        console.log(`  API endpoints in ${f}:`, [...new Set(apiCalls)]);
      }
    }
  }
} catch (e) {
  console.error('Error analyzing icemap:', e.message);
}
