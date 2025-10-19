const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../../Persona_playlists/Dashboard_playlist');
const destDir = path.join(__dirname, '../public/audio/dashboard-playlist');

// Ensure destination exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Read all files
const files = fs.readdirSync(sourceDir);

console.log(`📂 Found ${files.length} files to process`);

files.forEach(filename => {
  if (filename.endsWith('.mp3')) {
    // Replace arrow with hyphen
    const newName = filename.replace(/→/g, '-');
    
    const sourcePath = path.join(sourceDir, filename);
    const destPath = path.join(destDir, newName);
    
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ ${filename}`);
    console.log(`   → ${newName}`);
  }
});

const copiedCount = fs.readdirSync(destDir).length;
console.log(`\n✅ Successfully copied ${copiedCount} audio files!`);

