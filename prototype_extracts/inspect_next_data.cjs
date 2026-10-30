const fs = require('fs');
const html = fs.readFileSync('C:/Users/adv danish/.gemini/antigravity/brain/e8a502e2-77e4-488c-aa58-6bdc2663bfc3/.system_generated/steps/10/output.txt', 'utf8');

const nextPushes = [...html.matchAll(/self\.__next_f\.push\(\[1,"(.*?)"\]\)/g)];
console.log('Next pushes count:', nextPushes.length);
for (const match of nextPushes) {
  const unescaped = match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\u003c/g, '<').replace(/\\u003e/g, '>');
  if (unescaped.includes('category') || unescaped.includes('incident') || unescaped.includes('map') || unescaped.includes('api')) {
    console.log('--- Segment snippet ---');
    console.log(unescaped.slice(0, 500));
  }
}
