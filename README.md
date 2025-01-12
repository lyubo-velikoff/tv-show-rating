# TV Show Ratings

A web application that combines ratings from IMDb, Viki, and MyDramaList.

## Features

- Search TV shows across multiple platforms
- View combined ratings from IMDb, Viki, and MyDramaList
- Dark mode support
- Responsive design

## Tech Stack

- Frontend:
  - React with TypeScript
  - Vite
  - TailwindCSS
  - HeadlessUI
  - Axios

- Backend:
  - Node.js with TypeScript
  - Express
  - Cheerio for web scraping
  - Node-Cache for caching

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   cd client && pnpm install
   cd ../server && pnpm install
   ```

3. Create environment files:
   - `client/.env`:

     ```env
     VITE_API_URL=http://localhost:3000
     VITE_APP_NAME=TV Show Ratings
     ```

   - `server/.env`:

     ```env
     NODE_ENV=development
     PORT=3000
     OMDB_API_KEY=your_omdb_api_key_here
     VIKI_TOKEN=your_viki_token_here
     CORS_ORIGIN=http://localhost:5173
     ```

4. Start development servers:

   ```bash
   ./dev.bat
   ```

   Or manually:

   ```bash
   cd client && pnpm dev
   cd server && pnpm dev
   ```

## Development

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3000>

## Building

```bash
cd client && pnpm build
cd server && pnpm build
```
