#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Building InvestSmart AI for deployment...');

// Create public directory
if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
}

// Copy client files to public
const clientFiles = ['index.html', 'style.css', 'app.js'];

clientFiles.forEach(file => {
    const srcPath = path.join('client', file);
    const destPath = path.join('public', file);
    
    if (fs.existsSync(srcPath)) {
        let content = fs.readFileSync(srcPath, 'utf8');
        
        // If it's app.js, update API URLs for deployment
        if (file === 'app.js') {
            // Add API base URL detection at the top of the file
            const apiBaseUrlCode = `
// API Base URL configuration - detects environment
const API_BASE_URL = window.location.hostname === 'localhost' ? 
    'http://localhost:3000' : 
    window.location.origin;

`;
            
            // Insert after the first line (DOMContentLoaded event listener)
            const lines = content.split('\n');
            lines.splice(3, 0, apiBaseUrlCode);
            content = lines.join('\n');
            
            // Replace all localhost API URLs
            content = content.replace(/http:\/\/localhost:3000/g, '${API_BASE_URL}');
        }
        
        fs.writeFileSync(destPath, content);
        console.log(`✅ Copied ${file} to public/`);
    } else {
        console.log(`⚠️  Warning: ${file} not found in client/`);
    }
});

// Create a simple index.html fallback if it doesn't exist
if (!fs.existsSync('public/index.html')) {
    const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InvestSmart AI</title>
</head>
<body>
    <h1>InvestSmart AI</h1>
    <p>Building...</p>
</body>
</html>`;
    fs.writeFileSync('public/index.html', fallbackHtml);
    console.log('✅ Created fallback index.html');
}

console.log('✨ Build completed successfully!');
console.log('📁 Files ready in public/ directory');
console.log('🌐 Ready for deployment to Vercel, Netlify, Render, or other platforms');