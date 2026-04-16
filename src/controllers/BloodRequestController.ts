import { Request, Response } from 'express';
import { Controller, Get, Post, Put, Delete, Authenticated } from '../decorators';
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
 *     description: Retrieve blood requests with optional filters by status, blood group, or urgency
 *     tags:
 *       - Blood Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, completed, rejected]
 *         description: Filter by request status
 *       - in: query
 *         name: bloodGroup
 *         schema:
 *           type: string
 *         description: Filter by blood group
 *       - in: query
 *         name: urgencyLevel
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         description: Filter by urgency level
 *     responses:
 *       200:
 *         description: List of blood requests retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: "1a2b3c4d-5678-90ab-cdef-1234567890ab"
 *                   requesterId: "6a61aded-906a-4801-8543-d1d5ca9e0193"
 *                   bankId: "0af25096-8a67-4c44-b990-e5848ff80069"
 *                   bloodGroup: "A+"
 *                   unitsRequired: 2
 *                   status: "pending"
 *                   urgencyLevel: "high"
 *                   requestDate: "2024-06-01T00:00:00Z"
 *                   address: "Sheikhpara, Joypurhat"
 *                   reason: "Surgery"
 *                   donors: []
 *       401:
 *         description: Unauthorized - Missing or invalid Bearer token
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     summary: Create blood request
 *     description: Submit a new blood request
 *     tags:
 *       - Blood Requests
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requesterId
 *               - bankId
 *               - bloodGroup
 *               - unitsRequired
 *               - requestDate
 *               - address
 *               - reason
 *               - urgencyLevel
 *           example:
 *             requesterId: "6a61aded-906a-4801-8543-d1d5ca9e0193"
 *             bankId: "0af25096-8a67-4c44-b990-e5848ff80069"
 *             bloodGroup: "A+"
 *             unitsRequired: 2
 *             requestDate: "2024-06-01T00:00:00Z"
 *             address: "Sheikhpara, Joypurhat"
 *             reason: "Surgery"
 *             urgencyLevel: "high"
 *             comment: "Need blood for surgery"
 *     responses:
 *       201:
 *         description: Blood request created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "1a2b3c4d-5678-90ab-cdef-1234567890ab"
 *                 requesterId: "6a61aded-906a-4801-8543-d1d5ca9e0193"
 *                 bankId: "0af25096-8a67-4c44-b990-e5848ff80069"
 *                 bloodGroup: "A+"
 *                 unitsRequired: 2
 *                 status: "pending"
 *                 urgencyLevel: "high"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Unauthorized - Missing or invalid Bearer token'
 */

/**
 * @swagger
 * /blood-requests/{id}:
 *   get:
 *     summary: Get blood request by ID
 *     description: Retrieve a specific blood request with all details
 *     tags:
 *       - Blood Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1a2b3c4d-5678-90ab-cdef-1234567890ab"
 *     responses:
 *       200:
 *         description: Blood request retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "1a2b3c4d-5678-90ab-cdef-1234567890ab"
 *                 requesterId: "6a61aded-906a-4801-8543-d1d5ca9e0193"
 *                 bankId: "0af25096-8a67-4c44-b990-e5848ff80069"
 *                 bloodGroup: "A+"
 *                 unitsRequired: 2
 *                 status: "pending"
 *                 urgencyLevel: "high"
 *                 donors:
 *                   - donorId: "donor-123"
 *                     unitsDonated: 1
 *                     donationDate: "2024-06-02T00:00:00Z"
 *       401:
 *         description: Unauthorized - Missing or invalid Bearer token
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update blood request
 *     description: Update blood request details
 *     tags:
 *       - Blood Requests
 *     security:
 *       - bearerAuth: []
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
 *             unitsRequired: 3
 *             urgencyLevel: "critical"
 *             comment: "Urgent update"
 *     responses:
 *       200:
 *         description: Blood request updated successfully
 *       401:
 *         description: Unauthorized - Missing or invalid Bearer token
 *   delete:
 *     summary: Delete blood request
 *     description: Remove a blood request from the system
 *     tags:
 *       - Blood Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blood request deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /blood-requests/requester/{requesterId}:
 *   get:
 *     summary: Get requests by requester
 *     description: Retrieve all blood requests made by a specific user
 *     tags:
 *       - Blood Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requesterId
 *         required: true
 *         schema:
 *           type: string
 *         example: "6a61aded-906a-4801-8543-d1d5ca9e0193"
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: "1a2b3c4d-5678-90ab-cdef-1234567890ab"
 *                   requesterId: "6a61aded-906a-4801-8543-d1d5ca9e0193"
 *                   status: "pending"
 */

/**
 * @swagger
 * /blood-requests/bank/{bankId}:
 *   get:
 *     summary: Get requests for a bank
 *     description: Retrieve all blood requests sent to a specific blood bank
 *     tags:
 *       - Blood Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bankId
 *         required: true
 *         schema:
 *           type: string
 *         example: "0af25096-8a67-4c44-b990-e5848ff80069"
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 */

/**
 * @swagger
 * /blood-requests/{id}/add-donor:
 *   post:
 *     summary: Add donor to request
 *     description: Record a donation for a blood request
 *     tags:
 *       - Blood Requests
 *     security:
 *       - bearerAuth: []
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
 *             donorId: "donor-123"
 *             unitsDonated: 1
 *             donationDate: "2024-06-02T10:30:00Z"
 *     responses:
 *       200:
 *         description: Donor added to request successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Donor added to request"
 *               data:
 *                 id: "1a2b3c4d-5678-90ab-cdef-1234567890ab"
 *                 donors:
 *                   - donorId: "donor-123"
 *                     unitsDonated: 1
 *                     donationDate: "2024-06-02T10:30:00Z"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /blood-requests/{id}/status:
 *   put:
 *     summary: Update request status
 *     description: Change the status of a blood request
 *     tags:
 *       - Blood Requests
 *     security:
 *       - bearerAuth: []
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
 *             status: "approved"
 *     responses:
 *       200:
 *         description: Request status updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Blood request status updated"
 *               data:
 *                 id: "1a2b3c4d-5678-90ab-cdef-1234567890ab"
 *                 status: "approved"
 *       400:
 *         description: Invalid status provided
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

@Controller('/blood-requests')
export class BloodRequestController {
  private bloodRequestService: BloodRequestService;

  constructor() {
    this.bloodRequestService = new BloodRequestService();
  }

  @Authenticated()
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

  @Authenticated()
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

  @Authenticated()
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

  @Authenticated()
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

  @Authenticated()
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

  @Authenticated()
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

  @Authenticated()
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

  @Authenticated()
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

  @Authenticated()
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
