# TV Show Ratings App

A web application for searching and rating TV shows using the OMDB API.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- OMDB API key (get one at http://www.omdbapi.com/apikey.aspx)

## Environment Setup

1. Client Setup:
   ```bash
   cd client
   cp .env.example .env
   # Edit .env with your values
   ```

2. Server Setup:
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your values
   ```

## Installation

1. Install dependencies for both client and server:
   ```bash
   # Install client dependencies
   cd client
   pnpm install

   # Install server dependencies
   cd ../server
   pnpm install
   ```

## Development

1. Start both applications using the development script:
   ```bash
   # From the root directory
   ./dev.bat    # Windows
   # OR
   ./dev.sh     # Linux/Mac
   ```

   This will start:
   - Client at http://localhost:5173
   - Server at http://localhost:5000

## Manual Start

If you prefer to start the applications separately:

1. Start the server:
   ```bash
   cd server
   pnpm dev
   ```

2. Start the client:
   ```bash
   cd client
   pnpm dev
   ```

### Required Environment Variables

#### Client (.env)
- `VITE_API_URL`: Backend API URL
- `VITE_APP_NAME`: Application name

#### Server (.env)
- `PORT`: Server port number
- `NODE_ENV`: Environment (development/production)
- `OMDB_API_KEY`: Your OMDB API key (get one at http://www.omdbapi.com/apikey.aspx)
- `CORS_ORIGIN`: Frontend URL for CORS

## Features

- Search TV shows using OMDB API
- View show details including ratings
- Dark/Light theme toggle
- Responsive design
- Pagination support

## Tech Stack

### Frontend
- React with Vite
- Tailwind CSS
- Axios for API requests
- Heroicons

### Backend
- Node.js
- Express
- OMDB API integration
- Caching support
