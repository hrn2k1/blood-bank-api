import 'reflect-metadata';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDatabase } from './config/database';
import Config from './config/config';
import { swaggerSpec } from './config/swagger';
import { registerControllers } from './utils/router';
import { AuthController } from './controllers/AuthController';
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
    registerControllers(apiRouter, [AuthController, UserController, BloodRequestController, LocationController]);

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
║ Environment: ${Config.NODE_ENV.padEnd(41)} ║
║ Port: ${String(this.port).padEnd(48)} ║
║ API Prefix: ${Config.API_PREFIX.padEnd(42)} ║
║ Database: Connected                                    ║
║                                                        ║
║ Swagger UI: http://localhost:${this.port}/api-docs             ║
╚════════════════════════════════════════════════════════╝
        `);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start the application
const app = new App();
app.start().catch((error) => {
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
