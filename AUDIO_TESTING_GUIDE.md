# 🎵 Audio Testing & Debugging Guide

## Latest Changes Applied:

### ✅ **Enhanced Event Tracking:**
- Added local `currentHoveredMethod` tracking in Plotly events
- Multiple event listeners: `plotly_hover`, `plotly_unhover`, `mouseleave`, `mousemove`
- Hover timeout detection (100ms) to catch when mouse leaves without triggering unhover

### ✅ **Aggressive Audio Stopping:**
- Clears ALL fade intervals and timeouts
- Disables audio loop before stopping
- Forces audio source removal (`src = ''`)
- Calls `.load()` to reset audio element completely

### ✅ **Better Detection Logic:**
- Only plays audio for first-tier flows (Discovery Method → Age Group)
- Ignores second-tier flows (Age Group → Music Relationship)
- Enhanced console logging for debugging

---

## 🧪 Testing Instructions:

### 1. **Open Browser**
```
http://localhost:5174/
```

### 2. **Open Console** (F12 → Console tab)

### 3. **Complete Quiz** and navigate to Dashboard

### 4. **Go to "Music Discovery Patterns"** section

### 5. **Test Each Discovery Method:**

#### Test flows (hover over the lines/flows, NOT the boxes/nodes):

1. **Radio → 18-34** flow
2. **Radio → 35-54** flow  
3. **Radio → 55+** flow
4. **Friends and family recommendations → Any age** flow
5. **Streaming service recommendations → Any age** flow
6. **Social media → Any age** flow
7. **Live events and concerts → Any age** flow

### 6. **What to Check:**

✅ **Audio starts** when hovering over a flow from a discovery method  
✅ **Audio stops IMMEDIATELY** when moving mouse away  
✅ **Only ONE audio** plays at a time  
✅ **No audio** when hovering over second-tier flows (Age → Music Relationship)  
✅ **Smooth transitions** when moving between different discovery method flows  

---

## 📋 Expected Console Output:

### **On Page Load:**
```
🎵 Dashboard Audio Manager initialized
🎬 Initializing Sankey diagram with audio events
✅ Audio events initialized successfully
```

### **When Hovering Radio Flow:**
```
🔍 Hover point data: {curveNumber: 0, pointNumber: X, hasSource: true, hasTarget: true}
✅ Hovering over a link/flow!
   Source label: Radio
   Target label: 35-54
🎵 Direct match - Discovery method: Radio
📍 Hover event - Method detected: Radio
▶️ Playing audio for discovery method: Radio
🛑 Stopping audio - pausing, resetting time, removing reference
✅ Dashboard audio stopped completely
🎵 Playing: Static Heartbeats (Radio - 35-54 - Casual Listener)
```

### **When Moving Mouse Away:**
```
📍 Unhover event - stopping audio
⏹️ Stopping discovery method audio (was playing: Radio)
🛑 Stopping audio - pausing, resetting time, removing reference
✅ Dashboard audio stopped completely
```

### **When Moving to Different Flow:**
```
📍 Hover event - Method detected: Streaming service recommendations
🔄 Switching from Radio to Streaming service recommendations
🛑 Stopping audio - pausing, resetting time, removing reference
✅ Dashboard audio stopped completely
▶️ Playing audio for discovery method: Streaming service recommendations
```

---

## 🚨 Emergency Stop:

If audio won't stop, open console and run:
```javascript
window.__forceStopDashboardAudio()
```

This will forcefully stop all audio.

---

## 🐛 Common Issues & Solutions:

### **Issue: Audio keeps playing after moving mouse away**

**Debug:**
1. Check console - is `📍 Unhover event` being logged?
2. Check console - is `🛑 Stopping audio` being logged?
3. Try moving mouse completely outside the chart area
4. Try clicking elsewhere on the page

**If unhover event is NOT logged:**
- The Plotly unhover event might not be firing
- The `mouseleave` or `mousemove` timeout should catch it
- Try moving mouse more slowly

**If unhover IS logged but audio continues:**
- Open console and check for any errors
- Run emergency stop: `window.__forceStopDashboardAudio()`
- Check if multiple audio elements exist (browser DevTools → Elements → search for `<audio>`)

### **Issue: Multiple songs playing at once**

**Debug:**
1. Check console for multiple `▶️ Playing audio` messages
2. Should see `🔄 Switching from X to Y` when changing flows
3. Should see `🛑 Stopping audio` before new audio starts

**Solution:**
- The code now explicitly stops previous audio before starting new one
- Check console for any errors during audio play

### **Issue: Wrong song playing**

**Debug:**
1. Check console - what's the detected discovery method?
2. Check console - what song is playing? (shows title, method, age, relationship)
3. Verify your quiz answers (age group, music relationship)

**Song Selection Logic:**
- Uses your age group from quiz
- Uses your music relationship (obsessive/important = Strong Connection, casual = Casual Listener)
- If no exact match, falls back to any available song for that discovery method

### **Issue: No audio at all**

**Debug:**
1. Check console for `❌` error messages
2. Check browser audio permissions
3. Check if audio files exist: `/audio/dashboard-playlist/`
4. Try clicking on a flow instead of hovering

**Solutions:**
- Ensure browser allows autoplay
- Check Network tab for 404 errors on audio files
- Verify audio files are in `web/public/audio/dashboard-playlist/`

---

## 📊 Audio File Mapping:

All 36 audio files are mapped as:
```
[Discovery Method] → [Age Group] → [Music Relationship] → [Song]
```

Example:
- Radio → 35-54 → Casual Listener → "Static Heartbeats"
- Radio → 35-54 → Strong Connection → "Frequency Love"
- Streaming → 18-34 → Casual Listener → "Background Noise"
- Friends → 55+ → Strong Connection → "Golden Days"

---

## ✅ What Should Work Now:

1. ✅ Hover over discovery method flows → Audio plays
2. ✅ Move mouse away → Audio stops immediately
3. ✅ Only one audio at a time
4. ✅ Context-aware song selection based on quiz
5. ✅ Visual indicator shows currently playing method
6. ✅ Emergency stop function available
7. ✅ Multiple event listeners for reliability
8. ✅ Hover timeout detection (100ms)
9. ✅ Aggressive audio cleanup
10. ✅ Enhanced logging for debugging

---

## 🎯 Next Steps:

1. **Test in browser** - Follow testing instructions above
2. **Copy console output** - Share any error messages or unexpected behavior
3. **Describe what happens** - What works? What doesn't?
4. **Check timing** - Does audio stop after 100ms? Immediately? Never?

This will help us pinpoint exactly what's happening!

