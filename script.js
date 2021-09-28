console.log('hi');
console.log(tf.getBackend());
tf.setBackend('webgl');
console.log(tf.getBackend());

let video = document.getElementById("video");
let model;
// declare a canvas variable and get its context
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let canvasImg = document.getElementById("canvasImg");
let ctxImg = canvasImg.getContext("2d");

const setupCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: 600, height: 400 },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    });
};

const detectFaces = async () => {
  const prediction = await model.estimateFaces(video, false);
  // console.log(prediction);

  // draw the video first
  ctx.drawImage(video, 0, 0, 600, 400);

  prediction.forEach((pred) => {

    // draw the rectangle enclosing the face
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "blue";
    // the last two arguments are width and height
    // since blazeface returned only the coordinates, 
    // we can find the width and height by subtracting them.
    // ---
    const topLeft = pred.topLeft
    const bottomRight = pred.bottomRight
    // const topLeft = [571.3124279674921, 53.9220026493299]
    // const bottomRight = [862.5597633099255, 245.88001749008725]
    const width = bottomRight[0] - topLeft[0]
    const heigth = bottomRight[1] - topLeft[1]
    const area = width * heigth
    console.log(width, heigth);
    console.log(area);
    console.log('-----');

    ctx.rect(
      topLeft[0],
      topLeft[1],
      width,
      heigth
    );
    ctx.stroke();

    // drawing small rectangles for the face landmarks
    // ctx.fillStyle = "red";
    // pred.landmarks.forEach((landmark) => {
    //   ctx.fillRect(landmark[0], landmark[1], 5, 5);
    // });

  });
};

let notFound = true
const detectObject = async () => {
  // console.log('-- detectObject');
  // console.log(video);
  
  drawCanvas()

  const predictions = await model.detect(canvasImg)
  console.log(predictions);

  // draw the video first
  // ctx.drawImage(video, 0, 0, 600, 400);

  // for (var i = 0; i < predictions.length; i++) {
  //   bbox = predictions[i].bbox;

  //   ctx.beginPath();
  //   ctx.rect(bbox[0], bbox[1], bbox[2], bbox[3]);
  //   ctx.lineWidth = 3;
  //   ctx.strokeStyle = "green";
  //   ctx.stroke();
  //   ctx.fillStyle = "green";
  //   ctx.fillText(predictions[i].class, bbox[0] + 4, bbox[1] + 12);

  //   const strengDetect = 20
  //   const xStartCurrent = bbox[0]
  //   const yStartCurrent = bbox[1]
  //   const xStartOut = 80
  //   const yStartOut = 80
  //   const xEndOut = xStartOut + 204
  //   const yEndOut = yStartOut + 326
  //   const xStartIn = xStartOut + strengDetect
  //   const yStartIn = yStartOut + strengDetect
  //   const xEndIn = xStartIn + (204 - strengDetect * 2)
  //   const yEndIn = yStartIn + (326 - strengDetect * 2)
  //   const xCurrentEnd = xStartCurrent + bbox[2]
  //   const yCurrentEnd = yStartCurrent + bbox[3]

  //   console.log('Current', xStartCurrent, yStartCurrent);
  //   console.log('Out', xStartOut, yStartOut);
  //   console.log('Int', xStartIn, yStartIn);

  //   if (((xStartOut < xStartCurrent) && (xStartCurrent < xStartIn))
  //     && ((yStartOut < yStartCurrent) && (yStartCurrent < yStartIn))) {
  //     if (((xEndOut > xCurrentEnd) && (xCurrentEnd > xEndIn))
  //       && ((yEndOut > yCurrentEnd) && (yCurrentEnd > yEndIn))) {
  //       console.log('capping');
  //       return null
  //     }
  //   }
  // }

  setTimeout(async () => {
    await detectObject();
  }, 40);
};

function drawCanvas() {
  ctxImg.canvas.height = video.videoHeight;
  ctxImg.canvas.width = video.videoWidth;

  ctxImg.drawImage(video, 0, 0, canvasImg.width, canvasImg.height);
}

setupCamera();
video.addEventListener("loadeddata", async () => {
  // model = await blazeface.load();
  console.log('cocoSsd.load...');
  model = await cocoSsd.load();
  console.log(model);

  // call detect faces every 100 milliseconds or 10 times every second
  // setInterval(detectObject, 100);
  detectObject()
});