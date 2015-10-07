//global vars so any function can use
var canvas = null;
var context = null;
var ballx = null;
var bally = null;
var ballr = 5;
var movex = null;
var movey = null;
var mousex = null;
var paddlewidth = 80; //Smaller = harder, larger = easier.
var paddleh = 10; 
var bottomoffset = 50; //Paddle's distance from bottom of canvas.
var paddleleft = null;
var winner = null;


function init() {
    //create Canvas context
    canvas = document.getElementById('canvas1');
    context = canvas.getContext("2d");

    //jQuery Mouse movement to set paddle location
    $(document).mousemove(function () {
            mousex = event.pageX;
    })

    //Create bricks array NOTE: make new levels by 
    //altering the makeBricks() function! Easy!
    makeBricks();

    //Start animation. Note: it's saved in variable so we can
    //clear interval when player wins.
    //Changing inverval will change speed of game.
    winner = setInterval(play, 10);

    //If ball is not moving, a click will start ball motion.
    $(document).click(function()
    {
        if (movex == null)
        {
            movex = 3;
            movey = -3;
        }
    })
}
 
//The animating function
function play() {

    //erase everything on canvas
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //Draw paddle based on mouse location.
    context.fillStyle = "#000000";
    paddleleft = mousex - paddlewidth / 2;
    //Don't let paddle go out of canvas area:
    if (paddleleft < 0) {
        paddleleft = 0
    } else if (paddleleft + paddlewidth > canvas.width) {
        paddleleft = canvas.width - paddlewidth;
    }
    context.fillRect(paddleleft, canvas.height - bottomoffset, paddlewidth, paddleh)

    //If ball not moving, draw at paddle
    //Otherwise, Move the ball!
    if (movex == null && movey == null) {
        ballx = paddleleft+paddlewidth/2;
        bally = canvas.height - bottomoffset - ballr;
    } else {
        ballx = ballx + movex;
        bally = bally + movey;
    }
    //go through bricks array and see if the new ball location hits a brick.
    checkBricks();

    //Check if ball location is hitting the paddle.
    if ((ballx - ballr) >= paddleleft && (ballx + ballr) <= (paddleleft + paddlewidth)) {
        if (bally + ballr >= (canvas.height - bottomoffset) && bally-ballr <= (canvas.height-bottomoffset+paddleh)) {
            if (movey > 0) {

                //Get how far paddle intersection is from center of paddle. Adjust ball speed
                //if ball hits near center or near edges of paddle.
                var padhit = paddleleft + paddlewidth / 2 - ballx;
                movey = movey * -1;
                var sign = 1;
                if (movex < 0) {sign = -1}
                if (Math.abs(padhit) >30) {
                    movex = (Math.abs(movex) + 1) * sign;
                    console.log(">30");
                }else if(padhit< 10){
                    movex = 2 * sign;
                    console.log("<6");
                }else{
                    movex = movex * sign;
                    console.log("default");
                }

                console.log("offcenter ", Math.abs(padhit), " units; movex = ",movex)
            }

        }
    }

    //Keep the ball in the play area(canvas).
    if (bally - ballr <= 0) {
        movey = movey * -1;
    }
    if (ballx+ballr >= canvas.width || ballx-ballr <= 0) {
        movex = movex * -1;
    }

    //Ball went off bottom of screen. Reset ball to paddle.
    if (bally >= canvas.height) {
        movex = null;
        movey = null;
    }

    //Draw the ball!
    context.fillStyle = "blue";
    context.lineWidth = 1;
    context.beginPath();
    context.arc(ballx, bally, ballr, Math.PI * 2, false);
    context.fill();
    context.stroke();

    //Draw the bricks!
    drawBricks();
}


var bricks = [];
var brickw = 100;
var brickh = 35;

//Number of colors is number of times brick must be hit to disappear.
var brickColors = ["orange", "blue", "green"];

//Make Bricks is where you design layout. It can really be any design.
//We're really just making the bricks array. They're drawn later. 
//A brick is [x-position, y-position, #times it's been hit]. Example: [150, 50, 0]
function makeBricks() {
    var start = canvas.width / 2 - 2 * brickw;
    var x = start;
    var y = 100;
    var row = 0;
    var col = 0
    for (k = 0; k < 22; k++) {
        bricks.push([x, y, 0]); //add to bricks array here!
        col++;
        x = x + brickw;
        if (row % 2 == 0 && col == 4) {
            row++;
            col = 0;
            x = start-50;
            y = y + brickh;
        } else if ( row % 2 == 1 & col == 5){
            row++;
            col = 0;
            x = start;
            y = y + brickh;
        }
    }
}

//Draw a brick for each brick in brick array, using color key brickColors
function drawBricks() {
    for (var i=0; i < bricks.length; i++) {
        context.fillStyle = brickColors[bricks[i][2]];
        context.strokeStyle = "black";
        context.fillRect(bricks[i][0], [bricks[i][1]], brickw, brickh);
        context.strokeRect(bricks[i][0], [bricks[i][1]], brickw, brickh);
    }
}

function checkBricks() {

    //Remove any bricks that have been hit the needed number of times.
    var updatedBricks = []
    for (var c = 0; c < bricks.length; c++) {
        if (bricks[c][2] < brickColors.length) {
            updatedBricks.push(bricks[c])
        }
    }
    bricks = updatedBricks;

    //If all bricks have been hit, then array is empty. Winner!
    if (bricks.length == 0) {
        clearInterval(winner);
        console.log("You're suffering a brick deficiency...because you won!!!")
    }
    
    //For each brick, check the ball location vs. the brick location. Update brick hit counter if true.
    for (var b = 0; b < bricks.length; b++) {
        if (ballx + ballr >= bricks[b][0] && ballx - ballr <= bricks[b][0] + brickw && bally - ballr <= bricks[b][1] + brickh && bally + ballr >= bricks[b][1]) {
            bricks[b][2] = bricks[b][2] + 1;

            //sidehit & tophit check the balls previous location to see if was inside of brick.
            //if the ball was outside the x location of a brick and is now intersecting, then it hit from side.
            //if the ball was outside the y location of a brick and is now intersecting, thn it hit top/bottom.
            sidehit = (ballx-movex +ballr < bricks[b][0]) || (ballx-movex-ballr >bricks[b][0]+brickw);
            tophit = (bally - movey - ballr > bricks[b][1] + brickh) || (bally - movey + ballr < bricks[b][1]);

            //ball hit on top or bottom, change ball's y direction.
            if (tophit) { movey = movey * -1 };

            //bill hit on side, change ball's x direction.
            if (sidehit) { movex = movex * -1 }; 
        }
    }
}