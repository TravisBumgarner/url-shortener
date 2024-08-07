import dotenv from 'dotenv'
import express from 'express'
import { google } from 'googleapis'
import NodeCache from 'node-cache'

dotenv.config()
const cache = new NodeCache()

const app = express()
const port = 3000

// Your public Google Sheet ID and range
const SPREADSHEET_ID = '1aIV-J3SgbS4AEZexb6sH0r6us3EfP9onD8_098CZmCs'
const RANGE = 'Sheet1!A1:D10' // Adjust the range as needed

// Initialize Google Sheets API
const sheets = google.sheets('v4')

// Define a route to fetch data from Google Sheets
app.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params
  const cacheHitLongUrl = cache.get(shortcode)
  if (cacheHitLongUrl !== undefined) {
    return res.send(`Long url from cache: ${cacheHitLongUrl}`)
  }
  try {
    // Create a Google Sheets client with no authentication (for public sheets)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      key: process.env.GOOGLE_API_KEY, // Replace with your Google API Key
    })

    const lookups = response.data.values as Array<[string, string]>
    if (lookups === undefined) {
      res.status(404).send('The URL you were looking for could not be found')
      return
    }

    const match = lookups.find(entry => entry[0] === shortcode)

    if (match === undefined) {
      res.status(404).send('The URL you were looking for could not be found')
      return
    }

    res.redirect(match[1])
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Server Error')
  }
})

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
