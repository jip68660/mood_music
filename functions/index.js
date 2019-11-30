var express = require('express');
var app = express();
var cors = require('cors');

app.use(cors());

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// exports.face = functions.https.onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   const snapshot = await admin.database().ref('/messages').push({original: original});
//   // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//   res.redirect(303, snapshot.ref.toString());
// });

app.post('/', function(req, res) {
  console.log('handling /');

  const vision = require('@google-cloud/vision');
  // Creates a client
  const client = new vision.ImageAnnotatorClient(
    { crendentials: 
      { client_email: "jip68660@gmail.com", 
      private_key: "AIzaSyCEAGjyg3XHDmaVnCE22t1cFtRkpsydfus"}
    }
  );

  const [result] = client.faceDetection(req.file)
  .then(response => response.json());

  const faces = result.faceAnnotations;
  console.log('Faces:');
  faces.forEach((face, i) => {
    console.log(`  Face #${i + 1}:`);
    console.log(`    Joy: ${face.joyLikelihood}`);
    console.log(`    Anger: ${face.angerLikelihood}`);
    console.log(`    Sorrow: ${face.sorrowLikelihood}`);
    console.log(`    Surprise: ${face.surpriseLikelihood}`);
  });
});

exports.face = functions.https.onRequest(app);