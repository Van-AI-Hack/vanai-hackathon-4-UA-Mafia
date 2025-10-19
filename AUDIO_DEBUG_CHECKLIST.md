# 🔍 Audio Debug Checklist

## Current Issues to Verify:

1. **Audio not stopping when mouse moves away from flow**
2. **Multiple songs playing simultaneously**
3. **Audio mapping might be incorrect**

## Debug Steps:

### Open Browser Console and check:

```
http://localhost:5174/
```

Press F12 → Console tab

### Test each discovery method:

1. **Radio** - Should play "Turn It Up" or "Turn the Dial" or "Static Heartbeats" etc.
2. **Friends and family recommendations** - Should play friendship-themed songs
3. **Streaming service recommendations** - Should play streaming-themed songs
4. **Social media** - Should play social media-themed songs
5. **Live events and concerts** - Should play concert-themed songs

### Console Output Expected:

When hovering:
```
🔍 Hover point data: {curveNumber, pointNumber, hasSource, hasTarget, label}
✅ Hovering over a link/flow!
   Source label: [Discovery Method Name]
   Target label: [Age Group]
🎵 Direct match - Discovery method: [Method]
```

When unhover:
```
📍 Unhover event - stopping audio
⏹️ Stopping discovery method audio
🛑 Stopping audio
✅ Dashboard audio stopped completely
```

## Potential Issues:

1. **plotly_unhover not firing** - Need mouseleave as backup ✅ Added
2. **Audio element not properly destroyed** - Need aggressive cleanup ✅ Added
3. **Loop not being disabled** - Need to set loop=false ✅ Added
4. **Multiple audio instances** - Need to track and destroy all ✅ Added
5. **Detection not working** - Need better label matching ✅ Added

## Next Steps:

If still not working, we need to see actual console output to diagnose.

