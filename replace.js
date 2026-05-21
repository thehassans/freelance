import fs from 'fs';
let content = fs.readFileSync('src/components/tools/FbAdsCalculator.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
fs.writeFileSync('src/components/tools/FbAdsCalculator.tsx', content);
