const dotenv = require('dotenv')
const express = require('express')
const { google } = require('googleapis')
const NodeCache = require('node-cache')

dotenv.config()
const cache = new NodeCache()

const app = express()
const port = 8080

// Your public Google Sheet ID and range
const RANGE = 'Sheet1!A1:B1000' // Adjust the range as needed

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
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: RANGE,
      key: process.env.GOOGLE_API_KEY, // Replace with your Google API Key
    })

    const lookups = response.data.values
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

app.get('/', (req, res) => {
  res.status(200).send('This is just for url forwarding. Nothing to see!\nMight I recommend <a href="https://sillysideprojects.com">Silly Side Projects</a>?')
})

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
