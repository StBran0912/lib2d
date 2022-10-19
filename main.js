// @ts-check
import * as lb2d from './lib2d.js';
import * as phys from './lib2d-phys.js';

// Öffentliche Variablen definieren

let /**@type {phys.Shape[]}*/ el;
let /**@type {function}*/ checkKicking;

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
    lb2d.startAnimation(draw);    
}

// draw() wird von der funktion start() aufgerufen als Endlos-Schleife.
// Hier wird die Animation berechnet und gezeichnet 
function draw() {
    lb2d.background(50, 50, 50);
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
