let { init, Sprite, GameLoop, initKeys, keyPressed, Text } = kontra

let { canvas } = init();

initKeys();

let ground = 186;

let points = 1;

let multiplier = 0.01

let text = Text({
    text: points,
    font: '64px Arial',
    color: 'black',
    x: 128,
    y: 100,
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
        text.render();

        if (obstacle.dx >= -10) {
            obstacle.dx *= 1.0001;
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

        if (obstacle.x <= -256){
            obstacle.x = Math.floor(Math.random() * 512) + 256;
        }
    },
    render: function() {
        text.render();
        knight.render();
        obstacle.render();
    }
})


loop.start();