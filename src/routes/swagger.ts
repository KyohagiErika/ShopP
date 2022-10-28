import { Router } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const routes = Router();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopP Web Application API',
      version: '1.0.0',
      description: 'Employe Api for employee management',
      servers: ['http://localhost:3001'],
      basePath: '/',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: {
      bearerAuth: [],
    },
  },
  apis: ['**/*.ts'],
};
const options = {
  explorer: true,
  swaggerOptions: {
    authAction: {
      JWT: {
        name: 'JWT',
        schema: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: '',
        },
        value: 'Bearer <JWT>',
      },
    },
  },
  persistAuthorization: true,
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

routes.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

export default routes;
