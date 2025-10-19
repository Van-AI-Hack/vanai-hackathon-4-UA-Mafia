# 🎵 Flow Audio Mapping Verification

## Discovery Methods in Survey Data:

Based on `web/public/data/processed/survey_data.json`:

| Discovery Method | Responses | Has Audio? | Maps To | Audio Files |
|-----------------|-----------|------------|---------|-------------|
| **"The radio 📻"** | 571 (56.8%) | ✅ YES | Radio | radio-1.mp3 to radio-6.mp3 |
| **"Family or friends"** | 161 (16.0%) | ✅ YES | Friends | friends-1.mp3 to friends-6.mp3 |
| **"Watching MuchMusic or MTV"** | 70 (7.0%) | ✅ YES | Concerts/Videos | concerts-1.mp3 to concerts-6.mp3 |
| **"Burned CDs or vinyl"** | 69 (6.9%) | ❌ NO | N/A | Will use random fallback |
| **"Something else"** | 53 (5.3%) | ❌ NO | N/A | Will use random fallback |
| **"Spotify or Apple Music"** | 50 (5.0%) | ✅ YES | Streaming | streaming-1.mp3 to streaming-6.mp3 |
| **"LimeWire or Napster"** | 23 (2.3%) | ❌ NO | N/A | Will use random fallback |
| **"TikTok or social media"** | 9 (0.9%) | ✅ YES | Social Media | social-1.mp3 to social-6.mp3 |

## Audio File Inventory:

All 36 files renamed and verified:

### Radio (6 files):
- radio-1.mp3 (2.9 MB) - 18-34 Casual
- radio-2.mp3 (3.7 MB) - 18-34 Strong  ✅ Used for Radio → 18-34
- radio-3.mp3 (2.9 MB) - 35-54 Casual
- radio-4.mp3 (3.8 MB) - 35-54 Strong  ✅ Used for Radio → 35-54
- radio-5.mp3 (4.9 MB) - 55+ Casual
- radio-6.mp3 (No size shown) - 55+ Strong  ✅ Used for Radio → 55+

### Friends (6 files):
- friends-1.mp3 (2.6 MB) - 18-34 Casual
- friends-2.mp3 (3.3 MB) - 18-34 Strong  ✅ Used for Friends → 18-34
- friends-3.mp3 (3.5 MB) - 35-54 Casual
- friends-4.mp3 (4.2 MB) - 35-54 Strong  ✅ Used for Friends → 35-54
- friends-5.mp3 (2.9 MB) - 55+ Casual
- friends-6.mp3 (4.5 MB) - 55+ Strong  ✅ Used for Friends → 55+

### Streaming (6 files):
- streaming-1.mp3 (3.3 MB) - 18-34 Casual
- streaming-2.mp3 (2.8 MB) - 18-34 Strong  ✅ Used for Streaming → 18-34
- streaming-3.mp3 (4.1 MB) - 35-54 Casual
- streaming-4.mp3 (4.2 MB) - 35-54 Strong  ✅ Used for Streaming → 35-54
- streaming-5.mp3 (5.1 MB) - 55+ Casual
- streaming-6.mp3 (5.3 MB) - 55+ Strong  ✅ Used for Streaming → 55+

### Social Media (6 files):
- social-1.mp3 (2.8 MB) - 18-34 Casual
- social-2.mp3 (4.4 MB) - 18-34 Strong  ✅ Used for Social → 18-34
- social-3.mp3 (3.0 MB) - 35-54 Casual
- social-4.mp3 (3.3 MB) - 35-54 Strong  ✅ Used for Social → 35-54
- social-5.mp3 (4.4 MB) - 55+ Casual
- social-6.mp3 (3.4 MB) - 55+ Strong  ✅ Used for Social → 55+

### Concerts (6 files):
- concerts-1.mp3 (4.1 MB) - 18-34 Casual
- concerts-2.mp3 (4.7 MB) - 18-34 Strong  ✅ Used for Concerts/MTV → 18-34
- concerts-3.mp3 (5.1 MB) - 35-54 Casual
- concerts-4.mp3 (4.2 MB) - 35-54 Strong  ✅ Used for Concerts/MTV → 35-54
- concerts-5.mp3 (3.3 MB) - 55+ Casual
- concerts-6.mp3 (3.9 MB) - 55+ Strong  ✅ Used for Concerts/MTV → 55+

### Videos (6 files) - NOT CURRENTLY USED:
- videos-1.mp3 to videos-6.mp3

## Flow Mapping Logic:

### Label Detection (from Sankey diagram):
```
"The radio 📻<br>571 (56.8%)" → Cleaned → "the radio"
"Family or friends<br>161 (16.0%)" → Cleaned → "family or friends"  
"Spotify or Apple Music<br>50 (5.0%)" → Cleaned → "spotify or apple music"
"TikTok or social media<br>9 (0.9%)" → Cleaned → "tiktok or social media"
"Watching MuchMusic or MTV<br>70 (7.0%)" → Cleaned → "watching muchmusic or mtv"
```

### Audio Mappings:
```typescript
{
  'Radio': {
    '18-34': 'radio-2.mp3',
    '35-54': 'radio-4.mp3',
    '55+': 'radio-6.mp3'
  },
  'Friends and family recommendations': {
    '18-34': 'friends-2.mp3',
    '35-54': 'friends-4.mp3',
    '55+': 'friends-6.mp3'
  },
  'Streaming service recommendations': {
    '18-34': 'streaming-2.mp3',
    '35-54': 'streaming-4.mp3',
    '55+': 'streaming-6.mp3'
  },
  'Social media': {
    '18-34': 'social-2.mp3',
    '35-54': 'social-4.mp3',
    '55+': 'social-6.mp3'
  },
  'Live events and concerts': {
    '18-34': 'concerts-2.mp3',
    '35-54': 'concerts-4.mp3',
    '55+': 'concerts-6.mp3'
  }
}
```

## Expected Behavior:

### ✅ SHOULD PLAY AUDIO:
1. **"The radio 📻" → 18-34** → radio-2.mp3
2. **"The radio 📻" → 35-54** → radio-4.mp3
3. **"The radio 📻" → 55 Plus** → radio-6.mp3
4. **"Family or friends" → 18-34** → friends-2.mp3
5. **"Family or friends" → 35-54** → friends-4.mp3
6. **"Family or friends" → 55 Plus** → friends-6.mp3
7. **"Spotify or Apple Music" → 18-34** → streaming-2.mp3
8. **"Spotify or Apple Music" → 35-54** → streaming-4.mp3
9. **"Spotify or Apple Music" → 55 Plus** → streaming-6.mp3
10. **"TikTok or social media" → 18-34** → social-2.mp3
11. **"TikTok or social media" → 35-54** → social-4.mp3
12. **"TikTok or social media" → 55 Plus** → social-6.mp3
13. **"Watching MuchMusic or MTV" → 18-34** → concerts-2.mp3
14. **"Watching MuchMusic or MTV" → 35-54** → concerts-4.mp3
15. **"Watching MuchMusic or MTV" → 55 Plus** → concerts-6.mp3

### ❌ WON'T PLAY AUDIO (uses random fallback):
- "Burned CDs or vinyl" → (any age) → random file
- "Something else" → (any age) → random file
- "LimeWire or Napster" → (any age) → random file

### ❌ WON'T TRIGGER AUDIO (second-tier flows):
- 18-34 → Strong Connection
- 18-34 → Casual Listener
- 35-54 → Strong Connection
- 35-54 → Casual Listener
- 55 Plus → Strong Connection
- 55 Plus → Casual Listener

## Testing Checklist:

- [ ] Radio → 55 Plus ✅ CONFIRMED WORKING
- [ ] Radio → 35-54
- [ ] Radio → 18-34
- [ ] Family or friends → 55 Plus
- [ ] Family or friends → 35-54
- [ ] Family or friends → 18-34
- [ ] Spotify/Apple Music → 55 Plus
- [ ] Spotify/Apple Music → 35-54
- [ ] Spotify/Apple Music → 18-34
- [ ] TikTok/social media → all ages
- [ ] MuchMusic/MTV → all ages

## Current Status:

✅ Files renamed successfully (36 files)
✅ Detection logic updated with all survey methods
✅ Audio loading with `canplay` event (prevents abort errors)
✅ Safe stop function (checks readyState)
✅ Random fallback for unmapped methods
✅ Radio → 55+ confirmed working

**Next: Test remaining flows in browser!**

