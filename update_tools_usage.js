import fs from 'fs';

let content = fs.readFileSync('src/lib/tools-registry.ts', 'utf8');

// Function to replace each tool definition
let newContent = content.replace(/monthlyViews:\s*\d+/g, (match) => {
    // Generate random usageCount
    const usageCount = Math.floor(Math.random() * 5000) + 100;
    // Assign a random audience
    const audiences = ["Solo Freelancer", "Dev Agency", "Creative Studio"];
    const audience = audiences[Math.floor(Math.random() * audiences.length)];
    
    return `${match},\n    usageCount: ${usageCount},\n    audience: '${audience}'`;
});

fs.writeFileSync('src/lib/tools-registry.ts', newContent);
