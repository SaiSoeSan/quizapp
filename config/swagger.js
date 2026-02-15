const swaggerConfig = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quiz App API",
      version: "1.0.0",
      description: "API documentation for the Quiz Application",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
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
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

module.exports = swaggerConfig;
