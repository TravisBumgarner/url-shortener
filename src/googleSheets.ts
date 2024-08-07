import dotenv from 'dotenv'
import { google } from 'googleapis'

dotenv.config()

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
  throw new Error('Missing Google OAuth2 credentials in environment variables')
}

const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)

const sheets = google.sheets({ version: 'v4', auth: oAuth2Client })

export const getAuthUrl = (): string => {
  const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  })
}

export const getTokens = async (code: string) => {
  const { tokens } = await oAuth2Client.getToken(code)
  oAuth2Client.setCredentials(tokens)
  return tokens
}

export const getSheetData = async (sheetId: string, range: string) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  })
  return response.data.values
}

export const getLongURLFromShortCode = async (shortcode: string) => {
  const sheetId = process.env.GOOGLE_SHEET_ID ?? ''
  const RANGE = 'Sheet1!A2:B'

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: RANGE,
  })
  const lookups = response.data.values as Array<[string, string]>

  const match = lookups.find(entry => entry[0] === shortcode)

  if (match === undefined) {
    return undefined
  }

  return match[1]
}
