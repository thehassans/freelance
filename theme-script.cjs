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
files.push('src/components/ui/auth-page.tsx');

const replacements = [
  { regex: /bg-\[#0B0C14\]/g, replace: 'bg-slate-50' },
  { regex: /bg-\[#13192B\]/g, replace: 'bg-white' },
  { regex: /bg-\[#1C2340\]/g, replace: 'bg-slate-100' },
  { regex: /border-\[#252E4A\]/g, replace: 'border-slate-200' },
  { regex: /text-\[#E8EAF0\]/g, replace: 'text-slate-900' },
  { regex: /text-\[#6EE7B7\]/g, replace: 'text-primary' },
  { regex: /bg-\[#6EE7B7\]/g, replace: 'bg-primary' },
  { regex: /text-\[#6B7280\]/g, replace: 'text-slate-500' },
  { regex: /text-\[#0B0C14\]/g, replace: 'text-white' },
  { regex: /hover:bg-\[#6EE7B7\]\/90/g, replace: 'hover:bg-primary/90' },
  // Remove dark: variants in auth-page
  { regex: /dark:bg-\[#[0-9A-Fa-f]+\]/g, replace: '' },
  { regex: /dark:text-\w+/g, replace: '' },
  { regex: /dark:border-\[#[0-9A-Fa-f]+\]/g, replace: '' },
  { regex: /dark:invert/g, replace: '' },
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
