const functions = require('firebase-functions');
const admin = require('firebase-admin');
const vision = require('@google-cloud/vision');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
app.use(cors());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

admin.initializeApp();
let bucket = admin.storage().bucket();
const client = new vision.ImageAnnotatorClient();

app.get('/', function(req, res) {
  console.log('handling /');
  console.log(req.query);
  const fullPath = req.query.fullPath;
	const img = bucket.file(fullPath);
  return img.download().then(function(data) {
    const file = data[0];
    return client
      .faceDetection(file)
      .then(response => {
        const [result] = response;
        const faces = result.faceAnnotations;
        console.log(faces);
        let emotions = [];
        faces.forEach((face, i) => {
          emotions.push({
            'index': i,
            'joy': face.joyLikelihood,
            'anger': face.angerLikelihood,
            'sorrow': face.sorrowLikelihood,
            'surprise': face.surpriseLikelihood,
          });
        });
        return res.json({'emotions': emotions});
      })
      .catch(err => {
        console.error(err);
      });
  });
});

exports.face = functions.https.onRequest(app);
