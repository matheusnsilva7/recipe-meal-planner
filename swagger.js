const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Task Api",
    description: "Task Api",
  },
  host: "localhost:3000",
  schemes: ["https", "http"],
};
const outputFile = "./swagger.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
