function setup() {
  createCanvas(1000, 1000);
  stroke(0);
}

let time = 0;
const timeStep = 0.01;
let waveHeightValues = [];

var slider = document.getElementById("n");
let numIterations = slider.value;

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  numIterations = this.value;
}

function drawArrow(x1, y1, x2, y2) {
  // Calculate the angle of the line
  let angle = atan2(y2 - y1, x2 - x1);

  // Length of the arrowhead
  let arrowSize = 10;

  // Arrowhead points
  let arrowX1 = x2 - arrowSize * cos(angle - PI / 6);
  let arrowY1 = y2 - arrowSize * sin(angle - PI / 6);
  let arrowX2 = x2 - arrowSize * cos(angle + PI / 6);
  let arrowY2 = y2 - arrowSize * sin(angle + PI / 6);

  // Draw the two lines of the arrowhead
  line(x2, y2, arrowX1, arrowY1);
  line(x2, y2, arrowX2, arrowY2);
}


function draw() {
  background(255);
  translate(200,200);
  
  let current_x = 0;
  let current_y = 0;
  
  let circles = [];
  
  for(let index = 0; index < numIterations; index++) {
    let n = index * 2 + 1;
    // Circle takes in the diameter instead of radius, if we need the radius later we        can divide by 2 
    let radius = 100 * (4 / (n * PI));
    let circleObj = {
      x: current_x,
      y: current_y,
      diameter: radius * 2,
    };
    
    // Convert Polar Coords To Cartisian
    current_x += radius * cos(n * time);
    current_y += radius * sin(n * time);
    
    circles.push(circleObj);
  }
  
  waveHeightValues.unshift(current_y);
  
  noFill()
  let prevX = 0;
  let prevY = 0;
  for(let index = 0; index < circles.length; index++) {
    strokeWeight(2);
    // Generate color based on x,y, and radius
    stroke(color(round(circles[index].x), round(circles[index].y), round(circles[index].diameter/2)));
    circle(circles[index].x, circles[index].y, circles[index].diameter);
    stroke(0);
    strokeWeight(5);
    point(circles[index].x,circles[index].y);
    
    strokeWeight(2);
    line(prevX,prevY,circles[index].x,circles[index].y);
    if(index !== 0) {
      drawArrow(prevX,prevY,circles[index].x,circles[index].y);
    }
    
    prevX = circles[index].x;
    prevY = circles[index].y;
  }
  
  // Draw the corresponding waves
  beginShape();
  noFill();
  translate(200,0);
  line(current_x-200,current_y,0,waveHeightValues[0]);
  drawArrow(current_x-200,current_y,0,waveHeightValues[0])
  for(let index = 0; index <= waveHeightValues.length; index++) {
    vertex(index, waveHeightValues[index]);
  }
  endShape();
  
  if(waveHeightValues.length > 500) {
    waveHeightValues.pop();
  }
  
  time += timeStep;
}