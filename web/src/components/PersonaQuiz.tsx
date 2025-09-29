import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

interface QuizQuestion {
  id: keyof QuizAnswers
  question: string
  options: string[]
  category: string
}

interface QuizAnswers {
  discovery_method: string
  ai_attitude: string
  music_relationship: string
  age_group: string
  listening_habits: string
}

interface PersonaQuizProps {
  onComplete: (answers: QuizAnswers) => void
  isLoading: boolean
}

const PersonaQuiz: React.FC<PersonaQuizProps> = ({ onComplete, isLoading }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})

  const questions: QuizQuestion[] = [
    {
      id: 'discovery_method',
      question: 'How do you primarily discover new music?',
      options: [
        'Radio',
        'Friends and family recommendations',
        'Streaming service recommendations',
        'Social media',
        'Live events and concerts'
      ],
      category: 'Discovery'
    },
    {
      id: 'ai_attitude',
      question: 'How do you feel about AI-generated music?',
      options: [
        'I strongly prefer human-made music',
        'I prefer human-made music',
        'I\'m neutral about AI music',
        'I\'m open to AI-generated music',
        'I\'m excited about AI music possibilities'
      ],
      category: 'Technology'
    },
    {
      id: 'music_relationship',
      question: 'How would you describe your relationship with music?',
      options: [
        'I\'m obsessed with music',
        'I like it but don\'t keep up with new releases',
        'Music is just background noise for me',
        'I enjoy music but only casually',
        'Music is an important part of my identity'
      ],
      category: 'Connection'
    },
    {
      id: 'age_group',
      question: 'What\'s your age group?',
      options: [
        '18-34',
        '35-54',
        '55+'
      ],
      category: 'Demographics'
    },
    {
      id: 'listening_habits',
      question: 'When do you most enjoy listening to music?',
      options: [
        'While commuting or traveling',
        'During workouts or physical activity',
        'While working or studying',
        'During relaxation or unwinding',
        'At social gatherings or parties'
      ],
      category: 'Behavior'
    }
  ]

  const handleAnswer = (answer: string) => {
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: answer
    }
    setAnswers(newAnswers)

    // Auto-advance after selection
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Quiz complete
        onComplete(newAnswers as QuizAnswers)
      }
    }, 500)
  }

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const questionVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  }

  const optionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl mx-auto w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            variants={questionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="cyberpunk-card"
          >
            {/* Category */}
            <div className="text-center mb-6">
              <span className="inline-block bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                {questions[currentQuestion].category}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white leading-tight">
              {questions[currentQuestion].question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => {
                const isSelected = answers[questions[currentQuestion].id] === option
                
                return (
                  <motion.button
                    key={option}
                    custom={index}
                    variants={optionVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option)}
                    disabled={isLoading}
                    className={`w-full p-6 text-left rounded-lg border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-400/10 neon-glow'
                        : 'border-gray-600 bg-gray-800/50 hover:border-cyan-400/50 hover:bg-cyan-400/5'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg text-white">{option}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={goBack}
                disabled={currentQuestion === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all ${
                  currentQuestion === 0
                    ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                    : 'border-cyan-400 text-cyan-400 hover:bg-cyan-400/10'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              <div className="text-sm text-gray-400">
                {currentQuestion === questions.length - 1 ? 'Final Question' : 'Choose your answer above'}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">Analyzing Your Responses...</h3>
              <p className="text-gray-400">Our AI is discovering your unique musical persona</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default PersonaQuiz
