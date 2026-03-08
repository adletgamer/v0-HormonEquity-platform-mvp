import OpenAI from 'openai'

const FEATHERLESS_BASE_URL =
  process.env.FEATHERLESS_BASE_URL || 'https://api.featherless.ai/v1'

const FEATHERLESS_API_KEY = process.env.FEATHERLESS_API_KEY

export const FEATHERLESS_MODEL =
  process.env.FEATHERLESS_MODEL || 'meta-llama/Meta-Llama-3.1-8B-Instruct'

let cachedClient: OpenAI | null = null

export function getFeatherlessClient(): OpenAI {
  if (!FEATHERLESS_API_KEY) {
    throw new Error('Missing FEATHERLESS_API_KEY in environment variables')
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({
      apiKey: FEATHERLESS_API_KEY,
      baseURL: FEATHERLESS_BASE_URL,
    })
  }

  return cachedClient
}
