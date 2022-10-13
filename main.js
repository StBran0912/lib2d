// @ts-check
import * as lb2d from './lib2d.js';
import * as phys from './physics.js';

/** Interface Kicking
 * @typedef {Object} Kicking
 * @property {{index: number|null, base: lb2d.Vector}} kick
 * @property {() => void} check
 */

/** @type {(el: (phys.Box|phys.Ball)[] ) => Kicking} */
function createKicking(el) {
    
    /** @type {{index: number|null, base: lb2d.Vector}} */
    let kick = {
        index: null,
        base: new lb2d.Vector(0, 0)
    }
    
    function check() {
        if (lb2d.isMouseDown() && kick.index == null) {
            el.forEach((element, index) => {
                if (element.location.dist(new lb2d.Vector(lb2d.mouseX, lb2d.mouseY)) < element.mass) {
                  kick.base.set(element.location.x, element.location.y);
                  kick.index = index;
                }
            })    
        }
    
        if (lb2d.isMouseDown() && kick.index != null) {
            lb2d.drawArrow(kick.base, new lb2d.Vector(lb2d.mouseX, lb2d.mouseY), 100);
        }  
    
        if (lb2d.isMouseUp() && kick.index != null) {
            let mouse = new lb2d.Vector(lb2d.mouseX, lb2d.mouseY);
            let force = lb2d.subVector(mouse, el[kick.index].location);
            el[kick.index].applyForce(force, 0);
            kick.index = null;
        }      
    }

    return {
        kick,
        check
    }
}

/** @type {(phys.Box|phys.Ball)[]} */
let el = [];
let kicking = createKicking(el);

function start() {    
    el.push(new phys.Box(200, 100, 110, 70));
    el.push(new phys.Box(400, 100, 70, 30));
    el.push(new phys.Box(600, 100, 60, 40));
    el.push(new phys.Ball(300, 250, 60));
    el.push(new phys.Ball(600, 250, 20));
    
    lb2d.init(800, 500);
    lb2d.startAnimation(draw);    
}

function draw() {
    lb2d.background(50, 50, 50);
    kicking.check();
    for (let i = 0; i < el.length; i++) {
        for (let j = i+1; j < el.length; j++ ) {
            phys.checkCollision(el[i], el[j]);
        }
        
        el[i].applyFriction()
        el[i].update();
        el[i].display();  
    }
}

start();
