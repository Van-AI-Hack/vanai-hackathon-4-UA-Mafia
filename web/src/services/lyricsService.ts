export interface LyricsRequest {
  apiKey: string
  prompt: string
  style?: string
  temperature?: number
}

export interface LyricsResponse {
  lyrics: string
  promptUsed: string
  modelNote: string
}

export interface SunoTrackRequest {
  apiKey: string
  lyrics: string
  title?: string
  tags?: string[]
  style?: string
  customMode?: boolean
  instrumental?: boolean
  model?: string
  callbackUrl?: string
  negativeTags?: string
  vocalGender?: 'm' | 'f'
  styleWeight?: number
  weirdnessConstraint?: number
  audioWeight?: number
}

export interface SunoTrackResponse {
  jobId: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  message: string
  title?: string
  tracks?: SunoGeneratedTrack[]
  rawPayload?: unknown
}

export interface SunoGeneratedTrack {
  audioUrl?: string
  audioDownloadUrl?: string
  coverUrl?: string
  title?: string
  prompt?: string
  instrumental?: boolean
}

export interface SunoTrackDownload {
  objectUrl: string
  filename: string
  mimeType: string
}

const {
  VITE_SUNO_API_BASE_URL,
  VITE_SUNO_GENERATE_ENDPOINT,
  VITE_SUNO_STATUS_ENDPOINT
} = import.meta.env

const SUNO_API_BASE_URL = VITE_SUNO_API_BASE_URL || 'https://api.sunoapi.org/api/v1'
const SUNO_GENERATE_ENDPOINT = VITE_SUNO_GENERATE_ENDPOINT || `${SUNO_API_BASE_URL}/generate`
const SUNO_STATUS_ENDPOINT = VITE_SUNO_STATUS_ENDPOINT || `${SUNO_API_BASE_URL}/get`

const normaliseSunoStatus = (status?: string): SunoTrackResponse['status'] => {
  if (!status) return 'processing'
  const value = status.toLowerCase()
  if (value.includes('complete') || value === 'succeeded' || value === 'done') return 'completed'
  if (value.includes('fail') || value === 'error') return 'failed'
  if (value.includes('queue') || value === 'submitted') return 'queued'
  return 'processing'
}

const extractSunoJobId = (payload: any): string | undefined => {
  return (
    payload?.id ||
    payload?.job_id ||
    payload?.jobId ||
    payload?.task_id ||
    payload?.taskId ||
    payload?.data?.taskId ||
    payload?.data?.task_id ||
    payload?.data?.id ||
    payload?.data?.job_id ||
    payload?.result?.id
  )
}

const extractSunoAudioUrl = (payload: any): string | undefined => {
  return (
    payload?.audio_url ||
    payload?.audioUrl ||
    payload?.audio?.url ||
    payload?.result?.audio_url ||
    payload?.result?.audioUrl ||
    payload?.data?.audio_url ||
    payload?.data?.[0]?.audio_url ||
    payload?.clips?.[0]?.audio ||
    payload?.clips?.[0]?.audio_url
  )
}

const extractSunoMessage = (payload: any): string => {
  return (
    payload?.msg ||
    payload?.message ||
    payload?.status_message ||
    payload?.detail ||
    payload?.error ||
    payload?.result?.message ||
    payload?.result?.status_message ||
    'Request submitted to Suno.'
  )
}

const buildStatusUrl = (jobId: string) => {
  if (SUNO_STATUS_ENDPOINT.includes('{id}')) {
    return SUNO_STATUS_ENDPOINT.replace('{id}', jobId)
  }

  const endpoint = SUNO_STATUS_ENDPOINT.replace(/\/$/, '')

  if (endpoint.includes('?')) {
    const hasParam = endpoint.match(/([?&])taskId=/)
    const separator = endpoint.endsWith('?') || endpoint.endsWith('&') ? '' : hasParam ? '' : '&'
    return hasParam ? endpoint.replace(/taskId=[^&]*/, `taskId=${jobId}`) : `${endpoint}${separator}taskId=${jobId}`
  }

  return `${endpoint}?taskId=${jobId}`
}

const buildAuthHeaders = (apiKey: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${apiKey}`
})

export const generateLyricsWithChatGPT = async (
  request: LyricsRequest
): Promise<LyricsResponse> => {
  const { apiKey, prompt, style, temperature } = request

  if (!apiKey) {
    throw new Error('ChatGPT API key is required before generating lyrics.')
  }

  if (!prompt.trim()) {
    throw new Error('Enter a lyrical prompt to continue.')
  }

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 30000)

  try {
    const systemInstructions = `You are an experienced songwriter helping artists develop polished lyrics. Focus on rich imagery, a clear structure (verses, chorus, bridge), and keep the lyrical tone aligned with the requested style. Mention section headings.`

    const userRequest = `Write original song lyrics.
Prompt: ${prompt.trim()}
Preferred style or references: ${style ?? 'No specific style provided'}

Deliver the lyrics using clear sections (Verse, Chorus, Bridge) and keep it under 250 words.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: typeof temperature === 'number' ? temperature : 0.7,
        messages: [
          { role: 'system', content: systemInstructions },
          { role: 'user', content: userRequest }
        ]
      }),
      signal: controller.signal
    })

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}))
      const errorMessage = errorPayload?.error?.message || 'ChatGPT request failed.'
      throw new Error(errorMessage)
    }

    const payload = await response.json()
    const content: string = payload?.choices?.[0]?.message?.content?.trim() || ''

    if (!content) {
      throw new Error('ChatGPT returned an empty response. Try refining your prompt.')
    }

    const finishReason: string | undefined = payload?.choices?.[0]?.finish_reason
    const usage = payload?.usage

    return {
      lyrics: content,
      promptUsed: prompt,
      modelNote: `Generated with ${payload?.model ?? 'ChatGPT'}${finishReason ? ` • finish reason: ${finishReason}` : ''}${usage ? ` • tokens used: ${usage.total_tokens}` : ''}`
    }
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('ChatGPT request timed out. Please try again.')
    }

    const message = error instanceof Error ? error.message : 'Unable to generate lyrics.'
    throw new Error(message)
  } finally {
    window.clearTimeout(timeout)
  }
}

const normaliseSunoResponse = (payload: any, fallbackMessage?: string): SunoTrackResponse => {
  const jobId = extractSunoJobId(payload)
  const tracks: SunoGeneratedTrack[] | undefined = (() => {
    const clips = payload?.data?.clips || payload?.clips || payload?.data?.[0]?.clips
    if (Array.isArray(clips)) {
      return clips.map((clip: any) => ({
        audioUrl: extractSunoAudioUrl(clip) || clip?.audioUrl || clip?.streamUrl,
        audioDownloadUrl: clip?.audioDownloadUrl || clip?.downloadUrl,
        coverUrl: clip?.coverUrl || clip?.imageUrl,
        title: clip?.title,
        prompt: clip?.prompt,
        instrumental: clip?.instrumental
      }))
    }

    const audioUrl = extractSunoAudioUrl(payload) || payload?.data?.audioUrl
    if (audioUrl) {
      return [{
        audioUrl,
        audioDownloadUrl: payload?.data?.audioDownloadUrl || payload?.data?.downloadUrl,
        coverUrl: payload?.data?.coverUrl,
        title: payload?.data?.title,
        prompt: payload?.data?.prompt,
        instrumental: payload?.data?.instrumental
      }]
    }

    return undefined
  })()

  if (!jobId && !tracks) {
    throw new Error('Unexpected response from Suno. Could not find a job identifier.')
  }

  const status = normaliseSunoStatus(payload?.data?.status || payload?.status || payload?.state || (tracks ? 'completed' : undefined))

  return {
    jobId: jobId || crypto.randomUUID(),
    status,
    message: extractSunoMessage(payload) || fallbackMessage || 'Request submitted to Suno.',
    title: payload?.title,
    tracks,
    rawPayload: payload
  }
}

export const createSunoTrack = async (
  request: SunoTrackRequest
): Promise<SunoTrackResponse> => {
  const {
    apiKey,
    lyrics,
    title,
    tags,
    style,
    customMode = true,
    instrumental = false,
    model = 'V3_5',
    callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/suno-callback` : undefined,
    negativeTags,
    vocalGender,
    styleWeight,
    weirdnessConstraint,
    audioWeight
  } = request

  if (!apiKey) {
    throw new Error('Suno API key is required before creating a track.')
  }

  if (!lyrics.trim()) {
    throw new Error('Supply lyrics before requesting a Suno track.')
  }

  const response = await fetch(SUNO_GENERATE_ENDPOINT, {
    method: 'POST',
    headers: buildAuthHeaders(apiKey),
    body: JSON.stringify({
      prompt: customMode ? lyrics : tags?.join(', ') || lyrics,
      title,
      style,
      tags: tags && tags.length ? tags.join(', ') : undefined,
      customMode,
      instrumental,
      model,
      callBackUrl: callbackUrl,
      negativeTags,
      vocalGender,
      styleWeight,
      weirdnessConstraint,
      audioWeight
    })
  })

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}))
    const errorMessage = errorPayload?.error || errorPayload?.message || `Suno request failed (${response.status}).`
    throw new Error(errorMessage)
  }

  const payload = await response.json()
  return normaliseSunoResponse(payload, 'Suno generation request submitted.')
}

export const fetchSunoTrackStatus = async (
  apiKey: string,
  jobId: string
): Promise<SunoTrackResponse> => {
  if (!apiKey) {
    throw new Error('Suno API key is required to check job status.')
  }

  if (!jobId) {
    throw new Error('Missing Suno job identifier.')
  }

  const response = await fetch(buildStatusUrl(jobId), {
    method: 'GET',
    headers: buildAuthHeaders(apiKey)
  })

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}))
    const errorMessage = errorPayload?.error || errorPayload?.message || `Unable to fetch Suno job status (${response.status}).`
    throw new Error(errorMessage)
  }

  const payload = await response.json()
  return normaliseSunoResponse(payload, 'Polling Suno job status...')
}

const parseFilenameFromDisposition = (value: string | null, fallback: string) => {
  if (!value) return fallback
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)/i.exec(value)
  if (match && match[1]) {
    return decodeURIComponent(match[1])
  }
  return fallback
}

export const downloadSunoTrackFile = async (
  apiKey: string,
  trackUrl: string,
  fallbackName: string = 'suno-track.mp3'
): Promise<SunoTrackDownload> => {
  if (!trackUrl) {
    throw new Error('No Suno track URL to download.')
  }

  const response = await fetch(trackUrl, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined
  })

  if (!response.ok) {
    throw new Error(`Failed to download audio from Suno (${response.status}).`)
  }

  const blob = await response.blob()
  const mimeType = blob.type || 'audio/mpeg'
  const filename = parseFilenameFromDisposition(response.headers.get('content-disposition'), fallbackName)
  const objectUrl = URL.createObjectURL(blob)

  return {
    objectUrl,
    filename,
    mimeType
  }
}
