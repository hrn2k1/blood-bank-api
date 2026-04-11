import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDatabase } from '../src/config/database';
import Config from '../src/config/config';
import { swaggerSpec } from '../src/config/swagger';
import { registerControllers } from '../src/utils/router';
import { UserController } from '../src/controllers/UserController';
import { BloodRequestController } from '../src/controllers/BloodRequestController';
import { LocationController } from '../src/controllers/LocationController';

// Create Express app
const app: Express = express();

// CORS middleware
app.use(cors());

// Body parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, { swaggerOptions: { defaultModelsExpandDepth: 2 } }));

// API routes
const apiRouter = express.Router();
registerControllers(apiRouter, [UserController, BloodRequestController, LocationController]);
app.use(Config.API_PREFIX, apiRouter);

// Database connection state
let isConnected = false;

// Serverless handler
const handler = async (req: Request, res: Response) => {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  return app(req, res);
};

export default handler;
