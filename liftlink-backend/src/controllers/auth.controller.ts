import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { EmailService } from '../services/email.service';
import { logger } from '../utils/logger';
import { ApiResponse } from '../utils/apiResponse';
import { AppError } from '../utils/appError';

export class AuthController {
  private authService: AuthService;
  private userService: UserService;
  private emailService: EmailService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
    this.emailService = new EmailService();
  }

  /**
   * Register a new user
   */
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const { email, password, firstName, lastName, phoneNumber, userType } = req.body;

      // Check if user already exists
      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        throw new AppError('User already exists with this email', 409);
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const userData = {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        userType,
        isEmailVerified: false,
        isPhoneVerified: false,
        status: 'active'
      };

      const user = await this.userService.create(userData);

      // Generate email verification token
      const verificationToken = await this.authService.generateEmailVerificationToken(user.id);

      // Send verification email
      await this.emailService.sendVerificationEmail(user.email, verificationToken, user.firstName);

      // Generate JWT token
      const token = this.authService.generateJWT(user.id, user.email, user.userType);

      // Remove password from response
      const { password: _, ...userResponse } = user;

      logger.info(`User registered successfully: ${user.email}`);

      res.status(201).json(
        ApiResponse.success(
          {
            user: userResponse,
            token,
            message: 'Registration successful. Please check your email to verify your account.'
          },
          'User registered successfully',
          201
        )
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   */
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check if user is active
      if (user.status !== 'active') {
        throw new AppError('Account is suspended. Please contact support.', 403);
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      // Update last login
      await this.userService.updateLastLogin(user.id);

      // Generate JWT token
      const token = this.authService.generateJWT(user.id, user.email, user.userType);

      // Remove password from response
      const { password: _, ...userResponse } = user;

      logger.info(`User logged in successfully: ${user.email}`);

      res.status(200).json(
        ApiResponse.success(
          {
            user: userResponse,
            token
          },
          'Login successful'
        )
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verify email
   */
  public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params;

      // Verify token
      const userId = await this.authService.verifyEmailToken(token);
      if (!userId) {
        throw new AppError('Invalid or expired verification token', 400);
      }

      // Update user email verification status
      await this.userService.updateEmailVerification(userId, true);

      logger.info(`Email verified for user ID: ${userId}`);

      res.status(200).json(
        ApiResponse.success(
          { emailVerified: true },
          'Email verified successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Forgot password
   */
  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const { email } = req.body;

      // Find user by email
      const user = await this.userService.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not
        res.status(200).json(
          ApiResponse.success(
            {},
            'If an account with that email exists, we have sent a password reset link.'
          )
        );
        return;
      }

      // Generate password reset token
      const resetToken = await this.authService.generatePasswordResetToken(user.id);

      // Send password reset email
      await this.emailService.sendPasswordResetEmail(user.email, resetToken, user.firstName);

      logger.info(`Password reset requested for user: ${user.email}`);

      res.status(200).json(
        ApiResponse.success(
          {},
          'If an account with that email exists, we have sent a password reset link.'
        )
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Reset password
   */
  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const { token } = req.params;
      const { password } = req.body;

      // Verify reset token
      const userId = await this.authService.verifyPasswordResetToken(token);
      if (!userId) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Update user password
      await this.userService.updatePassword(userId, hashedPassword);

      // Invalidate all existing tokens for this user
      await this.authService.invalidateUserTokens(userId);

      logger.info(`Password reset successfully for user ID: ${userId}`);

      res.status(200).json(
        ApiResponse.success(
          {},
          'Password reset successfully. Please login with your new password.'
        )
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh token
   */
  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
      
      // Find user
      const user = await this.userService.findById(decoded.userId);
      if (!user || user.status !== 'active') {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new access token
      const newToken = this.authService.generateJWT(user.id, user.email, user.userType);

      res.status(200).json(
        ApiResponse.success(
          { token: newToken },
          'Token refreshed successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout user
   */
  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (userId) {
        // Add token to blacklist or invalidate session
        await this.authService.invalidateUserTokens(userId);
        logger.info(`User logged out: ${userId}`);
      }

      res.status(200).json(
        ApiResponse.success(
          {},
          'Logged out successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current user profile
   */
  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const user = await this.userService.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Remove password from response
      const { password: _, ...userResponse } = user;

      res.status(200).json(
        ApiResponse.success(
          { user: userResponse },
          'Profile retrieved successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  };
}
