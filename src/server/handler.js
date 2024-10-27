const predictClassification = require("../services/inferencesService");
const crypto = require("crypto");
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const imageSize = Buffer.byteLength(image, "base64") / 1e6;

  if (imageSize > 1) {
    const response = h.response({
      status: "fail",
      message: "Payload content length greater than maximum allowed: 1000000",
    });
    response.code(413);
    return response;
  }

  const { label, suggestion } = await predictClassification(model, image);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result: label,
    suggestion: suggestion,
    createdAt,
  };

  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    data,
  });
  response.code(201);
  await storeData(id, data);
  return response;
}

module.exports = postPredictHandler;
