import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Sparkles, Wand2, Waves, KeyRound, Music2, Download as DownloadIcon, Loader2, ClipboardList } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  createSunoTrack,
  downloadSunoTrackFile,
  fetchSunoTrackStatus,
  generateLyricsWithChatGPT
} from '../services/lyricsService'
import type { SunoGeneratedTrack } from '../services/lyricsService'
import {
  fetchSunoHistory,
  upsertSunoHistoryEntry,
  updateSunoHistoryEntry,
  type SunoHistoryEntry
} from '../services/sunoHistoryService'

const promptPresets = [
  'Write an uplifting pop anthem about overcoming creative block.',
  'Craft moody R&B lyrics about a late night train ride through the city.',
  'Create indie-folk lyrics inspired by the Canadian wilderness.'
]

type QuizQuestionType = 'text' | 'number' | 'choice'

const extractTitleFromLyrics = (lyrics: string): string | null => {
  if (!lyrics.trim()) {
    return null
  }

  const lines = lyrics
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  for (const line of lines) {
    const titleMatch = /^(?:song\s+title|title)\s*[:\-–]\s*(.+)$/i.exec(line)
    if (titleMatch && titleMatch[1]) {
      return sanitizeTitle(titleMatch[1])
    }
  }

  const sectionPattern = /^(intro|verse|pre-chorus|chorus|bridge|hook|outro|breakdown|refrain)(\s+\d+)?[\:\-]?$/i

  for (const line of lines) {
    if (sectionPattern.test(line)) {
      continue
    }
    if (/^(lyrics\s+by|written\s+by|performed\s+by)/i.test(line)) {
      continue
    }
    if (/^[\[(]/.test(line)) {
      continue
    }
    return sanitizeTitle(line)
  }

  return null
}

const sanitizeTitle = (value: string): string => {
  const cleaned = value
    .replace(/^["'“”‘’]+/, '')
    .replace(/["'“”‘’]+$/, '')
    .trim()

  if (!cleaned) {
    return 'Untitled Track'
  }

  return cleaned.length > 120 ? `${cleaned.slice(0, 117)}...` : cleaned
}

interface QuizQuestion {
  id: string
  label: string
  type: QuizQuestionType
  required?: boolean
  placeholder?: string
  options?: string[]
  default?: string
}

interface QuizTemplate {
  quiz_title: string
  description: string
  questions: QuizQuestion[]
}

type StudioSection = 'quiz' | 'lyrics' | 'suno'

const studioSectionOrder: StudioSection[] = ['quiz', 'lyrics', 'suno']

const studioSectionLabels: Record<StudioSection, string> = {
  quiz: 'Song Brief Quiz',
  lyrics: 'ChatGPT Lyrics',
  suno: 'Suno Track Builder'
}

const quizTemplate: QuizTemplate = {
  quiz_title: '🎵 Song Lyrics Generator – User Info & Creative Brief',
  description:
    'Answer the following questions to generate personalized song lyrics. Each answer helps create the mood, tone, and structure of your song.',
  questions: [
    { id: 'user_name', label: '👤 What is your name?', type: 'text', required: true },
    { id: 'user_age', label: '🎂 How old are you?', type: 'number', required: true },
    {
      id: 'user_gender',
      label: '🚻 What is your gender?',
      type: 'choice',
      options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
      required: false
    },
    {
      id: 'artist_or_genre',
      label: '🎸 What artist or music genre should the song resemble?',
      type: 'text',
      placeholder: 'e.g., Adele, The Weeknd, Pop Rock, Lo-Fi',
      required: true
    },
    {
      id: 'mood',
      label: '🎭 What mood do you want to convey?',
      type: 'choice',
      options: ['Happy', 'Sad', 'Romantic', 'Motivational', 'Dark', 'Calm', 'Energetic'],
      required: true
    },
    {
      id: 'theme',
      label: '🌍 What is the main theme or story of the song?',
      type: 'text',
      placeholder: 'e.g., lost love, self-discovery, freedom, nostalgia',
      required: true
    },
    {
      id: 'structure',
      label: '💡 What structure should the song have?',
      type: 'choice',
      options: [
        'Verse-Chorus-Verse-Chorus-Bridge-Chorus',
        'Verse-Chorus-Verse-Chorus',
        'Custom (describe below)'
      ],
      required: true
    },
    {
      id: 'language',
      label: '🗣️ What language should the lyrics be written in?',
      type: 'text',
      default: 'English',
      required: true
    },
    {
      id: 'imagery',
      label: '🌅 What imagery or symbols should appear?',
      type: 'text',
      placeholder: 'e.g., rain, fire, ocean, moonlight',
      required: false
    },
    {
      id: 'tone',
      label: '🔥 What tone or energy level should it have?',
      type: 'choice',
      options: ['Calm', 'Emotional', 'Energetic', 'Cinematic', 'Dreamy', 'Powerful'],
      required: true
    },
    {
      id: 'music_style',
      label: '🎶 Do you want to specify a tempo or music style?',
      type: 'text',
      placeholder: 'e.g., 90 BPM ballad, EDM drop, trap beat, acoustic folk',
      required: false
    },
    {
      id: 'core_message',
      label: '💖 What is the main message or takeaway of the song?',
      type: 'text',
      placeholder: 'e.g., never give up, love yourself, time heals everything',
      required: true
    },
    {
      id: 'keywords',
      label: '🔑 List a few keywords or phrases to include in the lyrics',
      type: 'text',
      placeholder: 'e.g., rain, echo, promise, light',
      required: false
    },
    {
      id: 'intended_vocalist',
      label: '👤 Who is the intended vocalist?',
      type: 'choice',
      options: ['Male', 'Female', 'Duet', 'AI Voice', 'Other'],
      required: true
    },
    {
      id: 'additional_notes',
      label: '📝 Any additional notes, inspiration, or references?',
      type: 'text',
      placeholder: 'e.g., inspired by my last trip, a personal story, etc.',
      required: false
    }
  ]
}

const createInitialQuizAnswers = (questions: QuizQuestion[]): Record<string, string> => {
  return questions.reduce((accumulator, question) => {
    accumulator[question.id] = question.default ?? ''
    return accumulator
  }, {} as Record<string, string>)
}

const buildInitialQuizAnswers = () => createInitialQuizAnswers(quizTemplate.questions)

const generateQuizPrompt = (answers: Record<string, string>): string => {
  const getValue = (id: string) => (answers[id] ?? '').trim()

  const artistOrGenre = getValue('artist_or_genre') || 'the requested artist'
  const mood = getValue('mood') || 'an evocative mood'
  const theme = getValue('theme') || 'a clear central story'
  const language = getValue('language') || 'English'
  const structureRaw = getValue('structure')
  const tone = getValue('tone') || 'dynamic'
  const imagery = getValue('imagery')
  const musicStyle = getValue('music_style')
  const coreMessage = getValue('core_message') || 'the main message provided by the user'
  const keywords = getValue('keywords')
  const vocalist = getValue('intended_vocalist') || 'the best fitting vocalist'
  const additionalNotes = getValue('additional_notes')
  const name = getValue('user_name')
  const age = getValue('user_age')
  const gender = getValue('user_gender')

  let structureDescription = structureRaw
  if (!structureDescription) {
    structureDescription = 'Verse-Chorus-Verse-Chorus-Bridge-Chorus'
  } else if (structureRaw === 'Custom (describe below)') {
    structureDescription = additionalNotes
      ? `a custom structure described as: ${additionalNotes}`
      : 'a custom structure that highlights the narrative arc'
  }

  const toneDescriptor = tone.toLowerCase()
  const imageryLine = imagery
    ? `Include imagery or references to ${imagery}, and make sure the tone is ${toneDescriptor}.`
    : `Ensure the tone is ${toneDescriptor} and weave in vivid imagery that reinforces the theme.`

  const lines: string[] = [
    `Write lyrics for a song in the style of ${artistOrGenre} with a mood of ${mood} and a theme of ${theme}.`,
    `The song should have ${structureDescription}, and be written in ${language}.`,
    imageryLine
  ]

  if (musicStyle) {
    lines.push(`Optionally, structure it to fit a ${musicStyle}.`)
  }

  lines.push(`The main message should be ${coreMessage}.`)

  if (keywords) {
    lines.push(`Keywords: ${keywords}.`)
  } else {
    lines.push('Keywords: Use evocative phrases that echo the theme and mood.')
  }

  lines.push(`Intended vocalist: ${vocalist}.`)

  const personaParts: string[] = []
  if (age) {
    personaParts.push(`${age}-year-old`)
  }
  const normalizedGender = gender && gender !== 'Prefer not to say' ? gender.toLowerCase() : ''
  if (normalizedGender) {
    personaParts.push(normalizedGender)
  }

  if (name) {
    const personaDescriptor = personaParts.length ? `${personaParts.join(' ')} ${name}` : name
    lines.push(`Narrative perspective: ${personaDescriptor}.`)
  }

  if (additionalNotes && structureRaw !== 'Custom (describe below)') {
    lines.push(`Additional notes: ${additionalNotes}.`)
  }

  return lines.join('\n')
}

const getQuizAnswerValue = (answers: Record<string, string>, id: string): string => {
  return (answers[id] ?? '').trim()
}

const formatHistoryTimestamp = (isoTimestamp: string): string => {
  try {
    const date = new Date(isoTimestamp)
    if (Number.isNaN(date.getTime())) {
      return isoTimestamp
    }
    return date.toLocaleString()
  } catch (error) {
    return isoTimestamp
  }
}

const maskApiKey = (key: string): string => {
  if (!key) {
    return ''
  }
  if (key.length <= 8) {
    return `${key.slice(0, 2)}****`
  }
  return `${key.slice(0, 4)}****${key.slice(-4)}`
}

const multilineFieldIds = new Set([
  'theme',
  'imagery',
  'music_style',
  'core_message',
  'keywords',
  'additional_notes'
])

const fullWidthFieldIds = new Set([
  'theme',
  'imagery',
  'music_style',
  'core_message',
  'keywords',
  'additional_notes'
])

const LyricsStudio: React.FC = () => {
  const [activeSection, setActiveSection] = useState<StudioSection>('quiz')
  const [unlockedSections, setUnlockedSections] = useState<StudioSection[]>(['quiz'])
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>(buildInitialQuizAnswers)
  const [prompt, setPrompt] = useState(() => generateQuizPrompt(buildInitialQuizAnswers()))
  const [style, setStyle] = useState(() => {
    const defaults = buildInitialQuizAnswers()
    return defaults['artist_or_genre'] || 'Alt Pop'
  })
  const [temperature, setTemperature] = useState(0.7)
  const [lyricsResult, setLyricsResult] = useState<string>('')
  const [lyricsMeta, setLyricsMeta] = useState('')
  const [lyricsLoading, setLyricsLoading] = useState(false)
  const [lyricsError, setLyricsError] = useState<string | null>(null)

  const [trackTitle, setTrackTitle] = useState('Demo Track')
  const [trackTitleManuallyEdited, setTrackTitleManuallyEdited] = useState(false)
  const [tags, setTags] = useState('energetic, modern, synthwave')
  const [sunoStatus, setSunoStatus] = useState('')
  const [sunoLoading, setSunoLoading] = useState(false)
  const [sunoError, setSunoError] = useState<string | null>(null)
  const [sunoJobId, setSunoJobId] = useState<string | null>(null)
  const [isPollingSuno, setIsPollingSuno] = useState(false)
  const [sunoAudioObjectUrl, setSunoAudioObjectUrl] = useState<string | null>(null)
  const [sunoAudioRemoteUrl, setSunoAudioRemoteUrl] = useState<string | null>(null)
  const [sunoDownloadName, setSunoDownloadName] = useState('suno-track.mp3')
  const [sunoTracks, setSunoTracks] = useState<SunoGeneratedTrack[]>([])
  const [sunoModel, setSunoModel] = useState('V3_5')
  const [sunoCustomMode, setSunoCustomMode] = useState(true)
  const [sunoInstrumentalOnly, setSunoInstrumentalOnly] = useState(false)
  const [sunoNegativeTags, setSunoNegativeTags] = useState('')
  const [sunoVocalGender, setSunoVocalGender] = useState<'m' | 'f' | ''>('')
  const [manualJobId, setManualJobId] = useState('')
  const [sunoHistory, setSunoHistory] = useState<SunoHistoryEntry[]>([])
  const [sunoHistoryLoading, setSunoHistoryLoading] = useState(false)
  const [sunoHistoryError, setSunoHistoryError] = useState<string | null>(null)

  const pollTimeoutRef = useRef<number | null>(null)

  const chatGptKey = (import.meta.env.VITE_CHATGPT_API_KEY ?? '').trim()
  const sunoKey = (import.meta.env.VITE_SUNO_API_KEY ?? '').trim()
  const maskedChatGptKey = maskApiKey(chatGptKey)
  const maskedSunoKey = maskApiKey(sunoKey)
  const isChatGptKeyConfigured = chatGptKey.length > 0
  const isSunoKeyConfigured = sunoKey.length > 0

  useEffect(() => {
    let isMounted = true

    const loadHistory = async () => {
      setSunoHistoryLoading(true)
      setSunoHistoryError(null)
      try {
        const history = await fetchSunoHistory()
        if (isMounted) {
          setSunoHistory(sortHistoryEntries(history))
        }
      } catch (error) {
        if (isMounted) {
          let message = error instanceof Error ? error.message : 'Unable to load Suno history.'
          if (typeof message === 'string' && /could not find the table|does not exist/i.test(message)) {
            message = 'Supabase table `suno_requests` is missing. Run the SQL in web/DATABASE_SETUP.sql to provision it.'
          }
          setSunoHistoryError(message)
        }
      } finally {
        if (isMounted) {
          setSunoHistoryLoading(false)
        }
      }
    }

    loadHistory()

    return () => {
      isMounted = false
    }
  }, [])

  const sortHistoryEntries = (entries: SunoHistoryEntry[]) =>
    [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const upsertHistoryState = (entry: SunoHistoryEntry) => {
    setSunoHistory(previous => {
      const index = previous.findIndex(item => item.jobId === entry.jobId)
      if (index === -1) {
        return sortHistoryEntries([entry, ...previous])
      }
      const next = [...previous]
      next[index] = entry
      return next
    })
  }

  const patchHistoryState = (jobId: string, patch: Partial<SunoHistoryEntry>) => {
    setSunoHistory(previous =>
      previous.map(item => (item.jobId === jobId ? { ...item, ...patch } : item))
    )
  }

  const generatedQuizPrompt = useMemo(() => generateQuizPrompt(quizAnswers), [quizAnswers])

  const isQuizComplete = useMemo(
    () =>
      quizTemplate.questions.every(question => {
        if (!question.required) {
          return true
        }
        return (quizAnswers[question.id] ?? '').trim().length > 0
      }),
    [quizAnswers]
  )

  const isSectionUnlocked = (section: StudioSection) => unlockedSections.includes(section)

  const unlockSection = (section: StudioSection) => {
    setUnlockedSections(previous => (previous.includes(section) ? previous : [...previous, section]))
  }

  const goToSection = (section: StudioSection) => {
    if (!isSectionUnlocked(section)) {
      return
    }
    setActiveSection(section)
  }

  const currentSectionIndex = studioSectionOrder.indexOf(activeSection)
  const furthestUnlockedIndex = unlockedSections
    .map(section => studioSectionOrder.indexOf(section))
    .reduce((highest, index) => Math.max(highest, index), 0)
  const hasLyricsDraft = lyricsResult.trim().length > 0

  useEffect(() => {
    if (isQuizComplete) {
      unlockSection('lyrics')
    }
  }, [isQuizComplete])

  const handleQuizAnswerChange = (questionId: string, value: string) => {
    setQuizAnswers(previous => ({
      ...previous,
      [questionId]: value
    }))
  }

  const handleResetQuiz = () => {
    const defaults = buildInitialQuizAnswers()
    setQuizAnswers(defaults)
    const resetPrompt = generateQuizPrompt(defaults)
    setPrompt(resetPrompt)
    setStyle(defaults['artist_or_genre'] || 'Alt Pop')
    setActiveSection('quiz')
  }

  const handleApplyQuizPrompt = () => {
    setPrompt(generatedQuizPrompt)
    const artistAnswer = (quizAnswers['artist_or_genre'] ?? '').trim()
    if (artistAnswer) {
      setStyle(artistAnswer)
    }
    unlockSection('lyrics')
    setActiveSection('lyrics')
  }

  const handleUsePreset = (value: string) => {
    setPrompt(value)
  }

  const handleTrackTitleInputChange = (value: string) => {
    setTrackTitle(value)
    setTrackTitleManuallyEdited(true)
  }

  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current !== null) {
        window.clearTimeout(pollTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (sunoAudioObjectUrl) {
        URL.revokeObjectURL(sunoAudioObjectUrl)
      }
    }
  }, [sunoAudioObjectUrl])

  const handleGenerateLyrics = async () => {
    if (!isChatGptKeyConfigured) {
      setLyricsError('Add VITE_CHATGPT_API_KEY to your environment before generating lyrics.')
      return
    }
    setLyricsError(null)
    setLyricsLoading(true)
    try {
      const response = await generateLyricsWithChatGPT({
        apiKey: chatGptKey,
        prompt,
        style,
        temperature
      })
      const lyricsContent = response.lyrics
      setLyricsResult(lyricsContent)

      const derivedTitle = extractTitleFromLyrics(lyricsContent)
      if (derivedTitle && (!trackTitleManuallyEdited || !trackTitle.trim() || trackTitle === 'Demo Track')) {
        setTrackTitle(derivedTitle)
        setTrackTitleManuallyEdited(false)
      }

      setLyricsMeta(response.modelNote)
      unlockSection('suno')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to generate lyrics.'
      setLyricsError(message)
      setLyricsResult('')
    } finally {
      setLyricsLoading(false)
    }
  }

  const clearPollingTimeout = () => {
    if (pollTimeoutRef.current !== null) {
      window.clearTimeout(pollTimeoutRef.current)
      pollTimeoutRef.current = null
    }
  }

  const hydrateSunoAudio = async (track: SunoGeneratedTrack, sourceJobId?: string) => {
    unlockSection('suno')
    setActiveSection('suno')
    const trackUrl = track.audioDownloadUrl || track.audioUrl

    const syncHistory = async (status: string, message: string) => {
      if (!sourceJobId) {
        return
      }
      const tracksForHistory = [track]
      patchHistoryState(sourceJobId, { status, message, tracks: tracksForHistory })
      try {
        const updated = await updateSunoHistoryEntry(sourceJobId, {
          status,
          message,
          tracks: tracksForHistory,
          lastPolledAt: new Date().toISOString()
        })
        if (updated) {
          upsertHistoryState(updated)
        }
      } catch (error) {
        console.error('Unable to sync Suno history entry:', error)
      }
    }

    if (!trackUrl) {
      setSunoAudioObjectUrl(null)
      setSunoAudioRemoteUrl(null)
      setSunoStatus('Completed: No audio URL returned. Check Suno dashboard for details.')
      await syncHistory('completed', 'No audio URL returned. Check Suno dashboard for details.')
      return
    }

    try {
      if (sunoAudioObjectUrl) {
        URL.revokeObjectURL(sunoAudioObjectUrl)
      }
      const download = await downloadSunoTrackFile(
        sunoKey,
        trackUrl,
        `${track.title || trackTitle || 'suno-track'}.mp3`
      )
      setSunoAudioRemoteUrl(trackUrl)
      setSunoAudioObjectUrl(download.objectUrl)
      setSunoDownloadName(download.filename)
      setSunoStatus('Completed: Track ready to play locally.')
      await syncHistory('completed', 'Track ready to play locally.')
    } catch (error) {
      console.error('Unable to fetch Suno audio locally:', error)
      setSunoAudioObjectUrl(null)
      setSunoAudioRemoteUrl(trackUrl)
      setSunoStatus('Completed: Stream the track from Suno. Download may require visiting the provided URL.')
      await syncHistory(
        'completed',
        'Streaming directly from Suno. Visit the link if local download fails.'
      )
    }
  }


  const pollSunoJob = async (jobId: string, attempt = 0) => {
    setIsPollingSuno(true)
    try {
      const status = await fetchSunoTrackStatus(sunoKey, jobId)
      await processSunoStatus(jobId, status)

      if (status.status === 'completed') {
        clearPollingTimeout()
        setIsPollingSuno(false)
        return
      }

      if (status.status === 'failed') {
        clearPollingTimeout()
        setIsPollingSuno(false)
        setSunoError(status.message || 'Suno generation failed.')
        return
      }

      if (attempt >= 12) {
        clearPollingTimeout()
        setIsPollingSuno(false)
        setSunoStatus('Suno is still processing. You can try polling again shortly.')
        return
      }

      pollTimeoutRef.current = window.setTimeout(() => pollSunoJob(jobId, attempt + 1), 5000)
    } catch (error: unknown) {
      clearPollingTimeout()
      setIsPollingSuno(false)
      const message = error instanceof Error ? error.message : 'Unable to poll Suno. Please try again.'
      setSunoError(message)
    }
  }

  const processSunoStatus = async (
    jobId: string,
    status: Awaited<ReturnType<typeof fetchSunoTrackStatus>>
  ) => {
    setSunoStatus(`${status.status.toUpperCase()}: ${status.message}`)
    if (status.tracks?.length) {
      setSunoTracks(status.tracks)
    }

    patchHistoryState(jobId, {
      status: status.status,
      message: status.message ?? undefined,
      tracks: status.tracks && status.tracks.length ? status.tracks : undefined
    })

    try {
      const updated = await updateSunoHistoryEntry(jobId, {
        status: status.status,
        message: status.message ?? undefined,
        tracks: status.tracks && status.tracks.length ? status.tracks : undefined,
        lastPolledAt: new Date().toISOString()
      })
      if (updated) {
        upsertHistoryState(updated)
      }
    } catch (error) {
      console.error('Unable to sync Suno status to Supabase:', error)
    }

    if (status.status === 'completed' && status.tracks?.length) {
      await hydrateSunoAudio(status.tracks[0], jobId)
    } else if (status.status === 'failed') {
      setSunoError(status.message || 'Suno generation failed.')
    }
  }


  const handleCreateTrack = async () => {
    if (!isSunoKeyConfigured) {
      setSunoError('Add VITE_SUNO_API_KEY to your environment before creating Suno tracks.')
      return
    }
    setSunoError(null)
    setSunoStatus('Submitting to Suno...')
    setSunoLoading(true)
    clearPollingTimeout()
    setSunoJobId(null)
    if (sunoAudioObjectUrl) {
      URL.revokeObjectURL(sunoAudioObjectUrl)
    }
    setSunoAudioObjectUrl(null)
    setSunoAudioRemoteUrl(null)
    setSunoTracks([])
    try {
      const parsedTags = tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      const negativeTagList = sunoNegativeTags.split(',').map((tag) => tag.trim()).filter(Boolean)
      const response = await createSunoTrack({
        apiKey: sunoKey,
        lyrics: lyricsResult,
        title: trackTitle,
        tags: parsedTags,
        style,
        customMode: sunoCustomMode,
        instrumental: sunoInstrumentalOnly,
        model: sunoModel,
        negativeTags: sunoNegativeTags || undefined,
        vocalGender: sunoVocalGender || undefined
      })

      setSunoJobId(response.jobId)
      setSunoStatus(`${response.status.toUpperCase()}: ${response.message}`)

      if (response.tracks?.length) {
        setSunoTracks(response.tracks)
      }

      let persistedEntry: SunoHistoryEntry | null = null
      try {
        persistedEntry = await upsertSunoHistoryEntry({
          jobId: response.jobId,
          title: trackTitle || 'Untitled Track',
          prompt,
          style,
          tags: parsedTags,
          quizAnswers: { ...quizAnswers },
          status: response.status,
          message: response.message,
          tracks: response.tracks ?? [],
          customMode: sunoCustomMode,
          instrumentalOnly: sunoInstrumentalOnly,
          model: sunoModel,
          negativeTags: negativeTagList,
          vocalGender: sunoVocalGender || undefined
        })
      } catch (storageError) {
        console.error('Unable to persist Suno history entry:', storageError)
        persistedEntry = {
          id: response.jobId,
          jobId: response.jobId,
          createdAt: new Date().toISOString(),
          updatedAt: null,
          title: trackTitle || 'Untitled Track',
          prompt,
          style,
          tags: parsedTags,
          quizAnswers: { ...quizAnswers },
          status: response.status,
          message: response.message,
          tracks: response.tracks ?? [],
          customMode: sunoCustomMode,
          instrumentalOnly: sunoInstrumentalOnly,
          model: sunoModel,
          negativeTags: negativeTagList,
          vocalGender: sunoVocalGender || undefined
        } as SunoHistoryEntry
      }

      if (persistedEntry) {
        upsertHistoryState(persistedEntry)
      }


      if (response.status === 'completed' && response.tracks?.length) {
        await hydrateSunoAudio(response.tracks[0], response.jobId)
      } else {
        pollSunoJob(response.jobId)
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to create Suno track.'
      setSunoError(message)
      setSunoStatus('')
    } finally {
      setSunoLoading(false)
    }
  }

  const handleDownloadTrack = () => {
    if (sunoAudioObjectUrl) {
      const link = document.createElement('a')
      link.href = sunoAudioObjectUrl
      link.download = sunoDownloadName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (sunoAudioRemoteUrl) {
      window.open(sunoAudioRemoteUrl, '_blank')
    }
  }

  const handleManualStatusCheck = async () => {
    if (!manualJobId.trim()) {
      setSunoError('Enter a Suno job ID to check its status.')
      return
    }
    if (!isSunoKeyConfigured) {
      setSunoError('Add VITE_SUNO_API_KEY to your environment before querying job status.')
      return
    }

    setSunoError(null)
    setSunoStatus('Checking Suno job status...')
    setIsPollingSuno(false)
    clearPollingTimeout()
    if (sunoAudioObjectUrl) {
      URL.revokeObjectURL(sunoAudioObjectUrl)
      setSunoAudioObjectUrl(null)
    }
    setSunoAudioRemoteUrl(null)
    setSunoTracks([])

    try {
      const cleanedJobId = manualJobId.trim()
      const status = await fetchSunoTrackStatus(sunoKey, cleanedJobId)
      setSunoJobId(cleanedJobId)
      await processSunoStatus(cleanedJobId, status)

      if (status.status !== 'completed' && status.status !== 'failed') {
        pollSunoJob(cleanedJobId)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to fetch Suno status. Please try again.'
      setSunoError(message)
    }
  }

  const handlePreviewHistoryEntry = async (entry: SunoHistoryEntry) => {
    unlockSection('suno')
    setActiveSection('suno')
    setSunoError(null)
    setSunoJobId(entry.jobId)

    if (!entry.tracks.length) {
      if (!isSunoKeyConfigured) {
        setSunoError('Add VITE_SUNO_API_KEY to refresh this job.')
        return
      }
      setSunoStatus('Requesting an updated status from Suno...')
      pollSunoJob(entry.jobId)
      return
    }

    try {
      setSunoStatus(`Loading track from history (${entry.jobId})...`)
      await hydrateSunoAudio(entry.tracks[0], entry.jobId)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load the archived track.'
      setSunoError(message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 text-slate-100">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900/70 border border-cyan-400/20 rounded-3xl p-8 md:p-12 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 text-cyan-300 text-sm uppercase tracking-[0.3em]">
              <Sparkles className="w-5 h-5" />
              AI CREATIVE SUITE
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight gradient-text">
              Lyrics & Music Sandbox
            </h1>
            <p className="mt-4 text-slate-300 max-w-2xl">
              Experiment with ChatGPT powered lyric generation and queue a Suno track without leaving the dashboard. Provide your own API keys and the studio will request lyrics directly from OpenAI and Suno in real time.
            </p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl p-6 max-w-sm">
            <div className="flex items-center gap-3 text-cyan-200">
              <KeyRound className="w-6 h-6" />
              <span className="font-semibold">Bring your own credentials</span>
            </div>
            <p className="mt-3 text-sm text-slate-300">
              Keys stay in-memory only and are sent straight to the OpenAI API from your browser session.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <div className="flex flex-wrap items-center gap-3">
                {studioSectionOrder.map((section, index) => {
                  const isUnlocked = isSectionUnlocked(section)
                  const isActive = activeSection === section
                  const isCompleted = isUnlocked && index < furthestUnlockedIndex

                  return (
                    <React.Fragment key={section}>
                      {index > 0 && (
                        <div
                          className={`h-px flex-1 min-w-[32px] ${furthestUnlockedIndex >= index ? 'bg-cyan-400/60' : 'bg-slate-800'}`}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => goToSection(section)}
                        disabled={!isUnlocked}
                        className={`flex items-center gap-3 rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                          isActive
                            ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-200'
                            : isUnlocked
                              ? 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-200'
                              : 'border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                            isCompleted || isActive ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span>{studioSectionLabels[section]}</span>
                      </button>
                    </React.Fragment>
                  )
                })}
              </div>
            </div>

            <div className={`bg-slate-950/60 border border-slate-800 rounded-2xl p-6 space-y-6 ${
              activeSection === 'quiz' ? '' : 'hidden'
            }`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-cyan-300 font-medium">
                  <ClipboardList className="w-5 h-5" />
                  Song Brief Quiz
                </div>
                {isSectionUnlocked('lyrics') && activeSection === 'quiz' && (
                  <button
                    type="button"
                    onClick={() => goToSection('lyrics')}
                    className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-500/20"
                  >
                    Go to lyrics
                  </button>
                )}
              </div>
              <div>
                <h2 className="mt-4 text-xl font-semibold text-slate-100">{quizTemplate.quiz_title}</h2>
                <p className="mt-2 text-sm text-slate-400">{quizTemplate.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {quizTemplate.questions.map((question) => {
                  const value = quizAnswers[question.id] ?? ''
                  const isFullWidth = fullWidthFieldIds.has(question.id)
                  const commonInputClasses =
                    'mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none'

                  return (
                    <div key={question.id} className={isFullWidth ? 'sm:col-span-2' : ''}>
                      <label className="block text-sm font-semibold text-slate-200">
                        {question.label}
                        {!question.required && (
                          <span className="ml-2 text-xs font-normal uppercase tracking-wide text-slate-500">Optional</span>
                        )}
                      </label>
                      {question.type === 'text' && multilineFieldIds.has(question.id) ? (
                        <textarea
                          className={`${commonInputClasses} min-h-[96px] resize-y`}
                          placeholder={question.placeholder}
                          value={value}
                          onChange={(event) => handleQuizAnswerChange(question.id, event.target.value)}
                        />
                      ) : question.type === 'text' ? (
                        <input
                          className={commonInputClasses}
                          placeholder={question.placeholder}
                          value={value}
                          onChange={(event) => handleQuizAnswerChange(question.id, event.target.value)}
                          type="text"
                        />
                      ) : question.type === 'number' ? (
                        <input
                          className={commonInputClasses}
                          placeholder={question.placeholder}
                          value={value}
                          onChange={(event) => handleQuizAnswerChange(question.id, event.target.value)}
                          type="number"
                          min={0}
                          inputMode="numeric"
                        />
                      ) : (
                        <select
                          className={commonInputClasses}
                          value={value}
                          onChange={(event) => handleQuizAnswerChange(question.id, event.target.value)}
                        >
                          <option value="">
                            {question.required ? 'Select an option' : 'No preference'}
                          </option>
                          {(question.options ?? []).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-semibold text-cyan-200">Generated prompt preview</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleResetQuiz}
                      className="rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-500/20"
                    >
                      Reset quiz
                    </button>
                      <button
                        type="button"
                        onClick={handleApplyQuizPrompt}
                        disabled={!isQuizComplete}
                        className="rounded-lg border border-cyan-400/30 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Continue to ChatGPT Lyrics
                      </button>
                  </div>
                </div>
                {!isQuizComplete && (
                  <p className="text-xs text-amber-300">
                    Fill the required questions to unlock the tailored song prompt.
                  </p>
                )}
                <pre className="whitespace-pre-wrap text-sm text-slate-200">{generatedQuizPrompt}</pre>
              </div>
            </div>

            <div className={`bg-slate-950/60 border border-slate-800 rounded-2xl p-6 ${
              activeSection === 'lyrics' ? '' : 'hidden'
            }`}>
              <div className="flex items-center gap-2 text-cyan-300 font-medium">
                <Wand2 className="w-5 h-5" />
                ChatGPT Lyrics
              </div>
              <div className="mt-5 rounded-xl border border-cyan-400/20 bg-slate-900/60 p-4 text-sm text-slate-200">
                {isChatGptKeyConfigured ? (
                  <p>
                    Using embedded ChatGPT key (<code>VITE_CHATGPT_API_KEY</code>) — {maskedChatGptKey}.
                  </p>
                ) : (
                  <p className="text-amber-300">
                    Add <code>VITE_CHATGPT_API_KEY</code> to your environment file to enable lyric generation.
                  </p>
                )}
              </div>

              <label className="block mt-6 text-sm font-semibold text-slate-300 uppercase tracking-wide">
                Prompt
              </label>
              <textarea
                className="mt-2 w-full min-h-[140px] rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none resize-y"
                placeholder="Describe the theme, vibe, or story for your song..."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />

              <div className="mt-4 flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Style / reference
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
                    placeholder="Alt Pop"
                    value={style}
                    onChange={(event) => setStyle(event.target.value)}
                  />
                </div>
                <div className="w-full md:w-40">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Creativity
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.1}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
                    value={temperature}
                    onChange={(event) => setTemperature(parseFloat(event.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Quick prompts
                </span>
                <div className="mt-3 flex flex-wrap gap-3">
                  {promptPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleUsePreset(preset)}
                      className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-500/20"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateLyrics}
                disabled={lyricsLoading || !isChatGptKeyConfigured}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {lyricsLoading ? 'Generating lyrics...' : 'Generate lyrics'}
              </button>

              {!isChatGptKeyConfigured && (
                <p className="mt-3 text-xs text-amber-300">
                  Update <code>VITE_CHATGPT_API_KEY</code> in your environment before generating lyrics.
                </p>
              )}

              {lyricsError && (
                <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {lyricsError}
                </p>
              )}

              {lyricsResult && (
                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
                    <Music2 className="w-4 h-4" />
                    Draft lyrics
                  </div>
                  <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-200">
                    {lyricsResult}
                  </pre>
                  {lyricsMeta && (
                    <p className="mt-4 text-xs text-slate-400">{lyricsMeta}</p>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => goToSection('quiz')}
                  className="rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-500/20"
                >
                  Back to quiz
                </button>
                <button
                  type="button"
                  onClick={() => {
                    unlockSection('suno')
                    setActiveSection('suno')
                  }}
                  disabled={!hasLyricsDraft}
                  className="rounded-lg border border-indigo-400/30 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-indigo-500/20 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continue to Suno builder
                </button>
              </div>
            </div>

            <div className={`bg-slate-950/60 border border-slate-800 rounded-2xl p-6 ${
              activeSection === 'suno' ? '' : 'hidden'
            }`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-2 text-indigo-300 font-medium">
                  <Waves className="w-5 h-5" />
                  Suno Track Builder
                </div>
                <button
                  type="button"
                  onClick={() => goToSection('lyrics')}
                  className="rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-200 transition hover:border-indigo-400 hover:bg-indigo-500/20"
                >
                  Back to lyrics
                </button>
              </div>

              <div className="mt-5 rounded-xl border border-indigo-400/20 bg-slate-900/60 p-4 text-sm text-indigo-100">
                {isSunoKeyConfigured ? (
                  <p>
                    Using embedded Suno key (<code>VITE_SUNO_API_KEY</code>) — {maskedSunoKey}.
                  </p>
                ) : (
                  <p className="text-amber-300">
                    Add <code>VITE_SUNO_API_KEY</code> to your environment file to enable track generation.
                  </p>
                )}
              </div>

              <label className="block mt-6 text-sm font-semibold text-slate-300 uppercase tracking-wide">
                Track title
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none"
                placeholder="Demo Track"
                value={trackTitle}
                onChange={(event) => handleTrackTitleInputChange(event.target.value)}
              />

              <label className="block mt-6 text-sm font-semibold text-slate-300 uppercase tracking-wide">
                Tags / vibe
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none"
                placeholder="energetic, modern, synthwave"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
              />

              <label className="block mt-6 text-sm font-semibold text-slate-300 uppercase tracking-wide">
                Negative tags (optional)
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none"
                placeholder="Heavy metal, screamo"
                value={sunoNegativeTags}
                onChange={(event) => setSunoNegativeTags(event.target.value)}
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Suno model
                  </label>
                  <select
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none"
                    value={sunoModel}
                    onChange={(event) => setSunoModel(event.target.value)}
                  >
                    <option value="V5">V5</option>
                    <option value="V4_5PLUS">V4_5PLUS</option>
                    <option value="V4_5">V4_5</option>
                    <option value="V4">V4</option>
                    <option value="V3_5">V3_5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Vocal preference
                  </label>
                  <select
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none"
                    value={sunoVocalGender}
                    onChange={(event) => setSunoVocalGender(event.target.value as 'm' | 'f' | '')}
                  >
                    <option value="">Auto</option>
                    <option value="m">Male voice</option>
                    <option value="f">Female voice</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border border-slate-700 bg-slate-900/80 text-indigo-500 focus:ring-indigo-400"
                    checked={sunoCustomMode}
                    onChange={(event) => setSunoCustomMode(event.target.checked)}
                  />
                  Custom mode (send lyrics to Suno)
                </label>
                <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border border-slate-700 bg-slate-900/80 text-indigo-500 focus:ring-indigo-400"
                    checked={sunoInstrumentalOnly}
                    onChange={(event) => setSunoInstrumentalOnly(event.target.checked)}
                  />
                  Instrumental only
                </label>
              </div>

              <p className="mt-6 text-xs text-slate-400">
                Configure the Suno payload above. Custom mode feeds the generated lyrics directly into Suno&apos;s <code className="bg-slate-800/60 px-1.5 py-0.5 rounded">/api/v1/generate</code> endpoint; this client polls the track status until the download URL is ready.
              </p>

              <button
                type="button"
                onClick={handleCreateTrack}
                disabled={
                  sunoLoading ||
                  !hasLyricsDraft ||
                  !isSunoKeyConfigured ||
                  (sunoCustomMode && (!trackTitle.trim() || !style.trim()))
                }
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sunoLoading ? 'Submitting request...' : 'Send to Suno'}
              </button>

              {!isSunoKeyConfigured && (
                <p className="mt-3 text-xs text-amber-300">
                  Update <code>VITE_SUNO_API_KEY</code> in your environment before creating tracks.
                </p>
              )}

              {sunoError && (
                <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {sunoError}
                </p>
              )}

              {(sunoStatus || sunoJobId) && (
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200 space-y-2">
                  {sunoJobId && (
                    <div className="text-xs uppercase tracking-wider text-indigo-300">
                      Suno Job ID: <span className="font-mono text-slate-100">{sunoJobId}</span>
                    </div>
                  )}
                  {sunoStatus && (
                    <div className="flex items-start gap-2 whitespace-pre-wrap">
                      {isPollingSuno && (
                        <Loader2 className="mt-1 h-4 w-4 animate-spin text-indigo-300" />
                      )}
                      <span>{sunoStatus}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="text-sm font-semibold text-indigo-200">
                  Check existing Suno job
                </div>
                <p className="text-xs text-slate-400">
                  Recover an earlier request by supplying its job ID. The studio will poll Suno and download the audio locally before playback.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                    placeholder="Enter Suno job ID"
                    value={manualJobId}
                    onChange={(event) => setManualJobId(event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleManualStatusCheck}
                    disabled={!manualJobId.trim() || !isSunoKeyConfigured}
                    className="rounded-xl bg-indigo-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-200 transition hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Check status
                  </button>
                </div>
              </div>

              {(sunoAudioObjectUrl || sunoAudioRemoteUrl) && (
                <div className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-indigo-200">
                    <Music2 className="w-4 h-4" />
                    Generated track preview
                  </div>
                  <audio
                    controls
                    className="w-full"
                    src={sunoAudioObjectUrl ?? sunoAudioRemoteUrl ?? undefined}
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadTrack}
                      className="flex items-center gap-2 rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-200 transition hover:border-indigo-400 hover:bg-indigo-500/20"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Save track
                    </button>
                    {sunoAudioRemoteUrl && !sunoAudioObjectUrl && (
                      <span className="text-xs text-slate-400">
                        Local download failed. Opening the Suno link will let you fetch the audio manually.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-indigo-200">Generated tracks this session</h2>
              <p className="mt-2 text-xs text-slate-400">
                Access every track created in this browser session. Selecting one loads it in the Suno builder.
              </p>
              {sunoTracks.length === 0 ? (
                <p className="mt-6 text-sm text-slate-500">No tracks generated yet.</p>
              ) : (
                <ul className="mt-5 space-y-2 text-sm text-slate-200">
                  {sunoTracks.map((track, index) => (
                    <li key={`${track.title || 'track'}-${index}`} className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => hydrateSunoAudio(track)}
                        className="rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-100 transition hover:border-indigo-400 hover:bg-indigo-500/20"
                      >
                        Play track {index + 1}
                      </button>
                      {track.title && <span className="text-slate-400">{track.title}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-indigo-200">
                Session song archive
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Every Suno request stores its task ID and the creative brief so you can revisit drafts later.
              </p>

              {sunoHistoryLoading ? (
                <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-300" />
                  <span>Loading previous Suno requests...</span>
                </div>
              ) : sunoHistoryError ? (
                <p className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  {sunoHistoryError}
                </p>
              ) : sunoHistory.length === 0 ? (
                <p className="mt-6 text-sm text-slate-500">
                  Submit a song to Suno and it will appear here with its job ID and key details.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {sunoHistory.map((entry) => {
                    const answers = entry.quizAnswers || {}
                    const mood = getQuizAnswerValue(answers, 'mood') || '—'
                    const theme = getQuizAnswerValue(answers, 'theme') || '—'
                    const tone = getQuizAnswerValue(answers, 'tone') || '—'
                    const structure = getQuizAnswerValue(answers, 'structure') || '—'
                    const vocalist = getQuizAnswerValue(answers, 'intended_vocalist') || '—'
                    const artist = getQuizAnswerValue(answers, 'artist_or_genre') || entry.style || '—'
                    const createdAt = formatHistoryTimestamp(entry.createdAt)
                    const statusLabel = (entry.status || 'unknown').toUpperCase()

                    return (
                      <div
                        key={entry.id || entry.jobId}
                        className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-100">
                              {entry.title || 'Untitled Track'}
                            </h3>
                            <p className="text-xs text-slate-400">Job ID: {entry.jobId}</p>
                            <p className="text-xs text-slate-400">Created: {createdAt}</p>
                          </div>
                          <div className="flex flex-col items-start gap-2 sm:items-end">
                            <span className="rounded-full border border-indigo-400/40 bg-indigo-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-100">
                              {statusLabel}
                            </span>
                            {entry.message && (
                              <span className="text-[11px] text-slate-400 text-right max-w-xs">
                                {entry.message}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handlePreviewHistoryEntry(entry)}
                              className="rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-100 transition hover:border-indigo-400 hover:bg-indigo-500/20"
                            >
                              Preview track
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-[13px] text-slate-200 sm:grid-cols-2">
                          <div>
                            <span className="font-semibold text-indigo-100">Artist / Style:</span> {artist}
                          </div>
                          <div>
                            <span className="font-semibold text-indigo-100">Mood:</span> {mood}
                          </div>
                          <div>
                            <span className="font-semibold text-indigo-100">Theme:</span> {theme}
                          </div>
                          <div>
                            <span className="font-semibold text-indigo-100">Tone:</span> {tone}
                          </div>
                          <div>
                            <span className="font-semibold text-indigo-100">Structure:</span> {structure}
                          </div>
                          <div>
                            <span className="font-semibold text-indigo-100">Vocalist:</span> {vocalist}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="bg-slate-950/40 border border-slate-800/70 rounded-2xl p-6 text-sm text-slate-300 space-y-4">
              <h2 className="text-base font-semibold text-slate-100">
                Implementation checklist
              </h2>
              <ul className="space-y-2 list-disc list-inside marker:text-cyan-300">
                <li>Translate the Suno form values into the payload required by the official Suno API.</li>
                <li>Persist keys securely on the server or via environment variables before going live.</li>
                <li>Validate quotas and handle API failure states for a smooth UX.</li>
                <li>Add server-side proxying if you need stricter control over request origins or key exposure.</li>
                <li>Optionally implement Suno webhooks if you later move from polling to callbacks.</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default LyricsStudio
