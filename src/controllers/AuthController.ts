import { Request, Response } from 'express';
import { Controller, Post } from '../decorators';
import { UserService } from '../services/UserService';

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Login with email or contact number and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Email address or contact number
 *               password:
 *                 type: string
 *           example:
 *             identifier: "john.doe@example.com"
 *             password: "Pass@123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "6a61aded-906a-4801-8543-d1d5ca9e0193"
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 contactNumber: "+880123456789"
 *                 type: "user"
 *                 divisionId: 1
 *                 districtId: 1
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Email/Contact number and password are required"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Invalid email/contact number or password"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User or bank registration
 *     description: Register a new user or blood bank in the system
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - contactNumber
 *               - email
 *               - password
 *               - type
 *               - divisionId
 *               - districtId
 *               - areaId
 *               - registrationDate
 *             properties:
 *               name:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [user, bank]
 *               divisionId:
 *                 type: number
 *               districtId:
 *                 type: number
 *               thanaId:
 *                 type: number
 *               areaId:
 *                 type: number
 *               registrationDate:
 *                 type: string
 *                 format: date-time
 *               props:
 *                 type: object
 *           example:
 *             name: "John Doe"
 *             contactNumber: "+880123456789"
 *             email: "john.doe@example.com"
 *             password: "Pass@123"
 *             type: "user"
 *             divisionId: 1
 *             districtId: 1
 *             areaId: 1
 *             registrationDate: "2024-06-01T00:00:00Z"
 *             props:
 *               address: "Sheikhpara, Joypurhat"
 *               photo: "https://example.com/photos/john_doe.jpg"
 *               birthDate: "1985-01-01"
 *               gender: "Male"
 *               bloodGroup: "A+"
 *               geolocation:
 *                  latitude: 23.8103
 *                  longitude: 89.5103
 *     responses:
 *       201:
 *         description: User or bank registered successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "6a61aded-906a-4801-8543-d1d5ca9e0193"
 *                 name: "John Doe"
 *                 contactNumber: "+880123456789"
 *                 email: "john.doe@example.com"
 *                 type: "user"
 *                 divisionId: 1
 *                 districtId: 1
 *                 areaId: 1
 *                 registrationDate: "2024-06-01T00:00:00Z"
 *                 props:
 *                   address: "Sheikhpara, Joypurhat"
 *       400:
 *         description: Invalid input or duplicate email/contact number
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Email already exists"
 */

@Controller('/auth')
export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  @Post('/login')
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        res.status(400).json({
          success: false,
          message: 'Email/Contact number and password are required',
        });
        return;
      }

      const user = await this.userService.login(identifier, password);

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email/contact number or password',
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Post('/register')
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;

      // Validate required fields
      const requiredFields = [
        'name',
        'contactNumber',
        'email',
        'password',
        'type',
        'divisionId',
        'districtId',
        'areaId',
        'registrationDate',
      ];

      for (const field of requiredFields) {
        if (!userData[field]) {
          res.status(400).json({
            success: false,
            message: `${field} is required`,
          });
          return;
        }
      }

      // Validate type is either 'user' or 'bank'
      if (!['user', 'bank'].includes(userData.type)) {
        res.status(400).json({
          success: false,
          message: 'Type must be either "user" or "bank"',
        });
        return;
      }

      const user = await this.userService.createUser(userData);

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }
}
