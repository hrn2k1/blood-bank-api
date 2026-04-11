import { Request, Response } from 'express';
import { Controller, Get, Post, Put, Delete } from '../decorators';
import { BloodRequestService } from '../services/BloodRequestService';

/**
 * @swagger
 * tags:
 *   - name: Blood Requests
 *     description: Blood request management endpoints
 */

/**
 * @swagger
 * /blood-requests:
 *   get:
 *     summary: Get all blood requests
 *     tags:
 *       - Blood Requests
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, completed, rejected]
 *       - in: query
 *         name: bloodGroup
 *         schema:
 *           type: string
 *       - in: query
 *         name: urgencyLevel
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *   post:
 *     summary: Create blood request
 *     tags:
 *       - Blood Requests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 */
/**
 * @swagger
 * /blood-requests/{id}:
 *   get:
 *     summary: Get blood request by ID
 *     tags:
 *       - Blood Requests
 *   put:
 *     summary: Update blood request
 *     tags:
 *       - Blood Requests
 *   delete:
 *     summary: Delete blood request
 *     tags:
 *       - Blood Requests
 */

@Controller('/blood-requests')
export class BloodRequestController {
  private bloodRequestService: BloodRequestService;

  constructor() {
    this.bloodRequestService = new BloodRequestService();
  }

  @Get()
  async getAllBloodRequests(req: Request, res: Response): Promise<void> {
    try {
      const { status, bloodGroup, urgencyLevel } = req.query;

      let requests;
      if (status) {
        requests = await this.bloodRequestService.getBloodRequestsByStatus(status as any);
      } else if (urgencyLevel === 'high' || urgencyLevel === 'critical') {
        requests = await this.bloodRequestService.getUrgentBloodRequests();
      } else if (bloodGroup) {
        requests = await this.bloodRequestService.getBloodRequestsByBloodGroup(bloodGroup as string);
      } else {
        requests = await this.bloodRequestService.getAllBloodRequests();
      }

      res.json({
        success: true,
        data: requests,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('/:id')
  async getBloodRequestById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const request = await this.bloodRequestService.getBloodRequestById(id);

      if (!request) {
        res.status(404).json({
          success: false,
          message: 'Blood request not found',
        });
        return;
      }

      res.json({
        success: true,
        data: request,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Post()
  async createBloodRequest(req: Request, res: Response): Promise<void> {
    try {
      const requestData = req.body;
      const request = await this.bloodRequestService.createBloodRequest(requestData);

      res.status(201).json({
        success: true,
        data: request,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Put('/:id')
  async updateBloodRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const requestData = req.body;
      const request = await this.bloodRequestService.updateBloodRequest(id, requestData);

      if (!request) {
        res.status(404).json({
          success: false,
          message: 'Blood request not found',
        });
        return;
      }

      res.json({
        success: true,
        data: request,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Delete('/:id')
  async deleteBloodRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const request = await this.bloodRequestService.deleteBloodRequest(id);

      if (!request) {
        res.status(404).json({
          success: false,
          message: 'Blood request not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Blood request deleted successfully',
        data: request,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('/requester/:requesterId')
  async getBloodRequestsByRequesterId(req: Request, res: Response): Promise<void> {
    try {
      const { requesterId } = req.params;
      const requests = await this.bloodRequestService.getBloodRequestsByRequesterId(requesterId);

      res.json({
        success: true,
        data: requests,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('/bank/:bankId')
  async getBloodRequestsByBankId(req: Request, res: Response): Promise<void> {
    try {
      const { bankId } = req.params;
      const requests = await this.bloodRequestService.getBloodRequestsByBankId(bankId);

      res.json({
        success: true,
        data: requests,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Post('/:id/add-donor')
  async addDonorToRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { donorId, unitsDonated, donationDate } = req.body;

      const request = await this.bloodRequestService.addDonorToRequest(id, {
        donorId,
        unitsDonated,
        donationDate,
      });

      if (!request) {
        res.status(404).json({
          success: false,
          message: 'Blood request not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Donor added to request',
        data: request,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Put('/:id/status')
  async updateBloodRequestStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'approved', 'completed', 'rejected'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status',
        });
        return;
      }

      const request = await this.bloodRequestService.updateBloodRequestStatus(id, status);

      if (!request) {
        res.status(404).json({
          success: false,
          message: 'Blood request not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Blood request status updated',
        data: request,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }
}
