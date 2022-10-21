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

// Initialisierung 
function start() {    
    shapes = [];
    checkKicking = phys.createKicking();
    shapes.push(new phys.Box(20, 400, 750, 30));
    shapes.push(new phys.Box(150, 100, 70, 30));
    shapes.push(new phys.Box(600, 100, 60, 40));
    shapes.push(new phys.Ball(300, 70, 50));
    shapes.push(new phys.Ball(600, 20, 20));
    shapes.push(new Particle(60, 20, 45, 30));
    shapes[0].rotate(0.2);
    shapes[5].rotate(-0.2);
    shapes[0].mass = Infinity;
    shapes[0].inertia = 100000000;
 
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
    checkKicking(shapes);
    phys.checkCollision(shapes);
    //phys.applyGravity(shapes);
    phys.applyFriction(shapes);
    phys.update(shapes);
}

// Programmstart
start();
