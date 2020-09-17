let canvas, gui;
let params = {
    update: false,
    save: () => saveCanvas('canvas.png'),
    hour: 9,
    min: 50,
    sec: 0,
    iter: 10,
    speed: 2,
    real: false
};

function setupGUI() {
    gui = new dat.GUI({autoPlace: false, width: 250});
    gui.closed = true;
    document.body.appendChild(gui.domElement);
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.left = canvas.x + canvas.width - gui.width + 'px';
    gui.domElement.style.top = canvas.y + 'px';

    gui.add(params, 'update').name('Animate gui');
    gui.add(params, 'save').name('Save canvas');

    gui.add(params, 'hour', 0, 23, 1).name('Hours');
    gui.add(params, 'min', 0, 59, 1).name('Minutes');
    gui.add(params, 'sec', 0, 59, 1).name('Seconds');
    gui.add(params, 'iter', 1, 15, 1).name('Iterations');
    gui.add(params, 'speed', 0, 8, 1).name('Speed');
    gui.add(params, 'real').name('Real time');
}


let a1, a2, k1, k2;

function draw_tree(s, e, it) {
    if (it === 0) return;


    stroke(lerpColor(color(0, 1, 0), color(0, 0, 1), it / params.iter));
    strokeWeight(1.5 + it / params.iter * 2);
    if (it < params.iter) line(s.x, s.y, e.x, e.y);

    let s1 = s.copy().sub(e).rotate(PI).rotate(a1).mult(k1).add(e);
    let s2 = s.copy().sub(e).rotate(PI).rotate(a2).mult(k2).add(e);
    draw_tree(e, s1, it - 1);
    draw_tree(e, s2, it - 1);
}

function setup() {
    canvas = createCanvas(800, 500);
    canvas.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2);
    pixelDensity(4);
    background(0);
    colorMode(RGB, 1);
    setupGUI();
}

function draw() {
    background(0);
    translate(width / 2, height / 2);
    rotate(PI);

    a1 = TWO_PI * (params.hour / 12 + params.min / 12 / 60 + params.sec / 12 / 60 / 60);
    a2 = TWO_PI * (params.min / 60 + params.sec / 60 / 60);
    k1 = 0.5;
    k2 = 0.7;

    if (params.real) {
        params.hour = hour();
        params.min = minute();
        params.sec = second();
    }

    let r = 110;
    stroke(0, 0, 1);
    strokeWeight(2);
    noFill();
    circle(0, 0, r * 2);
    for (let i = 0; i < 12; i++) {
        let v = p5.Vector.fromAngle(TWO_PI * i / 12).mult(r);
        let v2 = v.copy().mult(0.85);
        line(v.x, v.y, v2.x, v2.y);
    }

    strokeWeight(1.5);
    draw_tree(createVector(0, -r), createVector(0, 0), params.iter);
    for (let i = 0; i < params.speed; i++) {
        params.sec++;
        if (params.sec === 60) {
            params.min++;
            if (params.min === 60) {
                params.hour++;
                params.hour %= 12;
            }
            params.min %= 60;
        }
        params.sec %= 60;
    }

    if (params.update) gui.updateDisplay();
}

function clog(object) {
    console.log(object);
}
