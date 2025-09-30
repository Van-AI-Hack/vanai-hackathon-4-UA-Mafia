import React, { useEffect } from 'react'

const SimpleAudioTest: React.FC = () => {
  useEffect(() => {
    console.log('🔊 SimpleAudioTest component mounted!')
    
    // Test 1: Direct Web Audio API test
    const testDirectAudio = () => {
      try {
        console.log('🎵 Testing direct Web Audio API...')
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.frequency.value = 440 // A4 note
        osc.type = 'sine'
        gain.gain.value = 0.3
        
        osc.start()
        osc.stop(ctx.currentTime + 0.5) // Play for 0.5 seconds
        
        console.log('✅ Direct audio test triggered! Should hear 440Hz tone for 0.5s')
      } catch (err) {
        console.error('❌ Direct audio test failed:', err)
      }
    }

    // Test immediately
    console.log('⏰ Testing audio in 1 second...')
    setTimeout(testDirectAudio, 1000)
    
  }, [])

  const playTestSound = () => {
    console.log('🎵 Manual test button clicked!')
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.value = 880 // A5 note (higher pitch)
      osc.type = 'sine'
      gain.gain.value = 0.5
      
      osc.start()
      osc.stop(ctx.currentTime + 0.3)
      
      console.log('✅ Should hear 880Hz tone for 0.3s')
    } catch (err) {
      console.error('❌ Manual audio test failed:', err)
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 p-4 bg-red-500/95 border-2 border-white rounded-lg shadow-2xl">
      <h3 className="text-white font-bold mb-2">🔊 SIMPLE AUDIO TEST</h3>
      <button
        onClick={playTestSound}
        className="w-full px-4 py-2 bg-white text-red-600 font-bold rounded hover:bg-gray-100"
      >
        CLICK TO HEAR BEEP
      </button>
      <p className="text-white text-xs mt-2">
        Open Console (F12)
      </p>
    </div>
  )
}

export default SimpleAudioTest
