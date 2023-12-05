import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EDVISTO IntechMom',
      version: '1.0.0',
    },
    servers: [
      {
        url: "http://localhost:3000/"
      }
    ]
  },
  apis: [
    './src/routes/*.js',
  ], 
};

export const openApiSpecification = swaggerJSDoc(swaggerOptions);