

// Key handler

let Arrows = {
    "LEFT": {"ArrowLeft": false, "a": false, "z": false},
    "UP": {"ArrowUp": false, "w": false, "x": false},
    "DOWN": {"ArrowDown": false, "s": false, ",": false},
    "RIGHT": {"ArrowRight": false, "d": false, ".": false}
};

document.onkeydown = function (e) {
    
    e = e || window.Event;
    console.log(e.key, " A");

    for (const [key, value] of Object.entries(Arrows)) {
        for (const [Akey, Avalue] of Object.entries(value)) {
            if (Akey === e.key && Arrows[key][Akey] == false) {
                console.log(Arrows[key][Akey] == false, Arrows[key][Akey])
                Arrows[key][Akey] = true;
            }
        }
    }
};

document.onkeyup = function (e) {
    e = e || window.Event;
    console.log(e.key, " B");
    for (const [key, value] of Object.entries(Arrows)) {
        for (const [Akey, Avalue] of Object.entries(value)) {
            if (Akey === e.key) {
                Arrows[key][Akey] = false;
            }
        }
    }
};

function GetArrowsPressed() {
    let Down = {"LEFT": false, "UP": false, "DOWN": false, "RIGHT": false}
    for (const [key, value] of Object.entries(Arrows)) {
        for (const [Akey, Avalue] of Object.entries(value)) {
            if (Avalue == true) {
                Down[key] = true
                Arrows[key][Akey] = 0;
            }
        }
    }
    console.log(Arrows)
    return Down
};

setInterval(() => {
    // Your code here
    console.log(GetArrowsPressed())
}, 100); // 100 milliseconds = 0.1 seconds
