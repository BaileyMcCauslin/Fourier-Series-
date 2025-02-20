// The cumalative amount of time that has gone by after every frame.
// We will use this as an angle of rotation.
let time = 0;

// How much time will go by per frame.
const timeStep = 0.01;

// Array of wave y values that will display the height of the wave per step.
let waveHeightValues = [];

// A slide for the number of iterations
var slider = document.getElementById("n");
let numIterations = slider.value;

// How big me want to scale our radius.
const radiusScale = 100;

// How many wave verices can be drawn at once
const MAX_VERTICES = 500;

// Update the current slider value
slider.oninput = function() {
  numIterations = this.value;
}

// Make an arrow at the end of a given line
function drawArrow(x1, y1, x2, y2) {
  // Calculate the angle of the line
  const angle = atan2(y2 - y1, x2 - x1);

  // Length of the arrowhead
  const arrowSize = 10;

  // Arrowhead points
  let arrowX1 = x2 - arrowSize * cos(angle - PI / 6);
  let arrowY1 = y2 - arrowSize * sin(angle - PI / 6);
  let arrowX2 = x2 - arrowSize * cos(angle + PI / 6);
  let arrowY2 = y2 - arrowSize * sin(angle + PI / 6);

  // Draw the two lines of the arrowhead
  line(x2, y2, arrowX1, arrowY1);
  line(x2, y2, arrowX2, arrowY2);
}

// Calculate the radius of the nth iteration
const calculateRadius = (n) => {
  // Scale the radius for visabilty
  /*
   As n increases, the radius decreases because n * PI gets larger.
   As you go to the next iteration, the radius gets smaller.
  */
  return radiusScale * (4 / (n * PI));
};


// r * cos(theta) or r * sin(theta).
// Theta being the time/degree of rotation per frame.
// We need to add n in to scale the coordinate system for epicycle size
const convertPolarToCartisian = (radius, n, time) => {
  return [radius * cos(n * time), radius * sin(n * time)];
};

// Creates an array of epicycles 
const createEpicycles = (numIterations) => {
  let epicycles = [];
  let currentX  = 0;
  let currentY  = 0;

  for(let index = 0; index < numIterations; index++) {
    // Ensure that n is odd for sine function
    let n = index * 2 + 1;
    let radius = calculateRadius(n);
    let epicycle = {currentX,currentY,radius};
    [newX,newY] = convertPolarToCartisian(radius,n,time);
    currentX += newX;
    currentY += newY;
    epicycles.push(epicycle);
  }
  // Add the height value to the front of wave height array
  waveHeightValues.unshift(currentY);

  return epicycles;
};

// Draw the epicircles based on point positions
const drawEpiCycles = (epicycles) => {
  noFill()
  let prevX = 0;
  let prevY = 0;
  for(let index = 0; index < epicycles.length; index++) {
    strokeWeight(2);

    // Generate color based on x,y, and radius
    stroke(color(round(epicycles[index].currentX),
                 round(epicycles[index].currentY), 
                 round(epicycles[index].radius)));

    // Draw a circle at the given epicycles point. 
    // The point denoting the center of the circle.
    circle(epicycles[index].currentX,
           epicycles[index].currentY, 
           epicycles[index].radius * 2);

    stroke(0);
    strokeWeight(5);

    // Create a point at the center of the given circle
    point(epicycles[index].currentX,epicycles[index].currentY);
    
    strokeWeight(2);

    // Draw a line from the previous circle to the center of the new one
    line(prevX,prevY,epicycles[index].currentX,epicycles[index].currentY);

    // We don't want to draw an arrow for the first circles point.
    if(index !== 0) {
      drawArrow(prevX,prevY,epicycles[index].currentX,
                                                     epicycles[index].currentY);
    }
    
    // Set the previous to the current
    prevX = epicycles[index].currentX;
    prevY = epicycles[index].currentY;
  } 
};


// Draw the waves as vertices 
const drawWaves = (epicycles) => {
  beginShape();
  noFill();
  translate(200,0);

  // We really only care about the last epicycles point at time t.
  let lastX = epicycles[epicycles.length - 1].currentX;
  let lastY = epicycles[epicycles.length - 1].currentY;

  // Draw a pointing line to the corresponding place to draw.
  line(lastX-200,lastY,0,waveHeightValues[0]);
  drawArrow(lastX-200,lastY,0,waveHeightValues[0])

  // Draw vertices for all points at time t.
  for(let index = 0; index <= waveHeightValues.length; index++) {
    vertex(index, waveHeightValues[index]);
  }
  endShape();
  
  // get rid of previous spoints if they exceed x in length.
  if(waveHeightValues.length > MAX_VERTICES) {
    waveHeightValues.pop();
  }
};


function setup() {
  createCanvas(1000, 1000);
  stroke(0);
}

function draw() {
  background(255);
  translate(200,200);
  let epicycles = createEpicycles(numIterations);
  drawEpiCycles(epicycles);
  drawWaves(epicycles);
  
  time += timeStep;
}