const { Firestore } = require('@google-cloud/firestore');
 
async function storeData(id, data) {
  try {
    const db = new Firestore({
      projectId: 'submissionmlgc-annisasyifaul',
    });
    
    const predictCollection = db.collection('predictions');
    await predictCollection.doc(id).set(data);
    console.log("Data successfully stored in Firestore");
  } catch (error) {
    console.error("Error storing data to Firestore:", error);
  }
}
 
module.exports = storeData;
