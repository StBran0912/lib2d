import * as lb2d from './lib2d.js';
import * as phys from './lib2d-phys.js';

// Öffentliche Variablen definieren

let /**@type {phys.Shape[]}*/ el;
let /**@type {function}*/ checkKicking;
let lifespan = 0; 

// Initialisierung 
function start() {    
    el = [];
    checkKicking = phys.createKicking();
    el.push(new phys.Box(200, 100, 110, 70));
    el.push(new phys.Box(400, 100, 70, 30));
    el.push(new phys.Box(600, 100, 60, 40));
    el.push(new phys.Ball(300, 250, 60));
    el.push(new phys.Ball(600, 250, 20));
    el[0].rotate(0.4);
 
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
    checkKicking(el);
    phys.checkCollision(el);
    for (let i = 0; i < el.length; i++) {
        el[i].applyFriction()
        el[i].update();
        el[i].display();  
    }
    
}

// Programmstart
start();
