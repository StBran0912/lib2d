// @ts-check
import * as lb2d from './lib2d.js';
import * as phys from './lib2d-phys.js';

// Öffentliche Variablen definieren
/** @type {(phys.Box|phys.Ball)[]} */
let el = [];
/* @type {function} */
let checkKick = phys.createKicking(el);

// Initialisierung definieren
function start() {    
    el.push(new phys.Box(200, 100, 110, 70));
    el.push(new phys.Box(400, 100, 70, 30));
    el.push(new phys.Box(600, 100, 60, 40));
    el.push(new phys.Ball(300, 250, 60));
    el.push(new phys.Ball(600, 250, 20));
    lb2d.init(800, 500);
    lb2d.startAnimation(draw);    
}

// wird von der funktion start() gestartet.Läuft in Endlos-Schleife 
function draw() {
    lb2d.background(50, 50, 50);
    checkKick();
    for (let i = 0; i < el.length; i++) {
        for (let j = i+1; j < el.length; j++ ) {
            phys.checkCollision(el[i], el[j]);
        }
        el[i].applyFriction()
        el[i].update();
        el[i].display();  
    }
}

// Programmstart
start();
