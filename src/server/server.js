"use strict";
require("dotenv").config();

const Hapi = require("@hapi/hapi");
const loadModel = require("../services/loadModel");
const routes = require("./routes");
const InputError = require("../exceptions/InputError");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  const model = await loadModel();
  server.app.model = model;

  server.ext("onPreResponse", function (request, h) {
    const response = request.response;

    // Handle InputError
    if (response instanceof InputError) {
      const newResponse = h.response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      });

      // Make sure statusCode is an integer, default to 400 if undefined
      newResponse.code(response.statusCode || 400);
      return newResponse;
    }

    // Handle Boom errors (e.g. 404, 500, etc.)
    if (response.isBoom) {
      const newResponse = h.response({
        status: "fail",
        message:
          response.output.payload.message ||
          "Terjadi kesalahan dalam melakukan prediksi",
      });

      // Ensure statusCode is always an integer, default to 500 if undefined
      newResponse.code(response.output.statusCode || 500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
