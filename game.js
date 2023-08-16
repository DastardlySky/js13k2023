kontra.init();

var obstacle = kontra.sprite({
    x: 256,
    y: 231,
    width: 25,
    height: 25,
    color: 'blue',
    dx:-5,
});

var ground = 186;

var knight = kontra.sprite({
    x: 30,
    y: ground,
    width: 35,
    height: 70,
    color: 'green',
    dx:0,
});

var loop = kontra.gameLoop({
    update: function(){
        knight.update();
        obstacle.update();

        //jumping start
        const gravity = 0.3;

        //make knight fall
        knight.dy += gravity

        //if on (or below) ground, go to ground
        if (knight.y >= ground){
            knight.y = ground
        }

        //if on ground, make knight jump up
        if (kontra.keys.pressed("up") || kontra.keys.pressed("space")){
            if (knight.y >= ground){
                knight.dy = -5;
            }
        }
        //jumping end

        if (obstacle.x <= -256){
            obstacle.x = Math.floor(Math.random() * 768) + 256;
        }
    },
    render: function() {
        knight.render();
        obstacle.render();
    }
})


loop.start();