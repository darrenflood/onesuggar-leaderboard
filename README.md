# 1Sugar UAT — Feedback Sprint Leaderboard

Live animated leaderboard tracking bug/feedback submissions during the 1Sugar UAT sprint.

## Setup

### Prerequisites
- Node.js 18+
- A read-only ClickUp API token

### Getting a ClickUp API Token
1. Go to ClickUp → Settings → Apps
2. Click **Generate** under API Token
3. Copy the token (starts with `pk_`)

### Local Development
```bash
npm install
cp .env.example .env
# Edit .env and paste your ClickUp API token
npm start
# Open http://localhost:3000
```

### Deploy to Railway
1. Push this repo to GitHub
2. Create a new Railway project linked to the repo
3. Set the environment variable:
   ```
   railway variables set CLICKUP_TOKEN=pk_your_token_here
   ```
4. Railway will auto-deploy on every push to `main`

## Stack
- **Backend:** Node.js + Express
- **Frontend:** Vanilla HTML/CSS/JS (single file)
- **Data:** ClickUp API v2
