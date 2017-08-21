function Gameloop(update, draw) {
    var self = this;


    var limit = 300,
    lastFrameTimeMs = 0,
    maxFPS = 60,
    delta = 0,
    timestep = 1000 / 60,
    fps = 60,
    framesThisSecond = 0,
    lastFpsUpdate = 0,
    running = false,
    started = false,
    frameID = 0;
    // function update(delta) {
    //     boxLastPos = boxPos;
    //     boxPos += boxVelocity * delta;
    //     // Switch directions if we go too far
    //     if (boxPos >= limit || boxPos <= 0) boxVelocity = -boxVelocity;
    // }

    // function draw(interp) {
    //     box.style.left = (boxLastPos + (boxPos - boxLastPos) * interp) + 'px';
    //     fpsDisplay.textContent = Math.round(fps) + ' FPS';
    // }



    function panic() {
        delta = 0;
    }

    // function begin() {
    // }

    // function end(fps) {
    //     if (fps < 25) {
    //         box.style.backgroundColor = 'black';
    //     }
    //     else if (fps > 30) {
    //         box.style.backgroundColor = 'red';
    //     }
    // }

    self.stop = function() {
        running = false;
        started = false;
        cancelAnimationFrame(frameID);
    }

    self.start = function() {
        if (!started) {
            started = true;
            frameID = requestAnimationFrame(function (timestamp) {
                draw(1);
                running = true;
                lastFrameTimeMs = timestamp;
                lastFpsUpdate = timestamp;
                framesThisSecond = 0;
                frameID = requestAnimationFrame(mainLoop);
            });
        }
    }

    function mainLoop(timestamp) {
        // Throttle the frame rate.    
        if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
            frameID = requestAnimationFrame(mainLoop);
            return;
        }
        delta += timestamp - lastFrameTimeMs;
        lastFrameTimeMs = timestamp;

        //begin(timestamp, delta);

        if (timestamp > lastFpsUpdate + 1000) {
            fps = 0.25 * framesThisSecond + 0.75 * fps;

            lastFpsUpdate = timestamp;
            framesThisSecond = 0;
        }
        framesThisSecond++;

        var numUpdateSteps = 0;
        while (delta >= timestep) {
            update(timestep);
            delta -= timestep;
            if (++numUpdateSteps >= 240) {
                panic();
                break;
            }
        }

        draw(delta / timestep);

        frameID = requestAnimationFrame(mainLoop);
    }
}