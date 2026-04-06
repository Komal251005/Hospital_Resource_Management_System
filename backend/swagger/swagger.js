const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🏥 Hospital Resource Management API',
      version: '1.0.0',
      description:
        'Full-featured REST API for managing hospital resources, emergency cases, and predictive analytics.',
      contact: {
        name: 'Hospital Resource System',
        email: 'admin@hospital.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from /api/auth/login',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Dashboard', description: 'Dashboard summary statistics' },
      { name: 'Resources', description: 'Hospital resource management' },
      { name: 'Emergency', description: 'Emergency case management' },
      { name: 'Analytics', description: 'Predictive analytics and daily data' },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  // Serve Swagger UI
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: `
        .swagger-ui .topbar { background-color: #1a237e; }
        .swagger-ui .topbar-wrapper img { content: url(''); }
        .swagger-ui .info .title { color: #1a237e; }
      `,
      customSiteTitle: 'Hospital Resource API Docs',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    })
  );

  // Serve raw JSON spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;
