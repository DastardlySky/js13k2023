import { init, Sprite, SpriteSheet, Scene, GameLoop, initKeys, keyPressed, Text, collides } from "./kontra.js";
import {ZZFX, zzfx} from './ZzFX.js'

let { canvas, context } = init();
context.imageSmoothingEnabled = false;

let image = new Image();
image.onload = function() {


initKeys();

let ground = 192;
let points = 1;
let highScore = localStorage.getItem("highScore") || 0;
let multiplier = 0.0001;
var AttackCooldown = 0;
var duckCooldown = 0;
var activeScene = "menu"

  // Custom function to draw pixel art text
  function drawPixelText(context, text, x, y, font, threshold, scalingFactor) {
    let offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = 250;
    offscreenCanvas.height = 32;
    let d = offscreenCanvas.getContext('2d');

    d.font = font;
    d.textBaseline = "middle";
    d.fillText(text, 0, 16);

    let I = d.getImageData(0, 0, 250, 32);

    for(let i = 0; i < 250; i++) {
      for(let j = 0; j < 32; j++) {
        if(
          I.data[(j * 250 + i) * 4 + 1] > threshold ||
          I.data[(j * 250 + i) * 4 + 2] > threshold ||
          I.data[(j * 250 + i) * 4 + 3] > threshold
        ) {
          context.fillRect(x + i * scalingFactor, y + j * scalingFactor, scalingFactor, scalingFactor);
        }
      }
    }
  }

  let spriteSheet = SpriteSheet({
    image: image,
    frameWidth: 16,
    frameHeight: 32,
    animations: {
      // create a named animation: knightWalk
      knightWalk: {
        frames: '1..1',  // frames 0 through 9
        frameRate: 30
      },
      enemyWalk: {
        frames: '0..0',  // frames 0 through 9
        frameRate: 30
      }
    }
  });

let knightGameText = Sprite({
  x: 170,
  y: 75,
  width: 512,
  height: 256,
  anchor: { x: 0.5, y: 0.5 },
  render() {
    drawPixelText(this.context, 'KNIGHT GAME', this.x, this.y, '16px Ariel', 50, 3);
  }
});

let pressStartText = Sprite({
  x: 190,
  y: 110,
  width: 512,
  height: 256,
  anchor: { x: 0.5, y: 0.5 },
  render() {
    drawPixelText(this.context, 'Press Enter to Start', this.x, this.y, '16px Ariel', 50, 2);
  }
});

let highScoreMainText = Sprite({
  x: 197,
  y: 140,
  width: 512,
  height: 256,
  anchor: { x: 0.5, y: 0.5 },
  render() {
    drawPixelText(this.context, `High Score: ${Math.floor(highScore)}`, this.x, this.y, '16px Ariel', 50, 2);
  }
});



let pointsText = Text({
  text: points,
  font: "20px Arial",
  color: "black",
  x: 25,
  y: 25,
  anchor: { x: 0.5, y: 0.5 },
  textAlign: "center",
});

let highScoreText = Text({
  text: `High Score: ${Math.floor(highScore)}`,
  font: "20px Arial",
  color: "black",
  x: 256,
  y: 128,
  anchor: { x: 0.5, y: 0.5 },
  textAlign: "center",
});

let gameOverText = Text({
  text: "Game Over",
  font: "50px Arial",
  color: "black",
  x: 256,
  y: 128,
  anchor: { x: 0.5, y: 0.5 },
  textAlign: "center",
  opacity:0,
});

let obstacle = Sprite({
  x: 256,
  y: 236,
  width: 20,
  height: 20,
  color: "blue",
  dx: -3,
});

let enemy = Sprite({
  x: 512,
  y: ground,
  width: 32,
  height: 64,
  animations: spriteSheet.animations,
  dx: -3,
});

let arrow = Sprite({
  x: 768,
  y: 206,
  width: 50,
  height: 5,
  color: "black",
  dx: -3,
});

let knight = Sprite({
  x: 30,
  y: ground,
  width: 32,
  height: 64,
  dx: 0,
  attacking: false,
  ducking: false,
  jumping: false,
  animations: spriteSheet.animations
});

let sword = Sprite({
  x: 50,
  y: 220,
  width: 50,
  height: 10,
  color: "pink",
  dx: 0,
  opacity: 0,
});

let start = Scene({
  id: 'start',
  color: "pink",
  objects: [knightGameText, pressStartText, highScoreMainText]
});

let game = Scene({
  id: 'game',
  objects: [knight, obstacle, enemy, arrow, sword, pointsText, gameOverText],
});

let gameOver = false;

let loop = GameLoop({
  update: function () {
    if (activeScene == "menu"){
      if (keyPressed("enter")){
        activeScene = "game"
      }
    }
    if (activeScene == "game")
    {
    knight.update();
    knight.playAnimation('knightWalk');
    obstacle.update();
    enemy.update();
    enemy.playAnimation('enemyWalk');
    arrow.update();
    sword.update();

    if (obstacle.dx >= -13 && !gameOver) {
      obstacle.dx *= 1.0001;
      enemy.dx *= 1.0001;
      arrow.dx *= 1.0001;
    }

    // points system start
    multiplier += 0.00001;
    if (!gameOver){points = points + multiplier;}
    pointsText.text = Math.floor(points);

    if (points > highScore) {
      highScore = points;
      localStorage.setItem("highScore", highScore);
    }
    
    //points system end

    //jumping start
    let gravity = 0.3;

    //make knight fall
    knight.dy += gravity;

    //if on (or below) ground, go to ground
    if (knight.y >= ground) {
      knight.y = ground;
      knight.jumping = false;
    }

    //if on ground, make knight jump up
    if ((keyPressed("arrowup") || keyPressed("space")) && knight.ducking == false && !gameOver) {
      if (knight.y >= ground) {
        if(knight.attacking == false && knight.ducking == false){
        zzfx(...[,,69,.01,.02,.14,1,1.42,8.3,,,,,.1,,,,.7,.09]); // jump
        }
        knight.dy = -5;
        knight.jumping = true;
      }
    }
    //jumping end

    // attack start
    if ((keyPressed("arrowright")) && (AttackCooldown == 0) && (knight.ducking == false) && knight.y >= ground && !gameOver) {
      // show sword
      zzfx(...[1.07,,1260,.02,.07,,1,1.61,5.7,1.8,,,,,5,,,.75]); // hit
      sword.opacity = 1;
      AttackCooldown = 30;
    }

    // if sword is showing
    if (sword.opacity == 1) {
      // check for collisions
      if (collides(sword, enemy)) {
        enemy.y = -100;
      }
      AttackCooldown -= 1;
      sword.x += 1;
    }

    if (AttackCooldown > 0) {
      AttackCooldown -= 1;
      if (AttackCooldown < 15) {
        // hide sword
        sword.opacity = 0;
        sword.x = 50;
      }
    }
    // attack end

    //duck start
    if (keyPressed("arrowdown") && knight.jumping == false && !gameOver){
      if (knight.ducking == false){
      zzfx(...[,,-5,.03,.02,.08,1,.19,1.6,1.1,200,,,,2,,,.67,.02]); // duck
      }
      knight.ducking = true;
      duckCooldown = 60;
      knight.height = 30;
      knight.y = 226;
      duckCooldown -= 1
    }
    else{
      knight.height = 64;
      knight.ducking = false;
    }

    let sprites = [obstacle, enemy, arrow];

    // check for a game over
    for (let sprite of sprites) {
      if (collides(knight, sprite)) {
        if (!gameOver){
        zzfx(...[,,348,.1,.14,.46,,.14,-0.1,-2.8,-62,.08,.06,,,.1,,.48,.26]); // game over sound effect
        gameOver = true;
        }
      }
    }

    if (gameOver){
      knight.y = 229;
      knight.width = 64;
      knight.height = 32;
      obstacle.dx = 0;
      enemy.dx = 0;
      gameOverText.opacity = 1;
    }

    if (gameOver){
      if(keyPressed("enter")){
        gameOver = false
        gameOverText.opacity = 0;
        knight.width = 32;
        points = 0;
        multiplier = 0.0001;
        obstacle.x = 256;
        obstacle.dx = -3
        enemy.x = 512;
        enemy.dx = -3
        arrow.x = 768;
        arrow.dx = -3
      }
    }
    // end

    for (let sprite of sprites) {
      if (sprite.x <= -50) {
        sprite.x = 768;
        enemy.y = ground;
      }
    }

    // update sword position when jumping
    sword.y = knight.y + 30;
  }
  console.log(obstacle.dx);
},
  render: function () {
    if (activeScene == "menu") {
      start.render();
    }
    else if (activeScene == "game"){
      game.render();
    }
  },
});

loop.start()
};

image.src = 'sheet.png';