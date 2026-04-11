import { Request, Response } from 'express';
import { Controller, Get, Post, Put, Delete } from '../decorators';
import { LocationService } from '../services/LocationService';

/**
 * @swagger
 * tags:
 *   - name: Locations
 *     description: Location hierarchy management (division, district, thana, area)
 */

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Get all locations
 *     tags:
 *       - Locations
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [division, district, thana, area]
 *   post:
 *     summary: Create location
 *     tags:
 *       - Locations
 */
/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     summary: Get location by ID
 *     tags:
 *       - Locations
 *   put:
 *     summary: Update location
 *     tags:
 *       - Locations
 *   delete:
 *     summary: Delete location
 *     tags:
 *       - Locations
 */

@Controller('/locations')
export class LocationController {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  @Get()
  async getAllLocations(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.query;

      let locations;
      if (type) {
        locations = await this.locationService.getLocationsByType(type as any);
      } else {
        locations = await this.locationService.getAllLocations();
      }

      res.json({
        success: true,
        data: locations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('/divisions')
  async getDivisions(req: Request, res: Response): Promise<void> {
    try {
      const divisions = await this.locationService.getDivisions();

      res.json({
        success: true,
        data: divisions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('/districts/:divisionId')
  async getDistrictsByDivision(req: Request, res: Response): Promise<void> {
    try {
      const { divisionId } = req.params;
      const districts = await this.locationService.getDistrictsByDivision(Number(divisionId));

      res.json({
        success: true,
        data: districts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('/thanas/:districtId')
  async getThanasByDistrict(req: Request, res: Response): Promise<void> {
    try {
      const { districtId } = req.params;
      const thanas = await this.locationService.getThanasByDistrict(Number(districtId));

      res.json({
        success: true,
        data: thanas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('/areas/:thanaId')
  async getAreasByThana(req: Request, res: Response): Promise<void> {
    try {
      const { thanaId } = req.params;
      const areas = await this.locationService.getAreasByThana(Number(thanaId));

      res.json({
        success: true,
        data: areas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('/:id')
  async getLocationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const location = await this.locationService.getLocationById(Number(id));

      if (!location) {
        res.status(404).json({
          success: false,
          message: 'Location not found',
        });
        return;
      }

      res.json({
        success: true,
        data: location,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Post()
  async createLocation(req: Request, res: Response): Promise<void> {
    try {
      const locationData = req.body;
      const location = await this.locationService.createLocation(locationData);

      res.status(201).json({
        success: true,
        data: location,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Put('/:id')
  async updateLocation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const locationData = req.body;
      const location = await this.locationService.updateLocation(Number(id), locationData);

      if (!location) {
        res.status(404).json({
          success: false,
          message: 'Location not found',
        });
        return;
      }

      res.json({
        success: true,
        data: location,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Delete('/:id')
  async deleteLocation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const location = await this.locationService.deleteLocation(Number(id));

      if (!location) {
        res.status(404).json({
          success: false,
          message: 'Location not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Location deleted successfully',
        data: location,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('/search')
  async searchLocations(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
        return;
      }

      const locations = await this.locationService.searchLocations(q);

      res.json({
        success: true,
        data: locations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }

  @Get('/children/:parentId')
  async getChildLocations(req: Request, res: Response): Promise<void> {
    try {
      const { parentId } = req.params;
      const locations = await this.locationService.getChildLocations(Number(parentId));

      res.json({
        success: true,
        data: locations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }
}
