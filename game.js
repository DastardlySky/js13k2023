let { init, Sprite, Scene, GameLoop, initKeys, keyPressed, Text, collides } = kontra;

let { canvas } = init();

initKeys();

let ground = 186;
let points = 1;
let multiplier = 0.0001;
var AttackCooldown = 0;
var duckCooldown = 0;


let text = Text({
  text: points,
  font: "20px Arial",
  color: "black",
  x: 25,
  y: 25,
  anchor: { x: 0.5, y: 0.5 },
  textAlign: "center",
});

let obstacle = Sprite({
  x: 256,
  y: 231,
  width: 25,
  height: 25,
  color: "blue",
  dx: -3,
});

let enemy = Sprite({
  x: 512,
  y: 206,
  width: 25,
  height: 50,
  color: "red",
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
  width: 35,
  height: 70,
  color: "green",
  dx: 0,
});

let sword = Sprite({
  x: 65,
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
  objects: []
});

let game = Scene({
  id: 'game',
  objects: [knight, obstacle, enemy, arrow, sword, text],
});

let loop = GameLoop({
  update: function () {
    knight.update();
    obstacle.update();
    enemy.update();
    arrow.update();
    sword.update();

    if (obstacle.dx >= -10) {
      obstacle.dx *= 1.0001;
      enemy.dx *= 1.0001;
      arrow.dx *= 1.0001;
    }

    // points system start
    multiplier += 0.00001;
    points = points + multiplier;
    text.text = Math.floor(points);
    //points system end

    //jumping start
    let gravity = 0.3;

    //make knight fall
    knight.dy += gravity;

    //if on (or below) ground, go to ground
    if (knight.y >= ground) {
      knight.y = ground;
    }

    //if on ground, make knight jump up
    if ((keyPressed("arrowup") || keyPressed("space"))) {
      if (knight.y >= ground) {
        knight.dy = -5.5;
      }
    }
    //jumping end

    // attack start
    if ((keyPressed("arrowright")) && (AttackCooldown == 0) && knight.y >= ground) {
      // show sword
      sword.opacity = 1;
      AttackCooldown = 60;
    }

    // if sword is showing
    if (sword.opacity == 1) {
      // check for collisions
      if (collides(sword, enemy)) {
        enemy.x = -256;
      }
      AttackCooldown -= 1;
    }

    if (AttackCooldown > 0) {
      AttackCooldown -= 1;
      if (AttackCooldown < 30) {
        // hide sword
        sword.opacity = 0;
      }
    }
    // attack end

    //duck start
    if ((AttackCooldown == 0) && keyPressed("arrowdown")){
      duckCooldown = 60;
    }

    if (duckCooldown > 0){
      knight.height = 30;
      knight.y = 226;
      duckCooldown -= 1
    }
    else{
      knight.height = 70;
    }

    let sprites = [obstacle, enemy, arrow];

    for (let sprite of sprites) {
      if (collides(knight, sprite)) {
        // alert("GAME OVER!!!");
      }
    }

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
          newSpriteX = Math.floor(Math.random() * 1280) + 256;
        } while (isCloseToOtherSprites(newSpriteX, sprite, sprites) == true);

        sprite.x = newSpriteX;
      }
    }

    // update sword position when jumping
    sword.y = knight.y + 30;
  },
  render: function () {
    start.render();
    if (1==1) {
      game.render();
    }
  },
});

loop.start()
