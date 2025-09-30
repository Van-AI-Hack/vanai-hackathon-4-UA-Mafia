import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Brain, BarChart3, Users, Zap } from 'lucide-react'

// Components
import IntroScreen from './components/IntroScreen'
import PersonaQuiz from './components/PersonaQuiz'
import PersonaResult from './components/PersonaResult'
import Dashboard from './components/Dashboard'
import NavigationMenu from './components/NavigationMenu'
import WelcomeBack from './components/WelcomeBack'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import PerformanceMonitor from './components/PerformanceMonitor'
// Audio test components removed for production

// Data
import { loadPersonas, loadSurveyData, classifyPersona, Persona, SurveyData } from './utils/dataLoader'
import { loadFromLocalStorage } from './utils/exportUtils'
import pwaManager from './utils/pwaUtils'

// Types
interface QuizAnswers {
  discovery_method: string
  ai_attitude: string
  music_relationship: string
  age_group: string
  listening_habits: string
}

type AppState = 'intro' | 'quiz' | 'result' | 'dashboard' | 'welcome-back'

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>('intro')
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null)
  const [personaResult, setPersonaResult] = useState<Persona | null>(null)
  const [personas, setPersonas] = useState<Persona[]>([])
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [savedResult, setSavedResult] = useState<any>(null)

  // Load real data and check for saved results on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Check for saved results first
        const saved = loadFromLocalStorage()
        if (saved && saved.persona) {
          setSavedResult(saved)
          setCurrentState('welcome-back')
        }

        const [personasData, surveyDataResult] = await Promise.all([
          loadPersonas(),
          loadSurveyData()
        ])
        setPersonas(personasData)
        setSurveyData(surveyDataResult)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Use the ML classification from dataLoader
  const classifyPersonaLocal = (answers: QuizAnswers): Persona => {
    return classifyPersona(answers, personas)
  }

  const handleQuizComplete = async (answers: QuizAnswers) => {
    setIsLoading(true)
    setQuizAnswers(answers)
    
    // Simulate ML classification delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const result = classifyPersonaLocal(answers)
    setPersonaResult(result)
    setIsLoading(false)
    setCurrentState('result')
  }

  const handleExploreDashboard = () => {
    setCurrentState('dashboard')
  }

  const handleRestart = () => {
    setCurrentState('intro')
    setQuizAnswers(null)
    setPersonaResult(null)
    setSavedResult(null)
  }

  const handleViewSavedResult = () => {
    if (savedResult) {
      setPersonaResult(savedResult.persona)
      setQuizAnswers(savedResult.quizAnswers)
      setCurrentState('result')
    }
  }

  const handleTakeNewQuiz = () => {
    setCurrentState('intro')
    setSavedResult(null)
  }

  const handleExploreFromWelcome = () => {
    if (savedResult) {
      setPersonaResult(savedResult.persona)
      setCurrentState('dashboard')
    }
  }

  const pageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <NavigationMenu 
        currentState={currentState}
        onNavigate={setCurrentState}
        onRestart={handleRestart}
      />

      {/* Main Content */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {currentState === 'welcome-back' && savedResult && (
            <motion.div
              key="welcome-back"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <WelcomeBack
                savedPersona={savedResult.persona}
                savedTimestamp={savedResult.timestamp}
                onViewResult={handleViewSavedResult}
                onTakeNewQuiz={handleTakeNewQuiz}
                onExploreDashboard={handleExploreFromWelcome}
              />
            </motion.div>
          )}

          {currentState === 'intro' && (
            <motion.div
              key="intro"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <IntroScreen onStartQuiz={() => setCurrentState('quiz')} />
            </motion.div>
          )}

          {currentState === 'quiz' && (
            <motion.div
              key="quiz"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <PersonaQuiz 
                onComplete={handleQuizComplete}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {currentState === 'result' && personaResult && (
            <motion.div
              key="result"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <PersonaResult 
                persona={personaResult}
                onExploreDashboard={handleExploreDashboard}
                onRestart={handleRestart}
              />
            </motion.div>
          )}

          {currentState === 'dashboard' && (
            <motion.div
              key="dashboard"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <Dashboard 
                persona={personaResult}
                surveyData={surveyData}
                personas={personas}
                onBackToResult={() => {
                  console.log('🔙 Back to Result clicked', { personaResult, currentState })
                  if (personaResult) {
                    setCurrentState('result')
                    // Scroll to top when navigating
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  } else {
                    console.error('⚠️ No persona result available to navigate back to')
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* PWA Install Prompt */}
        <PWAInstallPrompt />

        {/* Performance Monitor */}
        <PerformanceMonitor />

        {/* Audio test components removed for cleaner UI */}

        {/* Loading Overlay */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">Analyzing Your Music DNA...</h3>
              <p className="text-gray-400">Our AI is discovering your unique musical persona</p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  )
}

export default App
