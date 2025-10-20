import React from 'react'
import { motion } from 'framer-motion'
import { Music, Brain, BarChart3, Users, Zap, Play } from 'lucide-react'
import Logo3D from './Logo3D'
// import audioManager from '../utils/audioManager'

interface IntroScreenProps {
  onStartQuiz: () => void
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStartQuiz }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Machine learning discovers your unique music persona'
    },
    {
      icon: BarChart3,
      title: 'Interactive Charts',
      description: 'Explore Canadian music trends with beautiful visualizations'
    },
    {
      icon: Users,
      title: 'Persona Discovery',
      description: 'Find out which of 5 Canadian music personas you are'
    },
    {
      icon: Zap,
      title: 'Real Insights',
      description: 'Based on 1,006 real Canadian music survey responses'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="relative">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="inline-block w-56 h-56 mb-6"
              >
                <Logo3D 
                  className="w-full h-full"
                  animate={true}
                  rotationSpeed={0.8}
                />
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-6xl md:text-8xl font-bold mb-6"
              >
                <span className="gradient-text">Canadian</span>
                <br />
                <span className="gradient-text">Music DNA</span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              >
                Discover your unique musical identity through AI-powered analysis of Canadian music culture. 
                Find out which of 5 distinct personas you belong to!
              </motion.p>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="cyberpunk-card text-center group cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mb-4 group-hover:neon-glow transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto py-8"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">1,006</div>
              <div className="text-gray-400">Canadian Survey Responses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">5</div>
              <div className="text-gray-400">Unique Music Personas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">6</div>
              <div className="text-gray-400">Interactive Chart Types</div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={onStartQuiz}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cyberpunk-btn text-lg px-12 py-4 inline-flex items-center gap-3"
            >
              <Play className="w-6 h-6" />
              Discover Your Music DNA
            </motion.button>
          </motion.div>

          {/* Additional Info */}
          <motion.div 
            variants={itemVariants}
            className="text-center text-gray-500 text-sm max-w-2xl mx-auto"
          >
            <p>
              Take our quick 5-question quiz to discover your Canadian Music DNA persona. 
              Based on real survey data from music lovers across Canada.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default IntroScreen
