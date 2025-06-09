import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { RedisService } from '../services/redis.service';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        userType: string;
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
      };
    }
  }
}

export class AuthMiddleware {
  private userService: UserService;
  private redisService: RedisService;

  constructor() {
    this.userService = new UserService();
    this.redisService = new RedisService();
  }

  /**
   * Verify JWT token and authenticate user
   */
  public authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : null;

      if (!token) {
        throw new AppError('Access token is required', 401);
      }

      // Check if token is blacklisted
      const isBlacklisted = await this.redisService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new AppError('Token has been invalidated', 401);
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Get user from database
      const user = await this.userService.findById(decoded.userId);
      if (!user) {
        throw new AppError('User not found', 401);
      }

      // Check if user is active
      if (user.status !== 'active') {
        throw new AppError('Account is suspended', 403);
      }

      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email,
        userType: user.userType,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new AppError('Invalid token', 401));
      } else if (error instanceof jwt.TokenExpiredError) {
        next(new AppError('Token has expired', 401));
      } else {
        next(error);
      }
    }
  };

  /**
   * Check if user has required role
   */
  public authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      if (!roles.includes(req.user.userType)) {
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    };
  };

  /**
   * Check if user's email is verified
   */
  public requireEmailVerification = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (!req.user.isEmailVerified) {
      throw new AppError('Email verification required', 403);
    }

    next();
  };

  /**
   * Check if user's phone is verified
   */
  public requirePhoneVerification = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (!req.user.isPhoneVerified) {
      throw new AppError('Phone verification required', 403);
    }

    next();
  };

  /**
   * Optional authentication - doesn't throw error if no token
   */
  public optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : null;

      if (!token) {
        return next();
      }

      // Check if token is blacklisted
      const isBlacklisted = await this.redisService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        return next();
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Get user from database
      const user = await this.userService.findById(decoded.userId);
      if (user && user.status === 'active') {
        req.user = {
          id: user.id,
          email: user.email,
          userType: user.userType,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified
        };
      }

      next();
    } catch (error) {
      // Ignore authentication errors for optional auth
      next();
    }
  };

  /**
   * Rate limiting for specific user
   */
  public userRateLimit = (maxRequests: number, windowMs: number) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!req.user) {
        return next();
      }

      const key = `rate_limit:${req.user.id}:${req.route?.path || req.path}`;
      const current = await this.redisService.increment(key, windowMs);

      if (current > maxRequests) {
        throw new AppError('Rate limit exceeded', 429);
      }

      next();
    };
  };

  /**
   * Check if user is driver
   */
  public requireDriver = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.userType !== 'driver' && req.user.userType !== 'both') {
      throw new AppError('Driver access required', 403);
    }

    next();
  };

  /**
   * Check if user is passenger
   */
  public requirePassenger = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.userType !== 'passenger' && req.user.userType !== 'both') {
      throw new AppError('Passenger access required', 403);
    }

    next();
  };

  /**
   * Check if user is admin
   */
  public requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (req.user.userType !== 'admin') {
      throw new AppError('Admin access required', 403);
    }

    next();
  };

  /**
   * Log user activity
   */
  public logActivity = (action: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.user) {
        logger.info(`User activity: ${req.user.id} - ${action}`, {
          userId: req.user.id,
          action,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString()
        });
      }
      next();
    };
  };
}

// Create singleton instance
const authMiddleware = new AuthMiddleware();

// Export individual middleware functions
export const authenticate = authMiddleware.authenticate;
export const authorize = authMiddleware.authorize;
export const requireEmailVerification = authMiddleware.requireEmailVerification;
export const requirePhoneVerification = authMiddleware.requirePhoneVerification;
export const optionalAuth = authMiddleware.optionalAuth;
export const userRateLimit = authMiddleware.userRateLimit;
export const requireDriver = authMiddleware.requireDriver;
export const requirePassenger = authMiddleware.requirePassenger;
export const requireAdmin = authMiddleware.requireAdmin;
export const logActivity = authMiddleware.logActivity;

// Export default middleware (authenticate)
export { authenticate as authMiddleware };
