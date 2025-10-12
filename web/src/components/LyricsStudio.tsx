import React, { useEffect, useRef, useState } from 'react'
import { Sparkles, Wand2, Waves, KeyRound, Music2, Download as DownloadIcon, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  createSunoTrack,
  downloadSunoTrackFile,
  fetchSunoTrackStatus,
  generateLyricsWithChatGPT
} from '../services/lyricsService'
import type { SunoGeneratedTrack } from '../services/lyricsService'

const promptPresets = [
  'Write an uplifting pop anthem about overcoming creative block.',
  'Craft moody R&B lyrics about a late night train ride through the city.',
  'Create indie-folk lyrics inspired by the Canadian wilderness.'
]

const LyricsStudio: React.FC = () => {
  const [chatGptKey, setChatGptKey] = useState('')
  const [sunoKey, setSunoKey] = useState('')
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('Alt Pop')
  const [temperature, setTemperature] = useState(0.7)
  const [lyricsResult, setLyricsResult] = useState<string>('')
  const [lyricsMeta, setLyricsMeta] = useState('')
  const [lyricsLoading, setLyricsLoading] = useState(false)
  const [lyricsError, setLyricsError] = useState<string | null>(null)

  const [trackTitle, setTrackTitle] = useState('Demo Track')
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

  const pollTimeoutRef = useRef<number | null>(null)

  const handleUsePreset = (value: string) => {
    setPrompt(value)
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
    setLyricsError(null)
    setLyricsLoading(true)
    try {
      const response = await generateLyricsWithChatGPT({
        apiKey: chatGptKey,
        prompt,
        style,
        temperature
      })
      setLyricsResult(response.lyrics)
      setLyricsMeta(response.modelNote)
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

  const hydrateSunoAudio = async (track: SunoGeneratedTrack) => {
    const trackUrl = track.audioDownloadUrl || track.audioUrl
    if (!trackUrl) {
      setSunoAudioObjectUrl(null)
      setSunoAudioRemoteUrl(null)
      setSunoStatus('Completed: No audio URL returned. Check Suno dashboard for details.')
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
    } catch (error) {
      console.error('Unable to fetch Suno audio locally:', error)
      setSunoAudioObjectUrl(null)
      setSunoAudioRemoteUrl(trackUrl)
      setSunoStatus('Completed: Stream the track from Suno. Download may require visiting the provided URL.')
    }
  }

  const pollSunoJob = async (jobId: string, attempt = 0) => {
    setIsPollingSuno(true)
    try {
      const status = await fetchSunoTrackStatus(sunoKey, jobId)
      await processSunoStatus(status)

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

  const processSunoStatus = async (status: Awaited<ReturnType<typeof fetchSunoTrackStatus>>) => {
    setSunoStatus(`${status.status.toUpperCase()}: ${status.message}`)
    if (status.tracks?.length) {
      setSunoTracks(status.tracks)
    }

    if (status.status === 'completed' && status.tracks?.length) {
      await hydrateSunoAudio(status.tracks[0])
    } else if (status.status === 'failed') {
      setSunoError(status.message || 'Suno generation failed.')
    }
  }

  const handleCreateTrack = async () => {
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
      const response = await createSunoTrack({
        apiKey: sunoKey,
        lyrics: lyricsResult,
        title: trackTitle,
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
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

      if (response.status === 'completed' && response.tracks?.length) {
        await hydrateSunoAudio(response.tracks[0])
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
    if (!sunoKey.trim()) {
      setSunoError('Suno API key is required to query job status.')
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
      const status = await fetchSunoTrackStatus(sunoKey, manualJobId.trim())
      setSunoJobId(manualJobId.trim())
      await processSunoStatus(status)

      if (status.status !== 'completed' && status.status !== 'failed') {
        pollSunoJob(manualJobId.trim())
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to fetch Suno status. Please try again.'
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
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-cyan-300 font-medium">
                <Wand2 className="w-5 h-5" />
                ChatGPT Lyrics
              </div>
              <label className="block mt-5 text-sm font-semibold text-slate-300 uppercase tracking-wide">
                ChatGPT API key
              </label>
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
                placeholder="sk-..."
                value={chatGptKey}
                onChange={(event) => setChatGptKey(event.target.value)}
              />

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
                disabled={lyricsLoading || !chatGptKey.trim()}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {lyricsLoading ? 'Generating lyrics...' : 'Generate lyrics'}
              </button>

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
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-indigo-300 font-medium">
                <Waves className="w-5 h-5" />
                Suno Track Builder
              </div>

              <label className="block mt-5 text-sm font-semibold text-slate-300 uppercase tracking-wide">
                Suno API key
              </label>
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none"
                placeholder="suno_..."
                value={sunoKey}
                onChange={(event) => setSunoKey(event.target.value)}
              />

              <label className="block mt-6 text-sm font-semibold text-slate-300 uppercase tracking-wide">
                Track title
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm focus:border-indigo-400 focus:outline-none"
                placeholder="Demo Track"
                value={trackTitle}
                onChange={(event) => setTrackTitle(event.target.value)}
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

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={sunoCustomMode}
                    onChange={(event) => setSunoCustomMode(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-400 focus:ring-indigo-400"
                  />
                  Enable custom mode (use provided lyrics)
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={sunoInstrumentalOnly}
                    onChange={(event) => setSunoInstrumentalOnly(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-400 focus:ring-indigo-400"
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
                  !lyricsResult.trim() ||
                  !sunoKey.trim() ||
                  (sunoCustomMode && (!trackTitle.trim() || !style.trim()))
                }
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sunoLoading ? 'Submitting request...' : 'Send to Suno'}
              </button>

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
                    disabled={!manualJobId.trim() || !sunoKey.trim()}
                    className="rounded-xl bg-indigo-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-200 transition hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Check status
                  </button>
                </div>
              </div>

              {sunoTracks.length > 1 && (
                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-xs text-slate-300 space-y-2">
                  <div className="font-semibold text-indigo-200 text-sm">Generated tracks</div>
                  <ul className="space-y-1">
                    {sunoTracks.map((track, index) => (
                      <li key={index} className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => hydrateSunoAudio(track)}
                          className="rounded-lg border border-indigo-400/30 px-3 py-1 text-xs text-indigo-200 transition hover:border-indigo-400 hover:bg-indigo-500/10"
                        >
                          Play track {index + 1}
                        </button>
                        {track.title && <span className="text-slate-400">{track.title}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
