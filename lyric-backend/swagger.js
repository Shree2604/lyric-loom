const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LyricLoom API',
      version: '1.0.0',
      description: 'API documentation for Lyric project (B2B & B2C, REST, ready for Swagger UI)'
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local server' }
    ],
    components: {}, // Explicitly remove securitySchemes
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
