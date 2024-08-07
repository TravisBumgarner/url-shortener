import dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import { getAuthUrl, getLongURLFromShortCode, getSheetData, getTokens } from './googleSheets'

dotenv.config()

const app = express()
const port = process.env.PORT ?? 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!')
})

app.get('/auth', (req: Request, res: Response) => {
  console.log('auth')
  const authUrl = getAuthUrl()
  res.redirect(authUrl)
})

app.get('/oauth2callback', async (req: Request, res: Response) => {
  console.log('oauth2callback')
  const code = req.query.code as string
  if (!code) {
    return res.status(400).send('No code query parameter found')
  }

  try {
    await getTokens(code)
    res.redirect('/data')
  } catch (error) {
    res.status(500).send('Error retrieving tokens')
  }
})

app.get('/data', async (req: Request, res: Response) => {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID

    if (!sheetId) throw Error('need sheet id')

    const range = 'Sheet1!A1:D10' // Modify the range according to your sheet
    const data = await getSheetData(sheetId, range)
    res.json(data)
  } catch (error) {
    console.log(error)
    res.status(500).send('Error retrieving sheet data')
  }
})

app.get('/sc/:shortcode', async (req: Request, res: Response) => {
  // Access the URL parameter
  const { shortcode } = req.params
  const longUrl = await getLongURLFromShortCode(shortcode)

  if (shortcode === undefined) {
    return res.send(`Not Found :(`)
  }
  res.send(`Long url received: ${longUrl}`)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
