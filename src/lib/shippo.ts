import { Shippo } from 'shippo'

const API_KEY = process.env.SHIPPO_API_KEY!

export const shippo = new Shippo({ apiKeyHeader: API_KEY })
