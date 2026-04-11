import 'reflect-metadata';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDatabase } from './config/database';
import Config from './config/config';
import { swaggerSpec } from './config/swagger';
import { registerControllers } from './utils/router';
import { UserController } from './controllers/UserController';
import { BloodRequestController } from './controllers/BloodRequestController';
import { LocationController } from './controllers/LocationController';

class App {
  public app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(Config.PORT);

    this.middleware();
    this.routes();
  }

  private middleware(): void {
    // CORS middleware
    this.app.use(cors());

    // Body parser middleware
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    // Health check route
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Swagger UI
    this.app.use('/api-docs', swaggerUi.serve);
    this.app.get('/api-docs', swaggerUi.setup(swaggerSpec, { swaggerOptions: { defaultModelsExpandDepth: 2 } }));
  }

  private routes(): void {
    // API routes
    const apiRouter = express.Router();

    // Register decorated controllers
    registerControllers(apiRouter, [UserController, BloodRequestController, LocationController]);

    // Mount API router
    this.app.use(Config.API_PREFIX, apiRouter);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();

      // Start server
      this.app.listen(this.port, () => {
        console.log(`
╔════════════════════════════════════════════════════════╗
║          Blood Bank API Server Running                 ║
╠════════════════════════════════════════════════════════╣
║ Environment: ${Config.NODE_ENV.padEnd(40)} ║
║ Port: ${String(this.port).padEnd(47)} ║
║ API Prefix: ${Config.API_PREFIX.padEnd(43)} ║
║ Database: Connected                                   ║
║                                                        ║
║ Swagger UI: http://localhost:${this.port}/api-docs    ║
╚════════════════════════════════════════════════════════╝
        `);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Create the application instance
const appInstance = new App();

// For Vercel serverless deployment
// Connect to database once and export the Express app
let isConnected = false;

const handler = async (req: express.Request, res: express.Response) => {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  return appInstance.app(req, res);
};

// Export for Vercel
export default handler;

// For local development
if (process.env.NODE_ENV !== 'production') {
  appInstance.start().catch((error) => {
    console.error(error);
    process.exit(1);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
  });
}
