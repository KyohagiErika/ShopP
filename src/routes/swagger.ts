import { NextFunction, Request, Response, Router } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const routes = Router();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopP Web Application API',
      version: '1.0.0',
      description:
        'Web Application API Documentation for ShopP E-Commerce Platform built with NodeJS, ExpressJS, TypeScript, TypeORM, and MySQL',
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

routes.use(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
  },
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs)
);

export default routes;
