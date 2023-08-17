let { init, Sprite, GameLoop, initKeys, keyPressed, Text } = kontra

let { canvas } = init();

initKeys();

let ground = 186;

let points = 1;

let multiplier = 0.0001

let text = Text({
    text: points,
    font: '20px Arial',
    color: 'black',
    x: 25,
    y: 25,
    anchor: {x: 0.5, y: 0.5},
    textAlign: 'center'
  });

let obstacle = Sprite({
    x: 256,
    y: 231,
    width: 25,
    height: 25,
    color: 'blue',
    dx: -3,
});

let enemy = Sprite({
    x: 512,
    y: 206,
    width: 25,
    height: 50,
    color: 'red',
    dx: -3,
});

let arrow = Sprite({
    x: 768,
    y: 206,
    width: 50,
    height: 5,
    color: 'black',
    dx: -3,
});

let knight = Sprite({
    x: 30,
    y: ground,
    width: 35,
    height: 70,
    color: 'green',
    dx:0,
});

let loop = GameLoop({
    update: function(){
        knight.update();
        obstacle.update();
        enemy.update();
        arrow.update();

        if (obstacle.dx >= -10) {
            obstacle.dx *= 1.0001;
            enemy.dx *= 1.0001;
            arrow.dx *= 1.0001;
        }

        // points system start
        multiplier += 0.00001
        points = points + multiplier;
        text.text = Math.floor(points);
        //points system end

        //jumping start
        let gravity = 0.3;

        //make knight fall
        knight.dy += gravity

        //if on (or below) ground, go to ground
        if (knight.y >= ground){
            knight.y = ground
        }

        //if on ground, make knight jump up
        if (keyPressed("arrowup") || keyPressed("space")){
            if (knight.y >= ground){
                knight.dy = -5;
            }
        }
        //jumping end

        let sprites = [obstacle, enemy, arrow];
        var randomSprite = sprites[Math.floor(Math.random() * sprites.length)];

        function spawnObstacle(sprite) {
            if (sprite.x <= -256) {
                sprite.x = Math.floor(Math.random() * 512) + 256;
            }
        }

        spawnObstacle(randomSprite);

    },
    render: function() {
        text.render();
        knight.render();
        obstacle.render();
        enemy.render();
        arrow.render();
    }
})


loop.start();