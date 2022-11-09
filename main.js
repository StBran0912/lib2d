import * as lb2d from './lib2d.js';
import * as phys from './lib2d-phys.js';

// Öffentliche Variablen definieren

let /**@type {phys.Shape[]}*/ shapes;
let /**@type {phys.Shape[]}*/ walls;
let /**@type {function}*/ checkKicking;


function createShapes() {
  if (lb2d.isMouseUp()) {
    shapes.push(new phys.Box(lb2d.mouseX+30, lb2d.mouseY, 20, 20));
    shapes.push(new phys.Ball(lb2d.mouseX, lb2d.mouseY, 10));
  }
}


// Initialisierung 
function start() {    
    shapes = [];
    walls = [new phys.Wall(10, 480, 700,10)];
    console.log(walls);
    checkKicking = phys.createKicking();
    
    shapes.push(new phys.Box(100, 200, 400, 20));
    shapes[0].mass = Infinity; 
    shapes.push(new phys.Box(150, 30, 80, 80));
    shapes.push(new phys.Box(300, 30, 100, 80));
    shapes.push(new phys.Ball(lb2d.random(10, 700),lb2d.random(10, 400),lb2d.random(10, 80)));
    shapes.push(new phys.Ball(lb2d.random(10, 700),lb2d.random(10, 400),lb2d.random(10, 30)));
    lb2d.init(800, 500);
    lb2d.strokeWidth(1.5);
    lb2d.startAnimation(draw);

}

// draw() wird von der funktion start() aufgerufen als Endlos-Schleife.
// Hier wird die Animation berechnet und gezeichnet 
function draw() {
    lb2d.background();
    //createShapes();
    checkKicking(shapes);
    phys.checkCollision(shapes);
    phys.checkWalls(shapes, walls);
    //phys.applyGravity(shapes);
    //phys.applyFriction(shapes);
    //phys.applyDragforce(shapes);
    phys.update(shapes);
    phys.update(walls);
}

// Programmstart
start();