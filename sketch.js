let faceapi;
let video;
let detections;

//get nose position from ML
let noseX;
let noseY;
let noseWidth;

//get nose position to 3d
let noseX3d;
let noseY3d;

//depth 
let eyeZ;
let planeDepth = 1600;
let spehereDis;

//texture

let bg;

//machine learning Face API
// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

function modelReady() {
    console.log('ready!')
    console.log(faceapi)
    faceapi.detect(gotResults)
}

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
   
    detections = result;

    if (detections) {
        if (detections.length > 0) {
          //console.log(detections)
          for(let i = 0; i < detections.length; i++){
            const nose = detections[i].parts.nose;
            const boxWidth = detections[i].alignedRect._box._width
            noseX = nose[i]._x;
            noseY = nose[i]._y;
            noseWidth = boxWidth;
          }
        }

    }
      
    faceapi.detect(gotResults);
      
    background(0);
    frameRate(30);
  eyeZ = height / 2 / tan(30); // The default distance the camera is away from the origin.
  
  defineCenter();
  
  // Lights

  ambientLight(18);
  directionalLight(255, 0, 0, 0.25, 0.25, 0);
  pointLight(0, 0, 255, mouseX, mouseY, 250);


  ambientLight(10);
  // directionalLight(255, 0, 0, 0.25, 0.25, 0);

  pointLight(100, 40, 4, mouseX, mouseY, 100);


  // pointLight(10, 10, 50, mouseX, mouseY, 100);
  // ambientLight(10, 0, -40);
  
  //set walls
  setWalls();
  
  // ML position debugger ellipse
  // push();
  // fill(255);
  // ellipse(noseX3d, noseY3d, 100, 100);
  // console.log(noseX);
  // pop();
  
  push();
  translate(centerPointX, centerPointY, sphereDis);
  // specularMaterial(2);
  ambientMaterial(20);
  sphere(64, 64);
  pop();
}
  
function preload() {
  wall = loadImage("moss-15.JPG");
  bg = loadImage("moss-2.JPG");

}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  video = createCapture(VIDEO);
  video.size(width, height);
  //video.hide();
  faceapi = ml5.faceApi(video, detection_options, modelReady);
  
  angleMode(DEGREES);
  colorMode(HSB, 200, 100, 100);
  noStroke();
   
}


function defineCenter() {
  //mirror noseX position;
  noseX3d = (width - noseX) - width/2;
  noseY3d = noseY - height/2;
  
  //translate nose pos into the center of the tunnel
  centerPointX = noseX3d;
  centerPointY = noseY3d;
  
  //translate face width to the depth of the tunnel
  let tunnelFarPoint = 1600;
  let tunnelClosePoint = 600;
  planeDepth = tunnelFarPoint - map(noseWidth, 0, width, tunnelClosePoint, tunnelFarPoint);
  sphereDis = -map(planeDepth, tunnelClosePoint, tunnelFarPoint, -100, 200);

}
  
function setWalls() {
  let angleVertical = atan2(eyeZ, centerPointX);
  let angleHorizon = atan2(eyeZ, centerPointY);
  
  //Left Wall
  createPlane(-100, 0, 400, -angleHorizon + 90, angleVertical, 0, planeDepth, 200, wall);

  // Right wall
  createPlane(100, 0, 400, -angleHorizon + 90, angleVertical, 0, planeDepth, 200, wall);

  // Bottom wall
  createPlane(0, 100, 400, -angleHorizon, 0, angleVertical + 90, 200, planeDepth, wall);


  // Top wall
  createPlane(0, -80, 400, -angleHorizon, 0, angleVertical + 90, 200, planeDepth, wall);
}

function createPlane(xPos, yPos, zPos, xAngle, yAngle, zAngle, thisHeight, thisLength, texturePic) {
  push();
  translate(xPos, yPos, zPos);
  rotateX(xAngle);
  rotateY(yAngle);
  rotateZ(zAngle);
  texture(texturePic);
  plane(thisHeight, thisLength);
  pop();
}
