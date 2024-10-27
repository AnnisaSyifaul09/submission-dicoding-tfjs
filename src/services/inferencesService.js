const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims(0)
      .toFloat();

    const prediction = model.predict(tensor);

    // Mengasumsikan model memberikan output tunggal untuk probabilitas "Cancer"
    const cancerProbability = prediction.dataSync()[0]; // Ambil nilai probabilitas untuk Cancer
    const nonCancerProbability = 1 - cancerProbability; // Hitung probabilitas untuk Non-cancer

    const classes = ["Cancer", "Non-cancer"];

    // Tentukan kelas berdasarkan probabilitas
    let label;
    if (cancerProbability >= 0.5) {
      label = classes[0]; // Cancer
    } else {
      label = classes[1]; // Non-cancer
    }

    console.log(label);

    let suggestion;
    if (label === "Cancer") {
      suggestion = "Segera periksa ke dokter!";
    } else if (label === "Non-cancer") {
      suggestion = "Penyakit kanker tidak terdeteksi.";
    }

    return { label, suggestion };
  } catch (error) {
    throw new InputError(
      `Terjadi kesalahan saat memproses gambar: ${error.message}`
    );
  }
}

module.exports = predictClassification;
