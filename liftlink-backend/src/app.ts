import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { authMiddleware } from './middleware/auth.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import rideRoutes from './routes/ride.routes';
import driverRoutes from './routes/driver.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';

// Import services
import { RedisService } from './services/redis.service';
import { SocketService } from './services/socket.service';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

class App {
  public app: express.Application;
  public server: any;
  public io: Server;
  private redisService: RedisService;
  private socketService: SocketService;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.initializeServices();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocketHandlers();
  }

  private initializeServices(): void {
    this.redisService = new RedisService();
    this.socketService = new SocketService(this.io);
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    this.app.use(morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim())
      }
    }));

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', authMiddleware, userRoutes);
    this.app.use('/api/rides', authMiddleware, rideRoutes);
    this.app.use('/api/drivers', authMiddleware, driverRoutes);
    this.app.use('/api/payments', authMiddleware, paymentRoutes);
    this.app.use('/api/admin', authMiddleware, adminRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private initializeSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);
      this.socketService.handleConnection(socket);
    });
  }

  public listen(): void {
    const port = process.env.PORT || 3001;
    
    this.server.listen(port, () => {
      logger.info(`🚀 LiftLink Backend Server running on port ${port}`);
      logger.info(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 Health check: http://localhost:${port}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
    process.on('SIGINT', this.gracefulShutdown.bind(this));
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    // Close server
    this.server.close(() => {
      logger.info('HTTP server closed');
    });

    // Close Redis connection
    await this.redisService.disconnect();
    
    // Close Socket.io
    this.io.close();
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  }
}

// Create and start the application
const app = new App();

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen();
}

export default app;
