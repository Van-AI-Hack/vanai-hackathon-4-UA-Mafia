import { supabase } from '../lib/supabase'
import type { SunoGeneratedTrack } from './lyricsService'

export interface SunoHistoryEntry {
  id: string
  jobId: string
  createdAt: string
  updatedAt?: string | null
  title: string
  prompt: string
  style: string
  tags: string[]
  quizAnswers: Record<string, string>
  status: string
  message?: string | null
  tracks: SunoGeneratedTrack[]
  customMode?: boolean | null
  instrumentalOnly?: boolean | null
  model?: string | null
  negativeTags?: string[]
  vocalGender?: string | null
}

export interface SunoHistoryInsert {
  jobId: string
  title?: string
  prompt?: string
  style?: string
  tags?: string[]
  quizAnswers?: Record<string, string>
  status?: string
  message?: string
  tracks?: SunoGeneratedTrack[]
  customMode?: boolean
  instrumentalOnly?: boolean
  model?: string
  negativeTags?: string[]
  vocalGender?: string
}

export interface SunoHistoryPatch extends Partial<SunoHistoryInsert> {
  status?: string
  message?: string
  lastPolledAt?: string
}

type SunoHistoryRecord = {
  id: string
  job_id: string
  created_at: string
  updated_at: string | null
  title: string | null
  prompt: string | null
  style: string | null
  tags: string[] | null
  quiz_answers: Record<string, string> | null
  status: string | null
  message: string | null
  tracks: SunoGeneratedTrack[] | null
  custom_mode: boolean | null
  instrumental_only: boolean | null
  model: string | null
  negative_tags: string[] | null
  vocal_gender: string | null
  last_polled_at: string | null
}

const mapRecordToEntry = (record: SunoHistoryRecord): SunoHistoryEntry => {
  return {
    id: record.id,
    jobId: record.job_id,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    title: record.title ?? 'Untitled Track',
    prompt: record.prompt ?? '',
    style: record.style ?? '',
    tags: record.tags ?? [],
    quizAnswers: record.quiz_answers ?? {},
    status: record.status ?? 'pending',
    message: record.message,
    tracks: record.tracks ?? [],
    customMode: record.custom_mode,
    instrumentalOnly: record.instrumental_only,
    model: record.model,
    negativeTags: record.negative_tags ?? undefined,
    vocalGender: record.vocal_gender
  }
}

const mapInsertToRecord = (
  entry: SunoHistoryInsert | SunoHistoryPatch,
  { partial = false }: { partial?: boolean } = {}
) => {
  const record: Record<string, unknown> = {
    job_id: entry.jobId
  }

  if (!partial || 'title' in entry) {
    record.title = entry.title ?? null
  }

  if (!partial || 'prompt' in entry) {
    record.prompt = entry.prompt ?? null
  }

  if (!partial || 'style' in entry) {
    record.style = entry.style ?? null
  }

  if (!partial || 'tags' in entry) {
    record.tags = entry.tags ?? []
  }

  if (!partial || 'quizAnswers' in entry) {
    record.quiz_answers = entry.quizAnswers ?? {}
  }

  if (!partial || 'status' in entry) {
    record.status = entry.status ?? null
  }

  if (!partial || 'message' in entry) {
    record.message = entry.message ?? null
  }

  if (!partial || 'tracks' in entry) {
    record.tracks = entry.tracks ?? []
  }

  if (!partial || 'customMode' in entry) {
    record.custom_mode = entry.customMode ?? null
  }

  if (!partial || 'instrumentalOnly' in entry) {
    record.instrumental_only = entry.instrumentalOnly ?? null
  }

  if (!partial || 'model' in entry) {
    record.model = entry.model ?? null
  }

  if (!partial || 'negativeTags' in entry) {
    record.negative_tags = entry.negativeTags ?? []
  }

  if (!partial || 'vocalGender' in entry) {
    record.vocal_gender = entry.vocalGender ?? null
  }

  if ('lastPolledAt' in entry && entry.lastPolledAt) {
    record.last_polled_at = entry.lastPolledAt
  }

  return record
}

export const fetchSunoHistory = async (): Promise<SunoHistoryEntry[]> => {
  const { data, error } = await supabase
    .from('suno_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message || 'Unable to load Suno history from Supabase.')
  }

  return (data ?? []).map(mapRecordToEntry)
}

export const upsertSunoHistoryEntry = async (
  entry: SunoHistoryInsert
): Promise<SunoHistoryEntry> => {
  const payload = mapInsertToRecord(entry, { partial: false })
  const { data, error } = await supabase
    .from('suno_requests')
    .upsert(payload, { onConflict: 'job_id' })
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Unable to persist Suno history entry.')
  }

  return mapRecordToEntry(data as SunoHistoryRecord)
}

export const updateSunoHistoryEntry = async (
  jobId: string,
  patch: SunoHistoryPatch
): Promise<SunoHistoryEntry | null> => {
  if (!jobId) {
    return null
  }

  const payload = mapInsertToRecord({ ...patch, jobId }, { partial: true })
  payload.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('suno_requests')
    .update(payload)
    .eq('job_id', jobId)
    .select('*')
    .maybeSingle()

  if (error) {
    throw new Error(error.message || 'Unable to update Suno history entry.')
  }

  if (!data) {
    return null
  }

  return mapRecordToEntry(data as SunoHistoryRecord)
}
