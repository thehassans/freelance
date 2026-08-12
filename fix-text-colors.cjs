const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('src/components/admin').filter(f => f.endsWith('.tsx'));

const replacements = [
  // Fix text colors in inputs, selects, textareas that have light backgrounds
  { regex: /(<input[^>]*className="[^"]*bg-(white|slate-[0-9]+)[^"]*)text-white([^"]*")/g, replace: '$1text-slate-900$3' },
  { regex: /(<textarea[^>]*className="[^"]*bg-(white|slate-[0-9]+)[^"]*)text-white([^"]*")/g, replace: '$1text-slate-900$3' },
  { regex: /(<select[^>]*className="[^"]*bg-(white|slate-[0-9]+)[^"]*)text-white([^"]*")/g, replace: '$1text-slate-900$3' },
  // Fix specific modal labels and headers that were left as text-white
  { regex: /(<label[^>]*className="[^"]*)text-white([^"]*")/g, replace: '$1text-slate-700$2' },
  { regex: /(<h2[^>]*className="[^"]*)text-white([^"]*")/g, replace: '$1text-slate-900$2' },
  { regex: /(<h3[^>]*className="[^"]*)text-white([^"]*")/g, replace: '$1text-slate-900$2' },
  { regex: /(<h1[^>]*className="[^"]*)text-white([^"]*")/g, replace: '$1text-slate-900$2' },
  { regex: /(<div[^>]*className="text-4xl font-bold )text-white([^"]*")/g, replace: '$1text-slate-900$2' },
  { regex: /(<div[^>]*className="text-4xl font-black )text-white([^"]*")/g, replace: '$1text-slate-900$2' },
  // Fix the "Subscriptions Panel" specific headings
  { regex: /text-white/g, skipIf: /(bg-primary|bg-indigo|bg-\[\#252E4A\]|text-white)/, specialHandling: true }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // First pass: specific element replacements
  replacements.slice(0, 9).forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });

  // Second pass: catch-all text-white to text-slate-900 for generic divs in views, EXCEPT if they are inside buttons or badges with dark backgrounds.
  // Actually, let's just do a manual replace for ToolsView and MiscViews and SubscriptionsView where text-white is problematic.
  // For safety, let's just replace all "text-white" with "text-slate-900" UNLESS the line contains "bg-primary" or "bg-[#252E4A]" or "bg-indigo" or "bg-slate-900" or "bg-emerald" or "bg-rose".
  
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('text-white')) {
      if (!/(bg-primary|bg-\[\#252E4A\]|bg-indigo|bg-slate-900|bg-emerald|bg-rose|bg-amber)/.test(lines[i])) {
         lines[i] = lines[i].replace(/text-white/g, 'text-slate-900');
      }
    }
  }
  content = lines.join('\n');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
