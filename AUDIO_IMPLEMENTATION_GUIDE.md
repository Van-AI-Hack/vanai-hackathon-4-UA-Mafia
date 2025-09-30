# Audio Implementation Guide 🎵

## Overview

The Canadian Music DNA platform now features a comprehensive audio system that enhances user engagement through:
- **Persona-specific ambient music** (AI-generated soundscapes)
- **Interactive sound effects** (hover, click, transitions)
- **Beautiful audio player controls** with volume management
- **Automatic playback** on persona reveal

---

## Features Implemented ✨

### 1. Audio Manager (`src/utils/audioManager.ts`)
Central audio management system that handles:
- Background ambient music for each persona
- Sound effects library
- Volume and mute controls
- Web Audio API fallback for missing files
- LocalStorage preferences persistence

### 2. Audio Player Component (`src/components/AudioPlayer.tsx`)
Beautiful, animated audio player with:
- Play/pause controls
- Volume slider (shows on hover)
- Mute toggle
- Visual feedback (glowing effects when playing)
- Persona-themed colors
- Music note animations

### 3. Sound Effects Integration
Enhanced user interactions across:
- **IntroScreen**: Hover and click effects on start button
- **PersonaQuiz**: Hover on options, click on answers, navigation sounds
- **PersonaResult**: All button interactions with audio feedback
- **Transitions**: Special sound when advancing questions

---

## How to Add AI-Generated Music 🎨

### Option 1: Using Suno or Udio

1. **Generate Music for Each Persona**
   - Go to [Suno](https://suno.ai) or [Udio](https://udio.com)
   - Create 5 ambient tracks (one per persona)
   - Prompt examples:
     ```
     Persona 0: "Nostalgic ambient waves, gentle radio-style background music"
     Persona 1: "Digital discovery ambient, modern streaming vibes"
     Persona 2: "Traditional harmony ambient, classic Canadian music feel"
     Persona 3: "Future beats ambient, AI-influenced electronic soundscape"
     Persona 4: "Social vibes ambient, party-ready background music"
     ```

2. **Export and Add Files**
   ```bash
   # Create audio directory structure
   mkdir -p web/public/audio/ambient
   mkdir -p web/public/audio/sfx
   
   # Add your generated tracks
   # Place files in: web/public/audio/ambient/
   # - nostalgic-waves.mp3
   # - digital-discovery.mp3
   # - traditional-harmony.mp3
   # - future-beats.mp3
   # - social-vibes.mp3
   ```

3. **Files Are Auto-Loaded**
   - The `audioManager.ts` already references these paths
   - No code changes needed!
   - Files will auto-play when user sees their persona

### Option 2: Using ElevenLabs for Narration

Add voice narration to enhance the experience:

1. **Generate Persona Descriptions**
   ```typescript
   // web/src/utils/audioManager.ts
   export const personaNarrations: Record<number, string> = {
     0: '/audio/narration/persona-0.mp3',
     1: '/audio/narration/persona-1.mp3',
     // ... etc
   }
   ```

2. **Create Narrations**
   - Use ElevenLabs to narrate each persona description
   - Export as MP3
   - Place in `web/public/audio/narration/`

### Option 3: Sound Effects Library

For professional sound effects:

1. **Download from Free Sources**
   - [Freesound.org](https://freesound.org)
   - [Zapsplat.com](https://zapsplat.com)
   - [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/)

2. **Add to Project**
   ```bash
   # Place in web/public/audio/sfx/
   click.mp3          # Button click
   hover.mp3          # Hover effect
   success.mp3        # Success notification
   transition.mp3     # Page transitions
   persona-reveal.mp3 # Persona reveal fanfare
   notification.mp3   # General notification
   ```

---

## Current Behavior (Without Audio Files)

The system has **intelligent fallbacks**:

### Fallback 1: Web Audio API
If audio files are missing, the system generates simple ambient tones using the Web Audio API:
- Different frequencies for different personas
- Sine wave oscillators for ambient sound
- Auto-fades in/out smoothly

### Fallback 2: Procedural Sound Effects
If sound effect files are missing, generates beeps:
- Different frequencies for different actions
- Short duration (0.1s)
- Non-intrusive

**Result:** Audio experience works even without files! Users can still:
- Toggle mute/unmute
- Adjust volume
- Enjoy interactive feedback

---

## Testing the Audio System

### 1. Test in Browser
```bash
cd web
npm run dev
```

### 2. Check Audio Playback
1. Open http://localhost:5173
2. Click "Discover Your Music DNA"
3. Listen for hover/click sounds
4. Complete quiz
5. Persona result page will auto-play ambient music
6. Test volume controls
7. Test mute toggle

### 3. Test Persistence
- Mute audio
- Refresh page
- Audio should remain muted (saved in localStorage)

---

## Customization Guide

### Change Persona Music Mapping

Edit `web/src/utils/audioManager.ts`:

```typescript
export const personaMusicThemes: Record<number, string> = {
  0: '/audio/ambient/your-custom-track-0.mp3',
  1: '/audio/ambient/your-custom-track-1.mp3',
  // Add more personas
}
```

### Adjust Default Volume

```typescript
// In audioManager.ts constructor
private volume: number = 0.3  // Change from 0.5 to 0.3 (30%)
```

### Disable Auto-play

In `web/src/components/PersonaResult.tsx`:

```typescript
<AudioPlayer
  personaId={persona.id}
  personaName={persona.name}
  personaColor={persona.color}
  autoPlay={false}  // Changed from true
  showMusicNote={true}
/>
```

### Add More Sound Effects

1. Define in audioManager:
```typescript
export const soundEffects = {
  click: '/audio/sfx/click.mp3',
  hover: '/audio/sfx/hover.mp3',
  customEffect: '/audio/sfx/my-effect.mp3', // NEW
}
```

2. Use anywhere:
```typescript
import audioManager from '../utils/audioManager'

audioManager.playSoundEffect('customEffect')
```

---

## Browser Compatibility

### Autoplay Policy
Modern browsers block autoplay. The system handles this by:
1. Trying to play audio
2. If blocked, falls back to Web Audio API
3. Requires user interaction before sound plays

### Supported Browsers
- ✅ Chrome/Edge (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Opera (76+)

### Audio Format Support
Recommended format: **MP3** (universal support)
Alternative: **OGG** or **WAV**

---

## Performance Tips

### 1. Optimize Audio Files
```bash
# Compress MP3 files
ffmpeg -i input.mp3 -b:a 128k output.mp3

# Reduce length (ambient music: 2-3 minutes is enough if looping)
ffmpeg -i input.mp3 -t 180 -c copy output.mp3
```

### 2. Lazy Loading
Audio files only load when needed:
- Background music: loads on persona reveal
- Sound effects: load on first use (cached afterward)

### 3. Cleanup
Audio manager automatically cleans up:
- Stops music when component unmounts
- Releases Web Audio API resources
- Clears cached sound effects

---

## Demo Mode for Hackathon

Want to showcase the audio without generating 5 tracks? Create ONE versatile ambient track and reuse it:

```typescript
// In audioManager.ts
export const personaMusicThemes: Record<number, string> = {
  0: '/audio/ambient/universal-ambient.mp3',
  1: '/audio/ambient/universal-ambient.mp3',
  2: '/audio/ambient/universal-ambient.mp3',
  3: '/audio/ambient/universal-ambient.mp3',
  4: '/audio/ambient/universal-ambient.mp3',
}
```

Or use the procedural audio (already works!):
- Each persona gets a different frequency
- No files needed
- Perfect for rapid prototyping

---

## Troubleshooting

### Audio Not Playing?
1. Check browser console for errors
2. Verify file paths in `audioManager.ts`
3. Ensure files exist in `/public/audio/`
4. Try clicking mute/unmute button
5. Check browser autoplay settings

### Volume Too Low?
```typescript
audioManager.setVolume(0.8)  // 80%
```

### No Sound Effects?
- System uses Web Audio API fallback
- Works even without MP3 files
- Check if muted in audio player

---

## Next Steps for Hackathon 🚀

### Quick Wins:
1. ✅ **Use existing system** - Already generates ambient tones!
2. 🎵 **Add 1 ambient track** - Universal background music
3. 🔊 **Add basic sound effects** - Download 5-6 free SFX

### Advanced:
1. 🎨 **Generate 5 persona tracks** with Suno/Udio
2. 🎙️ **Add voice narration** with ElevenLabs
3. 📊 **Audio visualizer** - Add WebGL/Canvas visualization

### Demo Tips:
- **Enable audio early** in demo to show feature
- **Show volume controls** hovering over player
- **Demonstrate sound effects** by clicking buttons
- **Explain fallback system** - works without files!

---

## File Structure

```
web/
├── public/
│   └── audio/
│       ├── ambient/        # Background music
│       │   ├── nostalgic-waves.mp3
│       │   ├── digital-discovery.mp3
│       │   └── ...
│       ├── sfx/           # Sound effects
│       │   ├── click.mp3
│       │   ├── hover.mp3
│       │   └── ...
│       └── narration/     # Optional voice narration
│           └── ...
├── src/
│   ├── utils/
│   │   └── audioManager.ts    # Core audio system
│   └── components/
│       └── AudioPlayer.tsx    # UI component
```

---

## Credits

- **Audio System**: Custom implementation
- **Fallback Generation**: Web Audio API
- **UI Design**: Framer Motion animations
- **Suggested Tools**: Suno, Udio, ElevenLabs

---

**Ready to enhance your hackathon submission with immersive audio! 🎵✨**
