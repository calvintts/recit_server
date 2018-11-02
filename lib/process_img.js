const vision = require('@google-cloud/vision');
const fileName = "../img/test2.jpeg"
// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
// const fileName = 'Local image file, e.g. /path/to/image.png';

// Performs text detection on the local file
client
  .textDetection(fileName)
  .then(results => {
    const detections = results[0].textAnnotations;
    console.log('Text:');
    detections.forEach(text => console.log(text));
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
