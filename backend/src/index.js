import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'TalentVault API',
    version: config.apiVersion,
    status: 'running',
  });
});

// API routes
app.use(`/api/${config.apiVersion}`, routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║           🚀 TalentVault Backend Server                 ║
║                                                          ║
║   Environment: ${config.nodeEnv.padEnd(43)}║
║   Port:        ${PORT.toString().padEnd(43)}║
║   API Version: ${config.apiVersion.padEnd(43)}║
║                                                          ║
║   Server running at: http://localhost:${PORT.toString().padEnd(20)}║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

export default app;
