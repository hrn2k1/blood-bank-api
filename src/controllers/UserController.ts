import { Request, Response } from 'express';
import { Controller, Get, Post, Put, Delete } from '../decorators';
import { UserService } from '../services/UserService';

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User and blood bank management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users and blood banks with optional filters
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [user, bank]
 *         description: Filter by user type
 *       - in: query
 *         name: divisionId
 *         schema:
 *           type: number
 *         description: Filter by division ID
 *       - in: query
 *         name: districtId
 *         schema:
 *           type: number
 *         description: Filter by district ID
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               data:
 *                 - id: "6a61aded-906a-4801-8543-d1d5ca9e0193"
 *                   name: "John Doe"
 *                   contactNumber: "+880123456789"
 *                   email: "john.doe@example.com"
 *                   type: "user"
 *                   divisionId: 1
 *                   districtId: 1
 *                   areaId: 1
 *                   registrationDate: "2024-06-01T00:00:00Z"
 *                   props:
 *                     address: "Sheikhpara, Joypurhat"
 *                     bloodGroup: "A+"
 *                     gender: "Male"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user or blood bank in the system
 *     tags:
 *       - Users
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
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
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
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their unique ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "6a61aded-906a-4801-8543-d1d5ca9e0193"
 *     responses:
 *       200:
 *         description: User retrieved successfully
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update user
 *     description: Update user information
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Jane Doe"
 *             contactNumber: "+880987654321"
 *             props:
 *               address: "New Address, Dhaka"
 *     responses:
 *       200:
 *         description: User updated successfully
 *   delete:
 *     summary: Delete user
 *     description: Remove a user from the system
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by name
 *     description: Search for users using a name query
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *         example: "John"
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: "6a61aded-906a-4801-8543-d1d5ca9e0193"
 *                   name: "John Doe"
 *                   email: "john@example.com"
 */

/**
 * @swagger
 * /users/banks/location:
 *   get:
 *     summary: Get blood banks by location
 *     description: Retrieve blood banks filtered by division and optionally by district
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: divisionId
 *         required: true
 *         schema:
 *           type: number
 *         description: Division ID
 *         example: 1
 *       - in: query
 *         name: districtId
 *         schema:
 *           type: number
 *         description: District ID (optional)
 *         example: 1
 *     responses:
 *       200:
 *         description: List of blood banks
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: "0af25096-8a67-4c44-b990-e5848ff80069"
 *                   name: "Joypurhat Blood Bank"
 *                   type: "bank"
 *                   divisionId: 1
 *                   districtId: 1
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Update user
 *     tags:
 *       - Users
 *   delete:
 *     summary: Delete user
 *     tags:
 *       - Users
 */

@Controller('/users')
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  @Get()
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { type, divisionId, districtId } = req.query;

      let users;
      if (type) {
        users = await this.userService.getUsersByType(type as 'user' | 'bank');
      } else if (divisionId) {
        users = await this.userService.getUsersByLocation(Number(divisionId), districtId ? Number(districtId) : undefined);
      } else {
        users = await this.userService.getAllUsers();
      }

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('/:id')
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
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

  @Post()
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
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

  @Put('/:id')
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await this.userService.updateUser(id, userData);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
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

  @Delete('/:id')
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.deleteUser(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'User deleted successfully',
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('/search')
  async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
        return;
      }

      const users = await this.userService.searchUsers(q);

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('/banks/location')
  async getBanksByLocation(req: Request, res: Response): Promise<void> {
    try {
      const { divisionId, districtId } = req.query;

      if (!divisionId) {
        res.status(400).json({
          success: false,
          message: 'divisionId is required',
        });
        return;
      }

      const banks = await this.userService.getBanksByLocation(Number(divisionId), districtId ? Number(districtId) : undefined);

      res.json({
        success: true,
        data: banks,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }
}
