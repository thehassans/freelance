import fs from 'fs';
const content = fs.readFileSync('src/lib/tools-registry.ts', 'utf8');
const updated = content.replace(/tier:\s*'PRO'/g, "tier: 'FREEMIUM'").replace(/tier:\s*'PREMIUM'/g, "tier: 'FREEMIUM'");
fs.writeFileSync('src/lib/tools-registry.ts', updated);
