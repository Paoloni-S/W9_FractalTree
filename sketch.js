
/* DN3008 Generative Art, Skye Paoloni 2026
 * Week 9 - Fractals & Recursion
 * 02: LIVING TREE - followed instructions, editted and commented. 
 */

const DEPTH = 9;
let seed = 7;
let sky;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);

  sky = createGraphics(width, height);
  paintSky(sky);
}

function draw() {
  randomSeed(seed); // Keeps the random branch variations consistent between frames.

  image(sky, 0, 0);

  // Mouse position controls the angle of the tree branches.
  const angle = map(mouseX, 0, width, 0.15, 0.75);

  push();
  translate(width / 2, height - 90);
  branch(165, DEPTH, angle);
  pop();

  // Draws the ground in front of the bottom of the tree.
  noStroke();
  fill(250, 45, 12);
  ellipse(width / 2, height + 40, width * 1.6, 300);
}

function branch(len, depth, angle) {
  // Gradually changes branch thickness and colour from trunk to tips.
  const t = 1 - depth / DEPTH;
  const bark = color(20, 45, 40);
  const twig = color(345, 40, 95);

  stroke(lerpColor(bark, twig, t));
  strokeWeight(map(depth, 0, DEPTH, 0.6, 16));
  strokeCap(ROUND);

  // Draws each branch upwards from its starting point.
  line(0, 0, 0, -len);

  // Moves the origin to the endpoint of the current branch.
  translate(0, -len);

  // Stops recursion at the tips and adds a blossom.
  if (depth === 0) {
    blossom();
    return;
  }

  // Wind affects the smaller branches more than the trunk.
  const wind = (noise(depth * 0.3, frameCount * 0.008) - 0.5) * 0.5 * t;

  // Adds small random variations to branch angles and lengths.
  const leftAngle = angle + random(-0.15, 0.15) + wind;
  const rightAngle = -angle + random(-0.15, 0.15) + wind;

  const leftLen = len * random(0.66, 0.78);
  const rightLen = len * random(0.66, 0.78);

  // Creates the left branch while preserving the parent's position.
  push();
  rotate(leftAngle);
  branch(leftLen, depth - 1, angle);
  pop();

  // Creates the right branch independently of the left branch.
  push();
  rotate(rightAngle);
  branch(rightLen, depth - 1, angle);
  pop();
}

function blossom() {
  // Adds a soft, semi-transparent pink circle at each branch tip.
  push();
  noStroke();
  fill(345, 45, 100, 65);
  circle(0, 0, 11);
  pop();
}

// --- Given: dusk sky ---
function paintSky(g) {
  g.colorMode(HSB, 360, 100, 100, 100);
  g.noStroke();

  // Creates a gradual colour transition for the dusk background.
  for (let y = 0; y < g.height; y++) {
    const t = y / g.height;
    g.fill(lerpColor(color(250, 60, 14), color(15, 55, 75), pow(t, 1.8)));
    g.rect(0, y, g.width, 1);
  }

  // Generates randomly positioned stars.
  randomSeed(3);
  for (let i = 0; i < 140; i++) {
    g.fill(0, 0, 100, random(20, 80));
    g.circle(random(g.width), random(g.height * 0.55), random(0.8, 2.2));
  }

  // Adds a softly coloured moon to the sky.
  g.fill(40, 20, 100, 90);
  g.circle(g.width * 0.78, g.height * 0.24, 70);
}

function keyPressed() {
  // Press R to generate a new random arrangement of branches.
  if (key === "r" || key === "R") {
    seed = floor(random(100000));
  }

  // Press S to save the current artwork as a PNG.
  if (key === "s" || key === "S") {
    saveCanvas("living-tree", "png");
  }
}

