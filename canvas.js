//global vars so any function can use
var canvas = null;
var context = null;
var ballx = 300;
var bally = 275;
var ballr = 5;
var movex = 2;
var movey = 2;
var mousex = null;
var paddlewidth = 80;
var paddleleft = null;
var winner = null;

function init() {
    //create Canvas context
    canvas = document.getElementById('canvas1');
    context = canvas.getContext("2d");

    //May be more fun using document instead of #canvas1
    //jQuery Mouse movement to set paddle location
    $(document).mousemove(function () {
            mousex = event.pageX;
    })

    //Create bricks array
    makeBricks();

    //Start animation. Note: it's saved in variable so we can
    //clear interval when play wins.
    winner = setInterval(play, 10)

    //This code is used to click to stop animation to examine code
    //$(document).click(function(){
    //      clearInterval(winner);
    //})
}
 
//Athe animating function
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
    context.fillRect(paddleleft, canvas.height - 50, paddlewidth, 10)

    //Move the ball!
    ballx = ballx + movex;
    bally = bally + movey;

    //go through bricks array and see if the new ball location hits a brick.
    checkBricks();

    //Check if ball location is hitting the paddle.
    if (ballx - ballr >= paddleleft-37 && ballx + ballr <= (paddleleft + paddlewidth)) {
        if (bally + ballr >= (canvas.height - 50)) {
            if (movey > 0) { movey = movey * -1; }
            //console.log("ballx " + (ballx - ballr) + "-" + (ballx + ballr) + "  ballybottom  " + (bally + ballr));
            //console.log("paddle " + String(paddleleft) + "-" + String(paddleleft + paddlewidth) + " PaddleTop " + String(canvas.height - 50));
        }
    }

    //Keep the ball in the play area(canvas).
    if (bally + ballr >= canvas.height || bally - ballr <= 0) {
        movey = movey * -1;
    }
    if (ballx+ballr >= canvas.width || ballx-ballr <= 0) {
        movex = movex * -1;
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
    for (k = 0; k < 18; k++) {
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
        console.log("YOU WON BABY!!!")
    }
    
    //For each brick, check the ball location vs. the brick location. Update brick hit counter if true.
    for (var b = 0; b < bricks.length; b++) {
        if (ballx + ballr >= bricks[b][0] && ballx - ballr <= bricks[b][0] + brickw && bally - ballr <= bricks[b][1] + brickh && bally + ballr >= bricks[b][1]) {
            bricks[b][2] = bricks[b][2] + 1;
            movey = movey * -1;
        }
    }
}