import React from 'react'
import { motion } from 'framer-motion'
import { User, Clock, RotateCcw, BarChart3 } from 'lucide-react'
import { Persona } from '../utils/dataLoader'

interface WelcomeBackProps {
  savedPersona: Persona
  savedTimestamp: string
  onViewResult: () => void
  onTakeNewQuiz: () => void
  onExploreDashboard: () => void
}

const WelcomeBack: React.FC<WelcomeBackProps> = ({
  savedPersona,
  savedTimestamp,
  onViewResult,
  onTakeNewQuiz,
  onExploreDashboard
}) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="cyberpunk-card text-center"
        >
          {/* Welcome Back Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back!</h1>
            <p className="text-gray-300 text-lg">
              We found your previous Canadian Music DNA result
            </p>
          </motion.div>

          {/* Saved Result Preview */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div 
              className="bg-gradient-to-br from-gray-800 to-gray-700 border-2 rounded-2xl p-6 mb-4"
              style={{ borderColor: savedPersona.color }}
            >
              <div className="flex items-center justify-center mb-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: savedPersona.color }}
                >
                  {savedPersona.name.charAt(0)}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">{savedPersona.name}</h2>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {savedPersona.description}
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {savedPersona.traits.slice(0, 3).map((trait, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ 
                      backgroundColor: `${savedPersona.color}40`,
                      border: `1px solid ${savedPersona.color}`
                    }}
                  >
                    {trait}
                  </span>
                ))}
                {savedPersona.traits.length > 3 && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-gray-400">
                    +{savedPersona.traits.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center text-gray-400 text-sm">
              <Clock className="w-4 h-4 mr-2" />
              Last completed: {formatDate(savedTimestamp)}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onViewResult}
                className="cyberpunk-btn text-lg px-6 py-4 inline-flex items-center justify-center gap-3"
              >
                <User className="w-5 h-5" />
                View My Result
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExploreDashboard}
                className="px-6 py-4 border-2 border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all inline-flex items-center justify-center gap-3"
              >
                <BarChart3 className="w-5 h-5" />
                Explore Dashboard
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onTakeNewQuiz}
                className="px-6 py-4 border-2 border-purple-400 text-purple-400 rounded-lg hover:bg-purple-400/10 transition-all inline-flex items-center justify-center gap-3"
              >
                <RotateCcw className="w-5 h-5" />
                Take New Quiz
              </motion.button>
            </div>

            <p className="text-gray-400 text-sm mt-4">
              Your results are automatically saved and will be available next time you visit
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WelcomeBack
