import * as lb2d from './lib2d.js';

/** Interface Shape
 * @typedef {Object} Shape
 * @property {string} typ
 * @property {lb2d.Vector} location
 * @property {lb2d.Vector[]=} vertices
 * @property {lb2d.Vector} velocity
 * @property {number} angVelocity
 * @property {number=} radius
 * @property {lb2d.Vector} accel
 * @property {number} angAccel
 * @property {number} mass
 * @property {number} inertia
 * @property {lb2d.Vector=} orientation
 * @property {number} coefficient

 * @property {() => void} display
 * @property {(angle: number) => void} rotate
 * @property {(force: lb2d.Vector, angForce: number) => void} applyForce
 * @property {() => void} applyFriction
 * @property {(v: lb2d.Vector) => void} resetPos
 * @property {() => void} update
 */

export class Box {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    constructor (x, y, w, h) {

        this.typ = "Box";
        /** @type {lb2d.Vector[]} */
        this.vertices = new Array(5);
        this.vertices[0] = new lb2d.Vector(x, y);
        this.vertices[1] = new lb2d.Vector(x + w, y);
        this.vertices[2] = new lb2d.Vector(x + w, y + h);
        this.vertices[3] = new lb2d.Vector(x, y + h);
        this.vertices[4] = this.vertices[0];
        this.location = new lb2d.Vector(x + w / 2, y + h / 2);
        this.velocity = new lb2d.Vector(0, 0);
        this.angVelocity = 0;
        this.accel = new lb2d.Vector(0, 0);
        this.angAccel = 0;
        this.mass = (w + h)*2,
        this.inertia = w * h * w,
        this.coefficient = 0.0005
    }

    /** @type {(angle: number) => void} */
    rotate(angle) {
        for (let i = 0; i < 4; i++) {
            this.vertices[i].rotateMatrix(this.location, angle);
        }
    }

    /** @type {() => void} */
    update() {
        this.velocity.add(this.accel);
        this.accel.set(0,0);
        this.angVelocity += this.angAccel;
        this.angAccel = 0;

        this.location.add(this.velocity);
        this.vertices[0].add(this.velocity);
        this.vertices[1].add(this.velocity);
        this.vertices[2].add(this.velocity);
        this.vertices[3].add(this.velocity);
        this.rotate(this.angVelocity);
    }

    /** @type {() => void} */
    display() {
        lb2d.shape(this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y, this.vertices[2].x, this.vertices[2].y, this.vertices[3].x, this.vertices[3].y, 0);
        lb2d.circle(this.location.x, this.location.y, 2, 0);
    }

    /** @type {(force: lb2d.Vector, angForce: number) => void} */
    applyForce(force, angForce) {
        this.accel.add(lb2d.divVector(force, this.mass));
        this.angAccel += angForce / this.mass; 
    }

    /** @type {() => void} */
    applyFriction() {
        let frictVelocity = this.velocity.copy();
        frictVelocity.normalize();
        frictVelocity.mult(this.coefficient * -1); // in Gegenrichtung
        frictVelocity.limit(this.velocity.mag());
        this.accel.add(frictVelocity);

        const frictAngDirection = this.angVelocity < 0 ? 1 : -1; // in Gegenrichtung
        const frictAngVelocity = lb2d.limitNum(this.coefficient * 0.05 * frictAngDirection, Math.abs(this.angVelocity));
        this.angAccel += frictAngVelocity;
    }


    /** @type {(v: lb2d.Vector) => void} */
    resetPos(v) {
        this.location.add(v);
        this.vertices[0].add(v);
        this.vertices[1].add(v);
        this.vertices[2].add(v);
        this.vertices[3].add(v);
    }
}

export class Ball {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} radius 
     */
    constructor(x, y, radius) {
        this.typ = "Ball";
        this.location = new lb2d.Vector(x, y);
        this.velocity = new lb2d.Vector(0, 0);
        this.angVelocity = 0;
        this.radius = radius;
        this.accel = new lb2d.Vector(0, 0);
        this.angAccel = 0;
        this.mass = radius * 2;
        this.inertia = radius * radius * radius/2;
        this.orientation = new lb2d.Vector(radius + x, 0 + y);
        this.coefficient = 0.0015;        
    }
    
    /** @type {() => void} */
    display() {
        lb2d.circle(this.location.x, this.location.y, this.radius, 0);
        lb2d.line(this.location.x, this.location.y, this.orientation.x, this.orientation.y);
    }

    /** @type {(angle: number) => void} */
    rotate(angle) {
        this.orientation.rotateMatrix(this.location, angle);
    }

    /** @type {(force: lb2d.Vector, angForce: number) => void} */
    applyForce(force, angForce) {
        this.accel.add(lb2d.divVector(force, this.mass));
        this.angAccel += angForce / this.mass; 
    }

    /** @type {() => void} */
    applyFriction() {
        let frictVelocity = this.velocity.copy();
        frictVelocity.normalize();
        frictVelocity.mult(this.coefficient * -1); // in Gegenrichtung
        frictVelocity.limit(this.velocity.mag());
        this.accel.add(frictVelocity);

        const frictAngDirection = this.angVelocity < 0 ? 1 : -1; // in Gegenrichtung
        const frictAngVelocity = lb2d.limitNum(this.coefficient * 0.05 * frictAngDirection, Math.abs(this.angVelocity));
        this.angAccel += frictAngVelocity;
    }
    
    /** @type {(v: lb2d.Vector) => void} */
    resetPos(v) {
        this.location.add(v);
        this.orientation.add(v);
    }

    /** @type {() => void} */
    update() {
        this.velocity.add(this.accel);
        this.accel.set(0,0);
        this.angVelocity += this.angAccel;
        this.angAccel = 0;

        this.location.add(this.velocity);
        this.orientation.add(this.velocity);
        this.rotate(this.angVelocity);
    }
}

/** @type {(a: Shape, b: Shape) => void} */
function checkCollisionBoxes(a, b) {
    // Geprüft wird, ob eine Ecke von boxA in die Kante von boxB schneidet
    // Zusätzlich muss die Linie von Mittelpunkt boxA und Mittelpunkt boxB durch Kante von boxB gehen
    // i ist Index von Ecke und j ist Index von Kante
    // d = Diagonale von A.Mittelpunkt zu A.vertices(i)
    // e = Kante von B(j) zu B(j+1)
    // z = Linie von A.Mittelpunkt zu B.Mittelpunkt
    // _perp = Perpendicularvektor
    // scalar_d Faktor von d für den Schnittpunkt d/e
    // scalar_z Faktor von z für den Schnittpunkt z/e
    // mtv = minimal translation vector (überlappender Teil von d zur Kante e)

    let boxA = a;
    let boxB = b;
    for (let n = 0; n < 2; n++) {
        if (n == 1) {
            boxA = b;
            boxB = a;
        }
        for (let i = 0; i < 4; i++) {            
            for (let j = 0; j < 4; j++) {
                // Prüfung auf intersection von Diagonale d zu Kante e
                let [, scalar_d] = lb2d.intersect(boxA.location, boxA.vertices[i], boxB.vertices[j], boxB.vertices[j + 1])
                if (scalar_d) {
                    // Prüfung auf intersection Linie z zu Kante e
                    let [, scalar_z] = lb2d.intersect(boxA.location, boxB.location, boxB.vertices[j], boxB.vertices[j + 1])
                    if (scalar_z) {
                        // Collision findet statt
                        // Objekte zurücksetzen und normal_e berechnen. Kollisionspunkz ist Ecke i von BoxA
                        let e = lb2d.subVector(boxB.vertices[j + 1], boxB.vertices[j]);
                        let e_perp = new lb2d.Vector(-(e.y), e.x);   
                        let d = lb2d.subVector(boxA.vertices[i], boxA.location);
                        d.mult(1 - scalar_d);
                        e_perp.normalize(); 
                        let distance = lb2d.dotProduct(e_perp, d);
                        e_perp.mult(-distance); // mtv 
                        boxA.resetPos(lb2d.multVector(e_perp, 0.5));
                        boxB.resetPos(lb2d.multVector(e_perp, -0.5));
                        e_perp.normalize(); // normal_e
                        // Collision berechnen
                        // rAP = Linie von A.location zu Kollisionspunkt (Ecke i von BoxA)
                        let rAP = lb2d.subVector(boxA.vertices[i], boxA.location);
                        // rBP = Linie von B.location zu Kollisionspunkt (ebenfalls Ecke i von BoxA)
                        let rBP = lb2d.subVector(boxA.vertices[i], boxB.location);
                        let rAP_perp = new lb2d.Vector(-rAP.y, rAP.x);
                        let rBP_perp = new lb2d.Vector(-rBP.y, rBP.x);
                        let VtanA = lb2d.multVector(rAP_perp, boxA.angVelocity);
                        let VtanB = lb2d.multVector(rBP_perp, boxB.angVelocity);
                        let VgesamtA = lb2d.addVector(boxA.velocity, VtanA);
                        let VgesamtB = lb2d.addVector(boxB.velocity, VtanB);
                        const velocity_AB = lb2d.subVector(VgesamtA, VgesamtB);
                        if (lb2d.dotProduct(velocity_AB, e_perp) < 0) { // wenn negativ, dann auf Kollisionskurs
                            let e = 1; //inelastischer Stoß
                            let j_denominator = lb2d.dotProduct(lb2d.multVector(velocity_AB, -(1+e)), e_perp);
                            let j_divLinear = lb2d.dotProduct(e_perp, lb2d.multVector(e_perp, (1/boxA.mass + 1/boxB.mass)));
                            let j_divAngular = Math.pow(lb2d.dotProduct(rAP_perp, e_perp), 2) / boxA.inertia + Math.pow(lb2d.dotProduct(rBP_perp, e_perp), 2) / boxB.inertia;
                            let j = j_denominator / (j_divLinear + j_divAngular);
                            // Grundlage für Friction berechnen (t)
                            let t = new lb2d.Vector(-(e_perp.y), e_perp.x);
                            let t_scalarprodukt = lb2d.dotProduct(velocity_AB, t);
                            t.mult(t_scalarprodukt);
                            t.normalize();
                            
                            //apply Force to acceleration
                            boxA.accel.add(lb2d.addVector(lb2d.multVector(e_perp, (j/boxA.mass)), lb2d.multVector(t, (0.2*-j/boxA.mass))));
                            boxB.accel.add(lb2d.addVector(lb2d.multVector(e_perp, (-j/boxB.mass)), lb2d.multVector(t, (0.2*j/boxB.mass))));
                            boxA.angAccel += lb2d.dotProduct(rAP_perp, lb2d.addVector(lb2d.multVector(e_perp, j/boxA.inertia), lb2d.multVector(t, 0.2*-j/boxA.inertia)));
                            boxB.angAccel += lb2d.dotProduct(rBP_perp, lb2d.addVector(lb2d.multVector(e_perp, -j/boxB.inertia), lb2d.multVector(t, 0.2*j/boxB.inertia)));
                        }
                    
                        return; 
                    }
                }
            }
        }
    }
}
 

/** @type {(a: Shape, b: Shape) => void} */
function checkCollisionBalls(a, b) {
//Distanz ermitteln
    let radiusTotal = a.radius + b.radius;
    let distance = a.location.dist(b.location);

    if (distance < radiusTotal) {
        //Treffer
        let space = (radiusTotal - distance);
        let collisionLine = lb2d.subVector(a.location, b.location);
        collisionLine.setMag(space);
        a.resetPos(lb2d.multVector(collisionLine, 0.5));
        b.resetPos(lb2d.multVector(collisionLine, -0.5));
        collisionLine.normalize();
        // resolveCollisionBalls(a, b, collisionLine);
        const rA = lb2d.multVector(collisionLine, -a.radius);
        const rA_perp = new lb2d.Vector(-rA.y, rA.x);
        const rB = lb2d.multVector(collisionLine, b.radius);
        const rB_perp = new lb2d.Vector(-rB.y, rB.x);
        const VtanA = lb2d.multVector(rA_perp, a.angVelocity);
        const VtanB = lb2d.multVector(rB_perp, b.angVelocity);
        const VgesamtA = lb2d.addVector(a.velocity, VtanA);
        const VgesamtB = lb2d.addVector(b.velocity, VtanB);
        const velocity_AB = lb2d.subVector(VgesamtA, VgesamtB);
    
        if (lb2d.dotProduct(velocity_AB, collisionLine) < 0) { // wenn negativ, dann auf Kollisionskurs
            const e = 1; //inelastischer Stoß
            const j_denominator = lb2d.dotProduct(lb2d.multVector(velocity_AB, -(1+e)), collisionLine);
            const j_divLinear = lb2d.dotProduct(collisionLine, lb2d.multVector(collisionLine, (1/a.mass + 1/b.mass)));
            const j = j_denominator / j_divLinear;
            // Grundlage für Friction berechnen
            const t = new lb2d.Vector(-(collisionLine.y), collisionLine.x);
            const t_scalarprodukt = lb2d.dotProduct(velocity_AB, t);
            t.mult(t_scalarprodukt);
            t.normalize();
            //apply Force
            a.accel.add(lb2d.addVector(lb2d.multVector(collisionLine, (j/a.mass)), lb2d.multVector(t, (0.2*-j/a.mass))));
            b.accel.add(lb2d.addVector(lb2d.multVector(collisionLine, (-j/b.mass)), lb2d.multVector(t, (0.2*j/b.mass))))
            a.angAccel += lb2d.dotProduct(rA_perp, lb2d.multVector(t, 0.1*-j/a.inertia));
            b.angAccel += lb2d.dotProduct(rB_perp, lb2d.multVector(t, 0.1*j/b.inertia));
        }
    }
}

/** @type {(ball: Shape, box: Shape) => void} */
function checkCollisionBallBoxes(ball, box) {
    for (let j = 0; j < 4; j++) {
        let e = lb2d.subVector(box.vertices[j+1], box.vertices[j]);
        //Vektor von Ecke der Box zum Ball
        let VerticeToBall = lb2d.subVector(ball.location, box.vertices[j]);
        // --------- Einfügung 09.04.2021, um Kollision mit Ecken abzufangen
        if (VerticeToBall.mag() < ball.radius) {
            resolveCollisionBallBoxes(ball, box, box.vertices[j], VerticeToBall);
            return;
        }
        // --------- Ende Einfügung 09.04.2021
        let mag_e = e.mag();
        e.normalize();
        //Scalarprojektion von Vektor VerticeToBall auf Kante e
        let scalar_e = lb2d.dotProduct(VerticeToBall, e);
        if (scalar_e > 0 && scalar_e <= mag_e) {
            //Senkrechte von Ball trifft auf Kante e der Box
            //e2 = Kante e mit der Länge von scalar_e
            let e2 = lb2d.multVector(e, scalar_e);
            //Senkrechte von e zum Ball = VerticeToBall - e2
            let e_perp = lb2d.subVector(VerticeToBall, e2);

            if (e_perp.mag() < ball.radius) {
                //Ball berührt Box
                //Abstand wieder herstellen mit mtv (minimal translation vector)
                let mtv = e_perp.copy();
                let p = lb2d.addVector(box.vertices[j], e2);
                mtv.setMag(ball.radius - e_perp.mag());
                //e_perp und damit mtv zeigt von Kante zu Ball
                ball.resetPos(mtv);
                //vor Berechnung muss e_perp normalisiert werden
                e_perp.normalize();
                resolveCollisionBallBoxes(ball, box, p, e_perp)
                return;
            }
        }
    }
}

/** @type {(ball: Shape, box: Shape, cp: lb2d.Vector, normal:lb2d.Vector) => void} */
function resolveCollisionBallBoxes(ball, box, cp, normal) {
    const rA = lb2d.multVector(normal, -ball.radius);
    const rA_perp = new lb2d.Vector(-rA.y, rA.x);
    const rBP = lb2d.subVector(cp, box.location);
    const rBP_perp = new lb2d.Vector(-rBP.y, rBP.x);
    const VtanA = lb2d.multVector(rA_perp, ball.angVelocity);
    const VgesamtA = lb2d.addVector(ball.velocity, VtanA);
    const VtanB = lb2d.multVector(rBP_perp, box.angVelocity);
    const VgesamtB = lb2d.addVector(box.velocity, VtanB);
    const velocity_AB = lb2d.subVector(VgesamtA, VgesamtB);

    if (lb2d.dotProduct(velocity_AB, normal) < 0) { // wenn negativ, dann auf Kollisionskurs

        const e = 1; //inelastischer Stoß
        const j_denominator = lb2d.dotProduct(lb2d.multVector(velocity_AB, -(1+e)), normal);
        const j_divLinear = lb2d.dotProduct(normal, lb2d.multVector(normal, (1/ball.mass + 1/box.mass)));
        const j_divAngular = Math.pow(lb2d.dotProduct(rBP_perp, normal), 2) / box.inertia; //nur für Box zu rechnen
        const j = j_denominator / (j_divLinear + j_divAngular);
        // Grundlage für Friction berechnen
        const t = new lb2d.Vector(-(normal.y), normal.x);
        const t_scalarprodukt = lb2d.dotProduct(velocity_AB, t);
        t.mult(t_scalarprodukt);
        t.normalize();

        ball.accel.add(lb2d.addVector(lb2d.multVector(normal, (j/ball.mass)), lb2d.multVector(t, (0.05*-j/ball.mass))));
        box.accel.add(lb2d.addVector(lb2d.multVector(normal, (-j/box.mass)), lb2d.multVector(t, (0.05*j/box.mass))));
        ball.angAccel += lb2d.dotProduct(rA_perp, lb2d.multVector(t, 0.05*-j/ball.inertia));
        box.angAccel += lb2d.dotProduct(rBP_perp, lb2d.addVector(lb2d.multVector(normal, -j/box.inertia), lb2d.multVector(t, 0.05*j/box.inertia)));
    }
}

/** 
 * @param {Shape[]} el
 */
export function checkCollision(el) {
    for (let i = 0; i < el.length; i++) {    
        for (let j = i+1; j < el.length; j++ ) {
            //Shadow berechnen von Element i und Element j 
            let shadow_i = createShadow(el[i]);
            let shadow_j = createShadow(el[j]);
            //Überschneidung prüfen
            if (shadow_i.maxX >= shadow_j.minX && shadow_i.minX <= shadow_j.maxX && shadow_i.maxY >= shadow_j.minY && shadow_i.minY <= shadow_j.maxY) {  
                //dann Überschneidung
                // Testcode
                lb2d.line(el[i].location.x, el[i].location.y, el[j].location.x, el[j].location.y)
                // Ende Testcode
    
                if (el[i].typ == "Ball") {
                    if (el[j].typ == "Ball") {
                        checkCollisionBalls(el[i], el[j]);
                    } else {
                        checkCollisionBallBoxes(el[i],el[j]);
                    }
                }
            
                if (el[i].typ == "Box") {
                    if (el[j].typ == "Box") {
                        checkCollisionBoxes(el[i], el[j]);
                    } else {
                        checkCollisionBallBoxes(el[j], el[i]);
                    }            
                }
            }

        }
    }
}

/** 
 * @returns {(el:Shape[]) => void} function for checkKicking elements
*/
export function createKicking() {
    /** @type {?number} */
    let index = null;
    let base = new lb2d.Vector(0, 0);
    
    return function(el) {
        if (lb2d.isMouseDown() && index == null) {
            el.forEach((element, idx) => {
                if (element.location.dist(new lb2d.Vector(lb2d.mouseX, lb2d.mouseY)) < 15) {
                  base.set(element.location.x, element.location.y);
                  index = idx;
                }
            })  
            return;  
        }
    
        if (lb2d.isMouseDown() && index != null) {
            lb2d.drawArrow(base, new lb2d.Vector(lb2d.mouseX, lb2d.mouseY), 100);
            return;
        }  
    
        if (lb2d.isMouseUp() && index != null) {
            let mouse = new lb2d.Vector(lb2d.mouseX, lb2d.mouseY);
            let force = lb2d.subVector(mouse, el[index].location);
            el[index].applyForce(force, 0);
            index = null;
            return;
        }      
    }
}

/** 
 * @param {Shape} element
*/
function createShadow(element) {
    /** @type {{minX:number, maxX:number, minY:number, maxY:number}} */
    let shadow;
    if (element.typ == "Ball") {
        shadow = {minX:element.location.x - element.radius, maxX:element.location.x + element.radius, minY:element.location.y - element.radius, maxY:element.location.y + element.radius}
    } else {
        shadow = {minX:Infinity, maxX:-Infinity, minY:Infinity, maxY:-Infinity}
        for (let i = 0; i < 4; i++) {
            if (element.vertices[i].x < shadow.minX) {
                shadow.minX = element.vertices[i].x;
            } 
            if (element.vertices[i].y < shadow.minY) {
                shadow.minY = element.vertices[i].y;
            } 
            if (element.vertices[i].x > shadow.maxX) {
                shadow.maxX = element.vertices[i].x;
            } 
            if (element.vertices[i].y > shadow.maxY) {
                shadow.maxY = element.vertices[i].y;
            } 
        }    
    }
    
    return shadow;
    
    
    
        

}
