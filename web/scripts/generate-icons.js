#!/usr/bin/env node

/**
 * Generate PWA icons from SVG for Canadian Music DNA
 * This script creates all required icon sizes for the PWA manifest
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon sizes required by the manifest
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple PNG icon generator (placeholder implementation)
// In a real scenario, you'd use a library like sharp or canvas to convert SVG to PNG
function createIconPNG(size) {
  // This is a placeholder - in production you'd use a proper image library
  // For now, we'll create a simple base64 PNG data URL
  const canvas = `
    <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f0f23;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a1a3a;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="512" height="512" rx="80" fill="url(#bgGradient)"/>
      
      <!-- Musical Note -->
      <g transform="translate(256, 180)">
        <!-- Note Head -->
        <ellipse cx="0" cy="0" rx="45" ry="35" fill="url(#accentGradient)"/>
        
        <!-- Note Stem -->
        <rect x="-8" y="-35" width="16" height="120" fill="url(#accentGradient)"/>
        
        <!-- Note Flag -->
        <path d="M 8 -35 Q 40 -20 8 -5" stroke="url(#accentGradient)" stroke-width="12" fill="none" stroke-linecap="round"/>
      </g>
      
      <!-- DNA Helix -->
      <g transform="translate(256, 256)" opacity="0.6">
        <!-- Left Helix -->
        <path d="M -60 0 Q -40 -40 -20 0 Q 0 40 20 0 Q 40 -40 60 0" 
              stroke="url(#accentGradient)" stroke-width="4" fill="none" stroke-linecap="round"/>
        
        <!-- Right Helix -->
        <path d="M -60 0 Q -40 40 -20 0 Q 0 -40 20 0 Q 40 40 60 0" 
              stroke="url(#accentGradient)" stroke-width="4" fill="none" stroke-linecap="round"/>
      </g>
      
      <!-- Canadian Maple Leaf (subtle) -->
      <g transform="translate(256, 380)" opacity="0.3">
        <path d="M 0 -20 L 8 -8 L 20 -8 L 12 0 L 16 12 L 0 4 L -16 12 L -12 0 L -20 -8 L -8 -8 Z" 
              fill="url(#accentGradient)"/>
      </g>
      
      <!-- Sparkles -->
      <g opacity="0.8">
        <circle cx="120" cy="120" r="3" fill="url(#accentGradient)"/>
        <circle cx="400" cy="150" r="2" fill="url(#accentGradient)"/>
        <circle cx="100" cy="350" r="2" fill="url(#accentGradient)"/>
        <circle cx="420" cy="380" r="3" fill="url(#accentGradient)"/>
        <circle cx="150" cy="400" r="2" fill="url(#accentGradient)"/>
        <circle cx="380" cy="100" r="2" fill="url(#accentGradient)"/>
      </g>
    </svg>
  `;
  
  return canvas;
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('🎨 Generating PWA icons...');

// Generate each icon size
iconSizes.forEach(size => {
  const svgContent = createIconPNG(size);
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  
  // For now, save as SVG (in production, convert to PNG)
  const svgFilename = `icon-${size}x${size}.svg`;
  const svgFilepath = path.join(iconsDir, svgFilename);
  
  fs.writeFileSync(svgFilepath, svgContent);
  console.log(`✅ Created ${svgFilename}`);
});

// Create shortcut icons
const shortcuts = [
  { name: 'quiz-shortcut', size: 96 },
  { name: 'dashboard-shortcut', size: 96 }
];

shortcuts.forEach(shortcut => {
  const svgContent = createIconPNG(shortcut.size);
  const filename = `${shortcut.name}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Created ${filename}`);
});

console.log('\n🎉 All icons generated successfully!');
console.log('📝 Note: These are SVG files. For production, convert to PNG using a tool like:');
console.log('   - Online: https://convertio.co/svg-png/');
console.log('   - CLI: npm install -g svg2png-cli && svg2png-cli public/icons/');
console.log('   - Node: npm install sharp && use sharp to convert SVG to PNG');
