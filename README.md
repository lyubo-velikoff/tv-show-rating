# TV Show Ratings App

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

### Required Environment Variables

#### Client (.env)
- `VITE_API_URL`: Backend API URL
- `VITE_APP_NAME`: Application name

#### Server (.env)
- `PORT`: Server port number
- `NODE_ENV`: Environment (development/production)
- `OMDB_API_KEY`: Your OMDB API key (get one at http://www.omdbapi.com/apikey.aspx)
- `CORS_ORIGIN`: Frontend URL for CORS 
