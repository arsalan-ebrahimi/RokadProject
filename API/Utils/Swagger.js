import swaggerJSDoc from "swagger-jsdoc";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "API documentation for the Blog application"
    },
    servers: [
      {
        url: "http://localhost:5000",
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./Modules/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
