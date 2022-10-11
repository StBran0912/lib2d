// @ts-check
import * as lb2d from './lb2d.js';

/** Interface Box Properties
 * @typedef {Object} BoxProps
 * @property {string} typ
 * @property {lb2d.Vector[]} vertices
 * @property {lb2d.Vector} location
 * @property {lb2d.Vector} velocity
 * @property {number} angVelocity
 * @property {lb2d.Vector} accel
 * @property {number} angAccel
 * @property {number} mass
 * @property {number} inertia
 * @property {number} coefficient
 */

/** Interface Ball Properties
 * @typedef {Object} BallProps
 * @property {string} typ
 * @property {lb2d.Vector} location
 * @property {lb2d.Vector} velocity
 * @property {number} angVelocity
 * @property {number} radius
 * @property {lb2d.Vector} accel
 * @property {number} angAccel
 * @property {number} mass
 * @property {number} inertia
 * @property {lb2d.Vector} orientation
 * @property {number} coefficient
 */

/** Interface Box
 * @typedef {Object} Box
 * @property {BoxProps} me
 * @property {() => void} display
 * @property {(angle: number) => void} rotate
 * @property {(force: lb2d.Vector, angForce: number) => void} applyForce
 * @property {() => void} applyFriction
 * @property {(v: lb2d.Vector) => void} resetPos
 * @property {() => void} update
*/

/** Interface Ball
 * @typedef {Object} Ball
 * @property {BallProps} me
 * @property {() => void} display
 * @property {(angle: number) => void} rotate
 * @property {(force: lb2d.Vector, angForce: number) => void} applyForce
 * @property {() => void} applyFriction
 * @property {(v: lb2d.Vector) => void} resetPos
 * @property {() => void} update
 */

/** @type {(posx: number, posy: number, w: number, h: number) => Box} */
export function createBox(posx, posy, w, h) {

    /** @type {BoxProps} */
    const me = {
        typ: "Box",
        vertices: new Array(5),
        location: lb2d.createVector(posx + w / 2, posy + h / 2),
        velocity: lb2d.createVector(0, 0),
        angVelocity: 0,
        accel: lb2d.createVector(0, 0),
        angAccel: 0,
        mass: (w + h)*2,
        inertia: w * h * w,
        coefficient: 0.0005
    }
 
     me.vertices[0] = lb2d.createVector(posx, posy);
     me.vertices[1] = lb2d.createVector(posx + w, posy);
     me.vertices[2] = lb2d.createVector(posx + w, posy + h);
     me.vertices[3] = lb2d.createVector(posx, posy + h);
     me.vertices[4] = me.vertices[0];
 
    /** @type {(angle: number) => void} */
    function rotate(angle) {
        for (let i = 0; i < 4; i++) {
            me.vertices[i].rotateMatrix(me.location, angle);
        }
    }
 
    /** @type {() => void} */
    function update() {
        me.velocity.add(me.accel);
        me.accel.set(0,0);
        me.angVelocity += me.angAccel;
        me.angAccel = 0;

        me.location.add(me.velocity);
        me.vertices[0].add(me.velocity);
        me.vertices[1].add(me.velocity);
        me.vertices[2].add(me.velocity);
        me.vertices[3].add(me.velocity);
        rotate(me.angVelocity);
    }

    /** @type {() => void} */
    function display() {
        lb2d.strokeWidth(2);
        lb2d.shape(me.vertices[0].pos.x, me.vertices[0].pos.y, me.vertices[1].pos.x, me.vertices[1].pos.y, me.vertices[2].pos.x, me.vertices[2].pos.y, me.vertices[3].pos.x, me.vertices[3].pos.y, 0);
        lb2d.circle(me.location.pos.x, me.location.pos.y, 2, 0);
    }

    /** @type {(force: lb2d.Vector, angForce: number) => void} */
    function applyForce(force, angForce) {
        me.accel = lb2d.divVector(force, me.mass);
        me.angAccel = angForce / me.mass; 
    }

    /** @type {() => void} */
    function applyFriction() {
        let frictVelocity = me.velocity.copy();
        frictVelocity.normalize();
        frictVelocity.mult(me.coefficient * -1); // in Gegenrichtung
        frictVelocity.limit(me.velocity.mag());
        me.accel.add(frictVelocity);

        const frictAngDirection = me.angVelocity < 0 ? 1 : -1; // in Gegenrichtung
        const frictAngVelocity = lb2d.limitNum(me.coefficient * 0.05 * frictAngDirection, Math.abs(me.angVelocity));
        me.angAccel += frictAngVelocity;
    }


    /** @type {(v: lb2d.Vector) => void} */
    function resetPos(v) {
        me.location.add(v);
        me.vertices[0].add(v);
        me.vertices[1].add(v);
        me.vertices[2].add(v);
        me.vertices[3].add(v);
    }
    
    return {
        me,
        rotate,
        update,
        display,
        applyForce,
        applyFriction,
        resetPos
    }
}

/** @type {(posx: number, posy: number, radius: number) => Ball} */
export function createBall(posx, posy, radius) {
    /** @type {BallProps} */
    const me = {
        typ: "Ball",
        location: lb2d.createVector(posx, posy),
        velocity: lb2d.createVector(0, 0),
        angVelocity: 0,
        radius: radius,
        accel: lb2d.createVector(0, 0),
        angAccel: 0,
        mass:radius * 2,
        inertia: radius * radius * radius/2,
        orientation: lb2d.createVector(radius, 0),
        coefficient: 0.0015
    }
    me.orientation.add(me.location)
    
    /** @type {() => void} */
    function display() {
        lb2d.strokeWidth(2);
        lb2d.circle(me.location.pos.x, me.location.pos.y, me.radius, 0);
        lb2d.line(me.location.pos.x, me.location.pos.y, me.orientation.pos.x, me.orientation.pos.y);
    }

    /** @type {(angle: number) => void} */
    function rotate(angle) {
        me.orientation.rotateMatrix(me.location, angle);
    }

    /** @type {(force: lb2d.Vector, angForce: number) => void} */
    function applyForce(force, angForce) {
        me.accel = lb2d.divVector(force, me.mass);
        me.angAccel = angForce / me.mass; 
    }

    /** @type {() => void} */
    function applyFriction() {
        let frictVelocity = me.velocity.copy();
        frictVelocity.normalize();
        frictVelocity.mult(me.coefficient * -1); // in Gegenrichtung
        frictVelocity.limit(me.velocity.mag());
        me.accel.add(frictVelocity);

        const frictAngDirection = me.angVelocity < 0 ? 1 : -1; // in Gegenrichtung
        const frictAngVelocity = lb2d.limitNum(me.coefficient * 0.05 * frictAngDirection, Math.abs(me.angVelocity));
        me.angAccel += frictAngVelocity;
    }
    
    /** @type {(v: lb2d.Vector) => void} */
    function resetPos(v) {
        me.location.add(v);
        me.orientation.add(v);
    }

    /** @type {() => void} */
    function update() {
        me.velocity.add(me.accel);
        me.accel.set(0,0);
        me.angVelocity += me.angAccel;
        me.angAccel = 0;

        me.location.add(me.velocity);
        me.orientation.add(me.velocity);
        rotate(me.angVelocity);
    }

    return {
        me,
        display,
        rotate,
        applyForce,
        applyFriction,
        resetPos,
        update
    };
}

/** @type {(a: Box, b: Box) => void} */
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
                let [, scalar_d] = lb2d.intersect(boxA.me.location, boxA.me.vertices[i], boxB.me.vertices[j], boxB.me.vertices[j + 1])
                if (scalar_d) {
                    // Prüfung auf intersection Linie z zu Kante e
                    let [, scalar_z] = lb2d.intersect(boxA.me.location, boxB.me.location, boxB.me.vertices[j], boxB.me.vertices[j + 1])
                    if (scalar_z) {
                        // Collision findet statt
                        // Objekte zurücksetzen und normal_e berechnen. Kollisionspunkz ist Ecke i von BoxA
                        let e = lb2d.subVector(boxB.me.vertices[j + 1], boxB.me.vertices[j]);
                        let e_perp = lb2d.createVector(-(e.pos.y), e.pos.x);   
                        let d = lb2d.subVector(boxA.me.vertices[i], boxA.me.location);
                        d.mult(1 - scalar_d);
                        e_perp.normalize(); 
                        let distance = lb2d.dotProduct(e_perp, d);
                        e_perp.mult(-distance); // mtv 
                        boxA.resetPos(lb2d.multVector(e_perp, 0.5));
                        boxB.resetPos(lb2d.multVector(e_perp, -0.5));
                        e_perp.normalize(); // normal_e
                        // Collision berechnen
                        // rAP = Linie von A.location zu Kollisionspunkt (Ecke i von BoxA)
                        let rAP = lb2d.subVector(boxA.me.vertices[i], boxA.me.location);
                        // rBP = Linie von B.location zu Kollisionspunkt (ebenfalls Ecke i von BoxA)
                        let rBP = lb2d.subVector(boxA.me.vertices[i], boxB.me.location);
                        let rAP_perp = lb2d.createVector(-rAP.pos.y, rAP.pos.x);
                        let rBP_perp = lb2d.createVector(-rBP.pos.y, rBP.pos.x);
                        let VtanA = lb2d.multVector(rAP_perp, boxA.me.angVelocity);
                        let VtanB = lb2d.multVector(rBP_perp, boxB.me.angVelocity);
                        let VgesamtA = lb2d.addVector(boxA.me.velocity, VtanA);
                        let VgesamtB = lb2d.addVector(boxB.me.velocity, VtanB);
                        const velocity_AB = lb2d.subVector(VgesamtA, VgesamtB);
                        if (lb2d.dotProduct(velocity_AB, e_perp) < 0) { // wenn negativ, dann auf Kollisionskurs
                            let e = 1; //inelastischer Stoß
                            let j_denominator = lb2d.dotProduct(lb2d.multVector(velocity_AB, -(1+e)), e_perp);
                            let j_divLinear = lb2d.dotProduct(e_perp, lb2d.multVector(e_perp, (1/boxA.me.mass + 1/boxB.me.mass)));
                            let j_divAngular = Math.pow(lb2d.dotProduct(rAP_perp, e_perp), 2) / boxA.me.inertia + Math.pow(lb2d.dotProduct(rBP_perp, e_perp), 2) / boxB.me.inertia;
                            let j = j_denominator / (j_divLinear + j_divAngular);
                            // Grundlage für Friction berechnen (t)
                            let t = lb2d.createVector(-(e_perp.pos.y), e_perp.pos.x);
                            let t_scalarprodukt = lb2d.dotProduct(velocity_AB, t);
                            t.mult(t_scalarprodukt);
                            t.normalize();
                            
                            //apply Force to acceleration
                            boxA.me.accel.add(lb2d.addVector(lb2d.multVector(e_perp, (j/boxA.me.mass)), lb2d.multVector(t, (0.2*-j/boxA.me.mass))));
                            boxB.me.accel.add(lb2d.addVector(lb2d.multVector(e_perp, (-j/boxB.me.mass)), lb2d.multVector(t, (0.2*j/boxB.me.mass))));
                            boxA.me.angAccel += lb2d.dotProduct(rAP_perp, lb2d.addVector(lb2d.multVector(e_perp, j/boxA.me.inertia), lb2d.multVector(t, 0.2*-j/boxA.me.inertia)));
                            boxB.me.angAccel += lb2d.dotProduct(rBP_perp, lb2d.addVector(lb2d.multVector(e_perp, -j/boxB.me.inertia), lb2d.multVector(t, 0.2*j/boxB.me.inertia)));
                        }
                    
                        return; 
                    }
                }
            }
        }
    }
}
 

/** @type {(a: Ball, b: Ball) => void} */
function checkCollisionBalls(a, b) {
//Distanz ermitteln
    let radiusTotal = a.me.radius + b.me.radius;
    let distance = a.me.location.dist(b.me.location);

    if (distance < radiusTotal) {
        //Treffer
        let space = (radiusTotal - distance);
        let collisionLine = lb2d.subVector(a.me.location, b.me.location);
        collisionLine.setMag(space);
        a.resetPos(lb2d.multVector(collisionLine, 0.5));
        b.resetPos(lb2d.multVector(collisionLine, -0.5));
        collisionLine.normalize();
        // resolveCollisionBalls(a, b, collisionLine);
        const rA = lb2d.multVector(collisionLine, -a.me.radius);
        const rA_perp = lb2d.createVector(-rA.pos.y, rA.pos.x);
        const rB = lb2d.multVector(collisionLine, b.me.radius);
        const rB_perp = lb2d.createVector(-rB.pos.y, rB.pos.x);
        const VtanA = lb2d.multVector(rA_perp, a.me.angVelocity);
        const VtanB = lb2d.multVector(rB_perp, b.me.angVelocity);
        const VgesamtA = lb2d.addVector(a.me.velocity, VtanA);
        const VgesamtB = lb2d.addVector(b.me.velocity, VtanB);
        const velocity_AB = lb2d.subVector(VgesamtA, VgesamtB);
    
        if (lb2d.dotProduct(velocity_AB, collisionLine) < 0) { // wenn negativ, dann auf Kollisionskurs
            const e = 1; //inelastischer Stoß
            const j_denominator = lb2d.dotProduct(lb2d.multVector(velocity_AB, -(1+e)), collisionLine);
            const j_divLinear = lb2d.dotProduct(collisionLine, lb2d.multVector(collisionLine, (1/a.me.mass + 1/b.me.mass)));
            const j = j_denominator / j_divLinear;
            // Grundlage für Friction berechnen
            const t = lb2d.createVector(-(collisionLine.pos.y), collisionLine.pos.x);
            const t_scalarprodukt = lb2d.dotProduct(velocity_AB, t);
            t.mult(t_scalarprodukt);
            t.normalize();
            //apply Force
            a.me.accel.add(lb2d.addVector(lb2d.multVector(collisionLine, (j/a.me.mass)), lb2d.multVector(t, (0.2*-j/a.me.mass))));
            b.me.accel.add(lb2d.addVector(lb2d.multVector(collisionLine, (-j/b.me.mass)), lb2d.multVector(t, (0.2*j/b.me.mass))))
            a.me.angAccel += lb2d.dotProduct(rA_perp, lb2d.multVector(t, 0.1*-j/a.me.inertia));
            b.me.angAccel += lb2d.dotProduct(rB_perp, lb2d.multVector(t, 0.1*j/b.me.inertia));
        }
    }
}

/** @type {(ball: Ball, box: Box) => void} */
function checkCollisionBallBoxes(ball, box) {
    for (let j = 0; j < 4; j++) {
        let e = lb2d.subVector(box.me.vertices[j+1], box.me.vertices[j]);
        //Vektor von Ecke der Box zum Ball
        let VerticeToBall = lb2d.subVector(ball.me.location, box.me.vertices[j]);
        // --------- Einfügung 09.04.2021, um Kollision mit Ecken abzufangen
        if (VerticeToBall.mag() < ball.me.radius) {
            resolveCollisionBallBoxes(ball, box, box.me.vertices[j], VerticeToBall);
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

            if (e_perp.mag() < ball.me.radius) {
                //Ball berührt Box
                //Abstand wieder herstellen mit mtv (minimal translation vector)
                let mtv = e_perp.copy();
                let p = lb2d.addVector(box.me.vertices[j], e2);
                mtv.setMag(ball.me.radius - e_perp.mag());
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

/** @type {(ball: Ball, box: Box, cp: lb2d.Vector, normal:lb2d.Vector) => void} */
function resolveCollisionBallBoxes(ball, box, cp, normal) {
    const rA = lb2d.multVector(normal, -ball.me.radius);
    const rA_perp = lb2d.createVector(-rA.pos.y, rA.pos.x);
    const rBP = lb2d.subVector(cp, box.me.location);
    const rBP_perp = lb2d.createVector(-rBP.pos.y, rBP.pos.x);
    const VtanA = lb2d.multVector(rA_perp, ball.me.angVelocity);
    const VgesamtA = lb2d.addVector(ball.me.velocity, VtanA);
    const VtanB = lb2d.multVector(rBP_perp, box.me.angVelocity);
    const VgesamtB = lb2d.addVector(box.me.velocity, VtanB);
    const velocity_AB = lb2d.subVector(VgesamtA, VgesamtB);

    if (lb2d.dotProduct(velocity_AB, normal) < 0) { // wenn negativ, dann auf Kollisionskurs

        const e = 1; //inelastischer Stoß
        const j_denominator = lb2d.dotProduct(lb2d.multVector(velocity_AB, -(1+e)), normal);
        const j_divLinear = lb2d.dotProduct(normal, lb2d.multVector(normal, (1/ball.me.mass + 1/box.me.mass)));
        const j_divAngular = Math.pow(lb2d.dotProduct(rBP_perp, normal), 2) / box.me.inertia; //nur für Box zu rechnen
        const j = j_denominator / (j_divLinear + j_divAngular);
        // Grundlage für Friction berechnen
        const t = lb2d.createVector(-(normal.pos.y), normal.pos.x);
        const t_scalarprodukt = lb2d.dotProduct(velocity_AB, t);
        t.mult(t_scalarprodukt);
        t.normalize();

        ball.me.accel.add(lb2d.addVector(lb2d.multVector(normal, (j/ball.me.mass)), lb2d.multVector(t, (0.05*-j/ball.me.mass))));
        box.me.accel.add(lb2d.addVector(lb2d.multVector(normal, (-j/box.me.mass)), lb2d.multVector(t, (0.05*j/box.me.mass))));
        ball.me.angAccel += lb2d.dotProduct(rA_perp, lb2d.multVector(t, 0.05*-j/ball.me.inertia));
        box.me.angAccel += lb2d.dotProduct(rBP_perp, lb2d.addVector(lb2d.multVector(normal, -j/box.me.inertia), lb2d.multVector(t, 0.05*j/box.me.inertia)));
    }
}


/** @type {(a: Ball|Box, b: Ball|Box) => void} */
export function checkCollision(a, b) {
    if (a.me.typ == "Ball") {
        if (b.me.typ == "Ball") {
            // @ts-ignore
            checkCollisionBalls(a, b);
        } else {
            // @ts-ignore
            checkCollisionBallBoxes(a,b);
        }
    }

    if (a.me.typ == "Box") {
        if (b.me.typ == "Box") {
            // @ts-ignore
            checkCollisionBoxes(a, b);
        } else {
            // @ts-ignore
            checkCollisionBallBoxes(b, a);
        }
        
    }
}  