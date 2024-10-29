const postPredictHandler = require('../server/handler');
const { Firestore } = require('@google-cloud/firestore'); // Ensure proper import

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        maxBytes: 1000000,
        allow: 'multipart/form-data',
        multipart: true,
      },
    },
  },
  {
    method: "GET",
    path: "/predict/histories",
    handler: async () => {
      try {
        const db = new Firestore({
          projectId: 'submissionmlgc-annisasyifaul',
        });
        const querySnapshot = await db.collection("predictions").get();
        const data = [];

        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          const formattedData = {
            id: doc.id,
            history: {
              result: docData.result,
              createdAt: docData.createdAt,
              suggestion: docData.suggestion,
            },
          };
          data.push(formattedData);
        });

        return {
          status: "success",
          data: data,
        };
      } catch (error) {
        console.error("Error fetching prediction histories:", error);
        return {
          status: "fail",
          message: "An internal server error occurred",
        };
      }
    },
  },
];

module.exports = routes;
