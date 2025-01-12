import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import showRoutes from './routes/showsRoutes';
import favoritesRoutes from './routes/favoritesRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(bodyParser.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/shows', showRoutes);
app.use('/api/favorites', favoritesRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
