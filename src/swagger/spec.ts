// Swagger/OpenAPI 3.0 Specification for Service Management API

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Service Management API',
    version: '1.0.0',
    description: 'RESTful API for user authentication and service management',
    contact: {
      name: 'Support',
      email: 'support@example.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Bearer token for authentication'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email', maxLength: 255 },
          name: { type: 'string', maxLength: 255 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
          email: { type: 'string', format: 'email', description: 'User email address' },
          password: {
            type: 'string',
            minLength: 6,
            maxLength: 36,
            description: 'Password (6-36 chars, alphanumeric only)'
          },
          name: { type: 'string', maxLength: 255, description: 'User full name' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', description: 'User email address' },
          password: { type: 'string', description: 'User password' }
        }
      },
      AppointmentService: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', maxLength: 255 },
          description: { type: 'string' },
          price: { type: 'integer' },
          showTime: { type: 'integer' },
          order: { type: 'integer', default: 0 },
          isPublic: { type: 'boolean', default: true },
          isRemove: { type: 'boolean', default: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      }
    }
  },
  paths: {
    '/auth/register': {
      post: {
        summary: 'Create user account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
              examples: {
                success: {
                  value: {
                    email: 'user@example.com',
                    password: 'SecurePass123',
                    name: 'John Doe'
                  }
                },
                invalidPassword: {
                  value: {
                    email: 'user@example.com',
                    password: 'short',
                    name: 'John Doe'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/User' }
                  }
                },
                example: {
                  data: {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    email: 'user@example.com',
                    name: 'John Doe'
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error or email already taken',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                examples: {
                  emailTaken: {
                    value: {
                      error: {
                        code: 'EMAIL_TAKEN',
                        message: 'Email already in use'
                      }
                    }
                  },
                  invalidPassword: {
                    value: {
                      error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Password 只支援大小寫英文與數字混合，不能有特殊符號'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Login and get JWT token',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
              example: {
                email: 'user@example.com',
                password: 'SecurePass123'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        token: { type: 'string' }
                      }
                    }
                  }
                },
                example: {
                  data: {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                  }
                }
              }
            }
          },
          '400': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: {
                  error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid credentials'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/services': {
      get: {
        summary: 'List appointment services (supports query filters)',
        description: 'Retrieve services with optional filtering. When no query parameters are provided, all services are returned (including soft-deleted ones). Use isRemove parameter to filter by deletion status. Soft-deleted services have isRemove: true but remain in the database for audit purposes.',
        tags: ['Services'],
        parameters: [
          {
            name: 'isPublic',
            in: 'query',
            required: false,
            schema: { type: 'boolean' },
            description: 'Filter by public visibility (true: public only, false: private only)'
          },
          {
            name: 'isRemove',
            in: 'query',
            required: false,
            schema: { type: 'boolean' },
            description: 'Filter by removal status (true: soft-deleted only, false: active only, omit: all statuses)'
          },
          {
            name: 'shopId',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Filter by shopId'
          },
          {
            name: 'id',
            in: 'query',
            required: false,
            schema: { type: 'string', format: 'uuid' },
            description: 'Filter by specific service id'
          }
        ],
        responses: {
          '200': {
            description: 'List of appointment services. No query parameters returns all records. Use ?isRemove=true to retrieve soft-deleted services, ?isRemove=false to get active services.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/AppointmentService' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create appointment service',
        tags: ['Services'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'price'],
                properties: {
                  name: { type: 'string', maxLength: 255 },
                  description: { type: 'string' },
                  price: { type: 'integer' },
                  showTime: { type: 'integer' },
                  isPublic: { type: 'boolean', default: true }
                }
              },
              example: {
                name: 'Hair Cut',
                description: 'Professional hair cutting service',
                price: 5000,
                showTime: 60,
                isPublic: true
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Service created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/AppointmentService' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Missing or invalid JWT token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/services/{id}': {
      get: {
        summary: 'Get appointment service details',
        tags: ['Services'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          '200': {
            description: 'Service details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/AppointmentService' }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update appointment service',
        tags: ['Services'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', maxLength: 255 },
                  description: { type: 'string' },
                  price: { type: 'integer' },
                  showTime: { type: 'integer' },
                  isPublic: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Service updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/AppointmentService' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Missing or invalid JWT token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Delete appointment service (soft delete - sets isRemove: true)',
        description: 'Performs a soft delete on a service. The record remains in the database with isRemove set to true and can be retrieved using ?isRemove=true query parameter.',
        tags: ['Services'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'The ID of the service to delete'
          }
        ],
        responses: {
          '200': {
            description: 'Service soft deleted successfully (isRemove set to true). The record remains in the database for audit purposes.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' }
                      }
                    }
                  }
                },
                example: {
                  data: {
                    id: '550e8400-2222-2222-2222-000000000002'
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Missing or invalid JWT token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    }
  }
};

export default swaggerSpec;
