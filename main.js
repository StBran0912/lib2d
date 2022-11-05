import * as lb2d from './lib2d.js';
import * as phys from './lib2d-phys.js';

class Particle extends phys.Box{
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    constructor(x,y,w,h) {
      super (x,y,w,h)
      this.lifespan = 0;
    }
  
    display() {
        lb2d.push();
        lb2d.strokeColor(255);
        super.display();
        lb2d.pop();
    }
  }
  


// Öffentliche Variablen definieren

let /**@type {phys.Shape[]}*/ shapes;
let /**@type {function}*/ checkKicking;
let lifespan = 0; 


// Funtionen innerhalb main.js
function createShapes() {
  if (lb2d.isMouseUp()) {
    shapes.push(new phys.Box(lb2d.mouseX+30, lb2d.mouseY, 20, 20));
    shapes.push(new phys.Ball(lb2d.mouseX, lb2d.mouseY, 10));
  }
}


// Initialisierung 
function start() {    
    shapes = [];
    checkKicking = phys.createKicking();
    
    shapes.push(new phys.Box(20, 450, 700, 40));
    shapes[0].mass = Infinity; shapes[0].inertia = Infinity;
    shapes[0].rotate(0.2);
    shapes.push(new phys.Box(150, 30, 80, 80));
    shapes.push(new phys.Box(300, 30, 100, 80));
    shapes.push(new phys.Ball(lb2d.random(10, 700),lb2d.random(10, 400),lb2d.random(10, 80)));
    shapes.push(new phys.Ball(lb2d.random(10, 700),lb2d.random(10, 400),lb2d.random(10, 30)));

    //shapes.push(new phys.Ball(500, 30, 25));
    //shapes[2].angAccel = 0.02;
    //shapes[3].accel = new lb2d.Vector(-1.5, 0);
    //shapes[1].velocity = new lb2d.Vector(0, 6);
    /*
    //shapes.push(new phys.Box(0, 40, 40, 450));
    //shapes[1].mass = Infinity; shapes[1].inertia = Infinity;
    //shapes.push(new phys.Box(0, 450, 700, 20));
    //shapes[2].mass = Infinity; shapes[2].inertia = Infinity;
    //shapes.push(new phys.Box(750, 0, 40, 450));
    //shapes[3].mass = Infinity; shapes[3].inertia = Infinity;
    shapes.push(new phys.Ball(lb2d.random(10, 700),lb2d.random(10, 400),lb2d.random(10, 80)));
    shapes.push(new phys.Ball(lb2d.random(10, 700),lb2d.random(10, 400),lb2d.random(10, 30)));
    shapes.push(new phys.Ball(lb2d.random(10, 700),lb2d.random(10, 400),lb2d.random(20, 70)));
    shapes.push(new phys.Box(lb2d.random(10, 700),lb2d.random(10, 400),lb2d.random(40, 100), lb2d.random(40, 100)));
    shapes.push(new phys.Box(lb2d.random(10, 700),lb2d.random(10, 400),lb2d.random(50, 80), lb2d.random(50, 80)));
    shapes.push(new phys.Box(lb2d.random(10, 700),lb2d.random(10, 400),lb2d.random(10, 90), lb2d.random(10, 70)));
    shapes.push(new phys.Box(lb2d.random(10, 700),lb2d.random(10, 400),lb2d.random(10, 80), lb2d.random(10, 80)));
    */
    lb2d.init(800, 500);
    lb2d.strokeWidth(1.5);
    lb2d.startAnimation(draw);

}

// draw() wird von der funktion start() aufgerufen als Endlos-Schleife.
// Hier wird die Animation berechnet und gezeichnet 
function draw() {
    lb2d.background();
    /*
    let g = lb2d.color_g + lifespan < lb2d.color_r ? lb2d.color_r : lb2d.color_g + lifespan
    let b = lb2d.color_b + lifespan < lb2d.color_r ? lb2d.color_r : lb2d.color_b + lifespan
    lb2d.strokeColor(lb2d.color_r, g, b);
    lifespan -= 0.5;
    */  
    //createShapes();
    checkKicking(shapes);
    phys.checkCollision(shapes);
    //phys.applyGravity(shapes);
    //phys.applyFriction(shapes);
    //phys.applyDragforce(shapes);
    phys.update(shapes);
}

// Programmstart
start();