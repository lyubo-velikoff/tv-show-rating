import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import showRoutes from './routes/showsRoutes';
import favoritesRoutes from './routes/favoritesRoutes';

const app = express();

app.use(cors()); // Enable CORS
app.use(bodyParser.json());
// app.use('/api/shows', showRoutes); // Use /api/shows for show-related routes
// app.use('/api/favorites', favoritesRoutes); // Use /api/favorites for favorites-related routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
