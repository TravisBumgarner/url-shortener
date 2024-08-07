# url-shortener

A URL Shortener with a built in cache, powered by Google Sheets as the database.

## Deploy

1. `yarn deploy`
2. Copy .env variables to Cloud Run -> Select url-shortener -> Edit & Deploy New Revision -> Variables & Secrets
3. Deploy. 

## Local Setup

1. `yarn` install dependencies
2. `cp .env.example .env`
3. Create a Google Sheet and get its Id and paste it in the `.env` file under GOOGLE_SHEET_ID.
    - The ID will be in the URL ` https://docs.google.com/spreadsheets/d/[thisistheid]/edit?gid=0#gid=0`
4. Set it to viewable by all.
5. Navigate to console.cloud.google.com and enable Google Sheets API `APIs & Services -> Library` and navigate to Google Sheets API
6. Under Crendentials in left sidebar add API Key
7. Fill in .env with GOOGLE_API_KEY

