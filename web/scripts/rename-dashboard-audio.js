const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../../Persona_playlists/Dashboard_playlist');
const destDir = path.join(__dirname, '../public/audio/dashboard-playlist');

// File mapping with simple names
const fileMapping = {
  // Radio
  'Radio → 18-34 → Strong Connection Song Turn the Dial.mp3': 'radio-18-34-strong.mp3',
  'Radio → 18-34 → Casual Listener Song Turn It Up.mp3': 'radio-18-34-casual.mp3',
  'Radio → 35-54 → Strong Connection Song Frequency Love.mp3': 'radio-35-54-strong.mp3',
  'Radio → 35-54 → Casual Listener Song Static Heartbeats.mp3': 'radio-35-54-casual.mp3',
  'Radio → 55+ → Strong Connection Song Golden Frequencies.mp3': 'radio-55plus-strong.mp3',
  'Radio → 55+ → Casual Listener Song On The Air.mp3': 'radio-55plus-casual.mp3',
  
  // Friends
  'Friends → 18-34 → Strong Connection Song All My Friends Are the Stars.mp3': 'friends-18-34-strong.mp3',
  'Friends → 18-34 → Casual Listener Song Friendship in Stereo.mp3': 'friends-18-34-casual.mp3',
  'Friends → 35-54 → Strong Connection Song Echoes of Us.mp3': 'friends-35-54-strong.mp3',
  'Friends → 35-54 → Casual Listener Song Echoes in the Hallway.mp3': 'friends-35-54-casual.mp3',
  'Friends → 55+ → Strong Connection Song Golden Days.mp3': 'friends-55plus-strong.mp3',
  'Friends → 55+ → Casual Listener Song Golden Years Groove.mp3': 'friends-55plus-casual.mp3',
  
  // Streaming
  'Streaming → 18-34 → Strong Connection Song Deep Dive.mp3': 'streaming-18-34-strong.mp3',
  'Streaming → 18-34 → Casual Listener Song Background Noise.mp3': 'streaming-18-34-casual.mp3',
  'Streaming → 35-54 → Strong Connection Song Waves of Discovery.mp3': 'streaming-35-54-strong.mp3',
  'Streaming → 35-54 → Casual Listener Song Easy Living.mp3': 'streaming-35-54-casual.mp3',
  'Streaming → 55+ → Strong Connection Song Golden Tides.mp3': 'streaming-55plus-strong.mp3',
  'Streaming → 55+ → Casual Listener Song Golden Days.mp3': 'streaming-55plus-casual.mp3',
  
  // Social Media
  'Social Media → 18-34 → Strong Connection Song Viral Harmony.mp3': 'social-18-34-strong.mp3',
  'Social Media → 18-34 → Casual Listener Song Digital Glow.mp3': 'social-18-34-casual.mp3',
  'Social Media → 35-54 → Strong Connection Song Echoes in the Feed.mp3': 'social-35-54-strong.mp3',
  'Social Media → 35-54 → Casual Listener Song Middle of the Feed.mp3': 'social-35-54-casual.mp3',
  'Social Media → 55+ → Strong Connection Song Echoes in the Scroll.mp3': 'social-55plus-strong.mp3',
  'Social Media → 55+ → Casual Listener Song Golden Hours.mp3': 'social-55plus-casual.mp3',
  
  // Concerts / Live events
  'Concerts → 18-34 → Strong Connection Song Rare Sparks.mp3': 'concerts-18-34-strong.mp3',
  'Concerts → 18-34 → Casual Listener Song Under the Neon Lights.mp3': 'concerts-18-34-casual.mp3',
  'Concerts → 35-54 → Strong Connection Song Live Sparks.mp3': 'concerts-35-54-strong.mp3',
  'Concerts → 35-54 → Casual Listener Song Dancing in the Dark.mp3': 'concerts-35-54-casual.mp3',
  'Concerts → 55+ → Strong Connection Song Echoes of the Night.mp3': 'concerts-55plus-strong.mp3',
  'Concerts → 55+ → Casual Listener Song Silver Echoes.mp3': 'concerts-55plus-casual.mp3',
  
  // Music Videos
  'Music Videos → 18-34 → Strong Connection Song Neon Frames.mp3': 'videos-18-34-strong.mp3',
  'Music Videos → 18-34 → Casual Listener Song Video Dreams.mp3': 'videos-18-34-casual.mp3',
  'Music Videos → 35-54 → Strong Connection Song Living Through the Lens.mp3': 'videos-35-54-strong.mp3',
  'Music Videos → 35-54 → Casual Listener Song Middle of the Road.mp3': 'videos-35-54-casual.mp3',
  'Music Videos → 55+ → Strong Connection Song Golden Hours.mp3': 'videos-55plus-strong.mp3',
  'Music Videos → 55+ → Casual Listener Song No Influence.mp3': 'videos-55plus-casual.mp3'
};

// Ensure destination directory exists
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}
fs.mkdirSync(destDir, { recursive: true });

console.log('📁 Copying and renaming audio files...\n');

let successCount = 0;
let errorCount = 0;

Object.entries(fileMapping).forEach(([oldName, newName]) => {
  const sourcePath = path.join(sourceDir, oldName);
  const destPath = path.join(destDir, newName);
  
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ ${oldName}`);
      console.log(`   → ${newName}\n`);
      successCount++;
    } else {
      console.log(`❌ Source file not found: ${oldName}\n`);
      errorCount++;
    }
  } catch (err) {
    console.log(`❌ Error copying ${oldName}: ${err.message}\n`);
    errorCount++;
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ Successfully copied: ${successCount} files`);
console.log(`❌ Errors: ${errorCount} files`);
console.log(`📁 Destination: ${destDir}`);
console.log(`${'='.repeat(60)}\n`);

