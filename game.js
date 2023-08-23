// ZzFXMicro - Zuper Zmall Zound Zynth - v1.2.0 by Frank Force ~ 880 bytes
zzfxV=.3    // volume
zzfx=       // play sound
(p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=
0,B=0,M=Math,R=44100,d=2*M.PI,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,g
=0,H=0,a=0,n=1,I=0,J=0,f=0,x,h)=>{e=R*e+9;m*=R;r*=R;t*=R;c*=R;y*=500*d/R**3;A*=d
/R;v*=d/R;z*=R;l=R*l|0;for(h=e+m+r+t+c|0;a<h;k[a++]=f)++J%(100*F|0)||(f=q?1<q?2<
q?3<q?M.sin((g%d)**3):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2)%2:1-4*M.abs(M.
round(g/d)-g/d):M.sin(g),f=(l?1-B+B*M.sin(d*a/l):1)*(0<f?1:-1)*M.abs(f)**D*zzfxV
*p*(a<e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/2+(c>a?0:
(a<h-c?1:(h-a)/c)*k[a-c|0]/2):f),x=(b+=u+=y)*M.cos(A*H++),g+=x-x*E*(1-1E9*(M.sin
(a)+1)%2),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n||=1);p=zzfxX.
createBuffer(1,h,R);p.getChannelData(0).set(k);b=zzfxX.createBufferSource();b.
buffer=p;b.connect(zzfxX.destination);b.start();return b};zzfxX=new AudioContext;

let { init, Sprite, Scene, GameLoop, initKeys, keyPressed, Text, collides } = kontra;

let { canvas } = init();

initKeys();

let ground = 186;
let points = 1;
let multiplier = 0.0001;
var AttackCooldown = 0;
var duckCooldown = 0;
var activeScene = "menu"


let pointsText = Text({
  text: points,
  font: "20px Arial",
  color: "black",
  x: 25,
  y: 25,
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
  attacking: false,
  ducking: false,
  jumping: false,
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
  objects: []
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
    obstacle.update();
    enemy.update();
    arrow.update();
    sword.update();

    if (obstacle.dx >= -10 && !gameOver) {
      obstacle.dx *= 1.0001;
      enemy.dx *= 1.0001;
      arrow.dx *= 1.0001;
    }

    // points system start
    multiplier += 0.00001;
    if (!gameOver){points = points + multiplier;}
    pointsText.text = Math.floor(points);
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
        enemy.x = -50;
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
      knight.height = 70;
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
      knight.y = 221;
      knight.width = 70;
      knight.height = 35;
      obstacle.dx = 0;
      enemy.dx = 0;
      gameOverText.opacity = 1;
    }
    // end

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
  console.log(obstacle.dx);
},
  render: function () {
    start.render();
    if (activeScene == "menu") {
      start.render();
    }
    else if (activeScene == "game"){
      game.render();
    }
  },
});

loop.start()
