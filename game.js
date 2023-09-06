import { init, Sprite, SpriteSheet, Scene, GameLoop, initKeys, keyPressed, Text, collides } from "./libs/kontra.js";


let { canvas, context } = init();
context.imageSmoothingEnabled = false;

let gameOver = false;
let bpm = 100;
let node = null;
let playingSong = true;


let image = new Image();
image.onload = function() {


initKeys();

let ground = 192;
let gravity = 0.3;
let points = 0;
let highScore = localStorage.getItem("highScore") || 0;
let multiplier = 0.0001;
var AttackCooldown = 0;   
var duckCooldown = 0;
var activeScene = "menu"

function playSong() {
  console.log(bpm);
  let song = [[[,0,25,.002,.02,.08,3,,,,,,,,,.1,.01]],[[[,,13,,,,13,,,15,17,,13,,17,,20,,25,,,,25,,,24,25,,20,,17,,13,,18,,,,22,,,18,17,,20,,17,,13,,15,,,,20,,,22,20,,18,,17,,15,,]],[[,,13,,,,13,,,15,17,,13,,17,,20,,25,,,,25,,,24,25,,20,,17,,13,,18,,,,22,,,18,17,,20,,17,,13,,15,,,,13,,,12,13,,,,24,,,25]],[[,,27,,,,27,,,27,27,,24,,20,,,,25,,,,29,,,27,25,,22,,20,,,,25,,,,25,,,25,25,,,,25,,,24,22,,25,,24,,22,,20,,18,,17,,15,,]],[[,,13,,,,13,,,15,17,,13,,17,,20,,25,,,,25,,,24,25,,20,,17,,13,,18,,,,22,,,18,17,,20,,17,,13,,15,,,,13,,,12,13,,,,,,,,]]],[0,1,2,3],bpm,{"title":"Scotland The Brave","instruments":["Poly Synth"],"patterns":["Pattern 0","Pattern 1","Pattern 2","Pattern 3"]}]
  // Generate the sample data and play the song
  let buffer = zzfxM(...song);
  node = zzfxP(...buffer);
  playingSong = true;

  // Attach an onended event to update BPM and play again
  node.onended = function() {
    playingSong = false;
    
    // Increase BPM
    if (points >= 1){
    bpm += 20;
    }
    
    // Play the song again with updated BPM
    if (!gameOver && !playingSong){
      playSong();
    }
  };
};

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

  let characterSheet = SpriteSheet({
    image: image,
    frameWidth: 16,
    frameHeight: 32,
    animations: {
      knightWalk: {
        frames: '1..1',
        frameRate: 30
      },
      enemyWalk: {
        frames: '0..0',
        frameRate: 30
      },
      skellyWalk: {
        frames: '2..2',
        frameRate: 30
      }
    }
  });

  let backgroundSheet = SpriteSheet({
    image: image,
    frameWidth: 512,
    frameHeight: 256,
    animations: {
      default: {
        frames: '1..1',
        frameRate: 30
      },
      bridge: {
        frames: '2..2',
        frameRate: 30
      },
      clouds1: {
        frames: '3..3',
        frameRate: 30
      },
      clouds2: {
        frames: '4..4',
        frameRate: 30
      },
  },  
});

let knightGameText = Sprite({
  x: 135,
  y: 80,
  width: 512,
  height: 256,
  anchor: { x: 0.5, y: 0.5 },
  render() {
    drawPixelText(this.context, 'FREEEDOOOM!!!!!!!', this.x, this.y, '20px Ariel', 10, 3);
  }
});

let pressStartText = Sprite({
  x: 189,
  y: 110,
  width: 512,
  height: 256,
  anchor: { x: 0.5, y: 0.5 },
  render() {
    drawPixelText(this.context, 'Press Enter to Start', this.x, this.y, '16px Ariel', 50, 2);
  }
});

let highScoreMainText = Sprite({
  x: 10,
  y: 165,
  width: 512,
  height: 256,
  anchor: { x: 0, y: 0.5 },
  render() {
    drawPixelText(this.context, `High Score: ${Math.floor(highScore)}`, this.x, this.y, '16px Ariel', 50, 2);
  }
});

let pointsText = Text({
  x: 7,
  y: 1,
  anchor: { x: 0.5, y: 0.5 },
  render() {
    drawPixelText(this.context, `${Math.floor(points)}`, this.x, this.y, '16px Ariel', 50, 2);
  }
});

let gameOverText = Text({
  x: 30,
  y: 5,
  anchor: { x: 0.5, y: 0.5 },
  textAlign: "center",
  opacity: 0,
  render() {
    drawPixelText(this.context, 'Game Over', this.x, this.y, '16px Ariel', 20, 5);
  }
});

let waterAndSkyA = Sprite({
  x: 0,
  y: 0,
  width: 512,
  height: 256,
  animations: backgroundSheet.animations,
  dx: -0.75,
  order: 0,
});

let waterAndSkyB = Sprite({
  x: 512,
  y: 0,
  width: 512,
  height: 256,
  animations: backgroundSheet.animations,
  dx: -0.75,
  order: 1,
});

let bridgeA = Sprite({
  x: 0,
  y: 0,
  width: 512,
  height: 256,
  animations: backgroundSheet.animations,
  dx: -0.75,
  order: 0,
});

let bridgeB = Sprite({
  x: 512,
  y: 0,
  width: 512,
  height: 256,
  animations: backgroundSheet.animations,
  dx: -0.75,
  order: 0,
});

let cloud1A = Sprite({
  x: 0,
  y: 0,
  width: 512,
  height: 256,
  animations: backgroundSheet.animations,
  dx: -1,
  order: 0,
});

let cloud1B = Sprite({
  x: 512,
  y: 0,
  width: 512,
  height: 256,
  animations: backgroundSheet.animations,
  dx: -1,
  order: 0,
});

let cloud2A = Sprite({
  x: 0,
  y: 0,
  width: 512,
  height: 256,
  animations: backgroundSheet.animations,
  dx: -0.75,
  order: 0,
});

let cloud2B = Sprite({
  x: 512,
  y: 0,
  width: 512,
  height: 256,
  animations: backgroundSheet.animations,
  dx: -0.75,
  order: 0,
});

// Create an array of the sprites
let waterAndSkySprites = [waterAndSkyA, waterAndSkyB];
let bridgeSprites = [bridgeA, bridgeB];
let cloud1Sprites = [cloud1A, cloud1B];
let cloud2Sprites = [cloud2A, cloud2B];

let obstacle = Sprite({
  x: 512,
  y: 236,
  width: 20,
  height: 20,
  color: "blue",
  dx: -3,
});

let skelly = Sprite({
  x: 1300,
  y: ground,
  width: 32,
  height: 64,
  animations: characterSheet.animations,
  dx: -3,
});

let enemy = Sprite({
  x: 768,
  y: ground,
  width: 32,
  height: 64,
  animations: characterSheet.animations,
  dx: -3,
});

let arrow = Sprite({
  x: 1024,
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
  animations: characterSheet.animations
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
  objects: [waterAndSkyA, waterAndSkyB, cloud2A, cloud2B, cloud1A, cloud1B, bridgeA, bridgeB, knightGameText, pressStartText, highScoreMainText]
});

let game = Scene({
  id: 'game',
  objects: [waterAndSkyA, waterAndSkyB, cloud2A, cloud2B, cloud1A, cloud1B, bridgeA, bridgeB, knight, obstacle, enemy, skelly, arrow, sword, pointsText, gameOverText],
});

let sprites = [obstacle, enemy, skelly, arrow];

let loop = GameLoop({
  update: function () {
    bridgeA.playAnimation('bridge');
    bridgeB.playAnimation('bridge');
    cloud1A.playAnimation('clouds1');
    cloud1B.playAnimation('clouds1');
    cloud2A.playAnimation('clouds2');
    cloud2B.playAnimation('clouds2');
    if(waterAndSkyA.x <= -512){
      waterAndSkyA.x = 0;
      waterAndSkyB.x = 512;
    }
    if(bridgeA.x <= -512){
      bridgeA.x = 0;
      bridgeB.x = 512;
    }
    if(cloud1A.x <= -512){
      cloud1A.x = 0;
      cloud1B.x = 512;
    }
    if(cloud2A.x <= -512){
      cloud2A.x = 0;
      cloud2B.x = 512;
    }


    if (activeScene == "menu"){
      if (keyPressed("enter")){
        activeScene = "game"
        if (!gameOver){
          playSong();
        }
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
    skelly.playAnimation('skellyWalk');
    skelly.update();

    if (obstacle.dx >= -13 && !gameOver) {
      obstacle.dx *= 1.0001;
      enemy.dx *= 1.0001;
      skelly.dx *= 1.0001;
      arrow.dx *= 1.0001;
    }

    // points system start
    multiplier += 0.00001;
    if (!gameOver){points = points + multiplier;}
    pointsText.text = Math.floor(points);
    //points system end

    //jumping start

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
        enemy.x = -50;
      }

      if (collides(sword, skelly)) {
        skelly.x = -50;
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

    // check for a game over
    for (let sprite of sprites) {
      if (collides(knight, sprite)) {
        if (!gameOver){
        zzfx(...[,,348,.1,.14,.46,,.14,-0.1,-2.8,-62,.08,.06,,,.1,,.48,.26]); // game over sound effect
        gameOver = true;
        }
      }
    }

    waterAndSkySprites.forEach((sprite) => {
      sprite.dx = obstacle.dx / 5;
      sprite.update();
    });

    bridgeSprites.forEach((sprite) => {
      sprite.dx = obstacle.dx * 0.75;
      sprite.update();
    });

    cloud1Sprites.forEach((sprite) => {
      sprite.dx = obstacle.dx / 5;
      sprite.update();
    });

    cloud2Sprites.forEach((sprite) => {
      sprite.dx = obstacle.dx / 6;
      sprite.update();
    });

    if (gameOver){
      if (points > highScore) {
        highScore = points;
        localStorage.setItem("highScore", highScore);
      }
      knight.y = 229;
      knight.width = 64;
      knight.height = 32;
      obstacle.dx = 0;
      enemy.dx = 0;
      skelly.dx = 0;
      gameOverText.opacity = 1;
      bpm = 100;
      node.stop();
    }

    if (gameOver){
      if(keyPressed("enter")){
        bpm = 100;
        if(!playingSong){playSong();}
        gameOver = false
        gameOverText.opacity = 0;
        knight.width = 32;
        points = 0;
        multiplier = 0.0001;
        obstacle.x = 256;
        obstacle.dx = -3
        enemy.x = 512;
        enemy.dx = -3;
        skelly.x = 1200;
        skelly.dx = -3;
        arrow.x = 768;
        arrow.dx = -3
      }
    }
    // end

    // refactor this?
    function isCloseToOtherSprites(newSpriteX, currentSprite, sprites) {
      for (let sprite of sprites) {
        if (sprite !== currentSprite && Math.abs(sprite.x - newSpriteX) < 300) {
          return true;
        }
      }
      return false;
    }

    for (let sprite of sprites) {
      if (sprite.x <= -50) {
        let newSpriteX;
        do {
          newSpriteX = Math.floor(Math.random() * 2048) + 512;
        } while (isCloseToOtherSprites(newSpriteX, sprite, sprites) == true);

        sprite.x = newSpriteX;
      }
    }

    // update sword position when jumping
    sword.y = knight.y + 30;
  }
  // console.log(obstacle.dx);
},
  render: function () {
    if (activeScene == "menu") {
      start.render();
      start.update();
    }
    else if (activeScene == "game"){
      game.render();
    }
  },
});

loop.start()
};

image.src = 'sheet.png';