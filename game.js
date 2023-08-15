kontra.init();

var obstacle = kontra.sprite({
    x: 256,
    y: 231,
    width: 25,
    height: 25,
    color: 'blue',
    dx:-5,
});

var knight = kontra.sprite({
    x: 50,
    y: 206,
    width: 25,
    height: 50,
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
        if (knight.y >= 206){
            knight.y = 206
        }

        //if on ground, make knight jump up
        if (kontra.keys.pressed("up")){
            if (knight.y >= 206){
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