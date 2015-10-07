# Breakout-on-HTML5-Canvas

A ball, a paddle, and some bricks! Everyone love Breakout!

Super basic HTML page that relies on jQuery (included) and a js file to operate the Canvas.

All the magic happens in canvas.js

There is a function called makeBricks() that creates the layout for the bricks of the game. This is the function you can modify to make new levels of the game.

10/6/2015:
--I've added logic so ball can tell if it hits the top/bottom or sides of a brick. The resulting bounce is now correct!
--I've made the ball start with paddle location. Click to launch.
--The ball can have varying x-velocity based on the location it hits on the paddle. (Needs work)
