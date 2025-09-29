import React from 'react'
import AIChatInterface from './AIChatInterface'
import { Persona } from '../utils/dataLoader'

// Test component to verify AI Chat Interface works
const ChatTest: React.FC = () => {
  const testPersona: Persona = {
    id: 0,
    name: 'Test Persona',
    description: 'A test persona for debugging',
    traits: ['Test', 'Debug'],
    color: '#FF6B6B',
    size: 100,
    percentage: 10,
    characteristics: {
      music_relationship: { top_response: 'Test response', distribution: {} },
      discovery_method: { top_response: 'Test method', distribution: {} },
      age_group: { top_response: 'Test age', distribution: {} },
      ai_attitude: { top_response: 'Test attitude', distribution: {} },
      music_preference: { top_response: 'Test preference', distribution: {} }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-2xl mb-4">AI Chat Interface Test</h1>
        <p className="mb-4">Look for the purple chat button in the bottom-right corner</p>
        <AIChatInterface persona={testPersona} />
      </div>
    </div>
  )
}

export default ChatTest


