import fs from 'fs';
import path from 'path';

const toolsDir = path.join(process.cwd(), 'src/components/tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.tsx'));

console.log(`Found ${files.length} tools`);
