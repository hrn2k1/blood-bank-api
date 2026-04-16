import swaggerJsdoc from 'swagger-jsdoc';
import Config from './config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blood Bank Management API',
      version: '1.0.0',
      description: 'REST API for managing blood bank operations including donor management, blood inventory, and donations',
      contact: {
        name: 'Blood Bank Team',
      },
    },
    servers: [
      {
        url: Config.API_PREFIX,
        description: 'Current Server',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'name', 'contactNumber', 'email', 'password', 'type', 'divisionId', 'districtId', 'areaId', 'registrationDate'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
              example: '6a61aded-906a-4801-8543-d1d5ca9e0193',
            },
            name: {
              type: 'string',
              description: 'User name',
              example: 'John Doe',
            },
            contactNumber: {
              type: 'string',
              description: 'Contact number',
              example: '+880123456789',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              description: 'User password (hashed in DB)',
            },
            type: {
              type: 'string',
              enum: ['user', 'bank'],
              description: 'User type',
              example: 'user',
            },
            divisionId: {
              type: 'number',
              description: 'Division ID',
            },
            districtId: {
              type: 'number',
              description: 'District ID',
            },
            thanaId: {
              type: 'number',
              description: 'Thana ID',
            },
            areaId: {
              type: 'number',
              description: 'Area ID',
            },
            registrationDate: {
              type: 'string',
              format: 'date-time',
              description: 'Registration date',
            },
            props: {
              type: 'object',
              description: 'Additional properties',
            },
          },
        },
        BloodRequest: {
          type: 'object',
          required: ['id', 'requesterId', 'bankId', 'bloodGroup', 'unitsRequired', 'requestDate', 'address', 'reason', 'urgencyLevel'],
          properties: {
            id: {
              type: 'string',
              description: 'Request ID',
            },
            requesterId: {
              type: 'string',
              description: 'Requester user ID',
            },
            bankId: {
              type: 'string',
              description: 'Blood bank ID',
            },
            bloodGroup: {
              type: 'string',
              enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
              description: 'Required blood group',
            },
            unitsRequired: {
              type: 'number',
              description: 'Units of blood required',
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'completed', 'rejected'],
              description: 'Request status',
            },
            donors: {
              type: 'array',
              description: 'List of donors who contributed',
              items: {
                type: 'object',
                properties: {
                  donorId: { type: 'string' },
                  unitsDonated: { type: 'number' },
                  donationDate: { type: 'string', format: 'date-time' },
                },
              },
            },
            requestDate: {
              type: 'string',
              format: 'date-time',
            },
            address: {
              type: 'string',
              description: 'Delivery address',
            },
            reason: {
              type: 'string',
              description: 'Reason for blood request',
            },
            urgencyLevel: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
            },
            comment: {
              type: 'string',
            },
          },
        },
        Location: {
          type: 'object',
          required: ['id', 'type', 'name'],
          properties: {
            id: {
              type: 'number',
              description: 'Location ID',
            },
            parentId: {
              type: 'number',
              description: 'Parent location ID (for hierarchy)',
            },
            type: {
              type: 'string',
              enum: ['division', 'district', 'thana', 'area'],
              description: 'Location type',
            },
            name: {
              type: 'string',
              description: 'Location name',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
            },
            message: {
              type: 'string',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
