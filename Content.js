

// Key handler



let Arrows = {
    "LEFT": {"ArrowLeft": false, "a": false, "z": false},
    "DOWN": {"ArrowDown": false, "s": false, "x": false},
    "UP": {"ArrowUp": false, "w": false, ",": false},
    "RIGHT": {"ArrowRight": false, "d": false, ".": false}
};

let ArrowObjects = {
    "LEFT": [],
    "DOWN": [],
    "UP": [],
    "RIGHT": []
}

const urls = {
    "kiosk": "https://raw.githubusercontent.com/JayDaMan53/FNF-HTML/main/Charts/Kiosk/kiosk.json?",
    "indigo": "https://raw.githubusercontent.com/JayDaMan53/FNF-HTML/main/Charts/Indigo/indigo.json",
    "guest": "https://raw.githubusercontent.com/JayDaMan53/FNF-HTML/main/Charts/Guest/guest.json",
    "yourself": "https://raw.githubusercontent.com/JayDaMan53/FNF-HTML/main/Charts/yourself/silly-billy.json"
};

let Anim = {"LEFT": false, "UP": false, "DOWN": false, "RIGHT": false}

document.onkeydown = function (e) {
    e = e || window.Event;
    for (const [key, value] of Object.entries(Arrows)) {
        for (const [Akey, Avalue] of Object.entries(value)) {
            if (Akey === e.key && Arrows[key][Akey] == false) {
                Arrows[key][Akey] = true;
            }
        }
    }
};

document.onkeyup = function (e) {
    e = e || window.Event;
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
            if (Anim[key] == true && Avalue == 2) {
                Down[key] = 4
            } else {
                if (Avalue == true) {
                    Down[key] = true
                    Arrows[key][Akey] = 2;
                } else if (Avalue == 2) {
                    Down[key] = 2
                }
            }
            
        }
    }
    return Down
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let Index = 1

function SpawnArrow(type, strum) {
    console.log(type)
    type = Object.keys(ArrowObjects)[type]
    const newArrow = document.createElement("img")
    newArrow.src = "Assets/Notes/note" + capitalizeFirstLetter(type.toLowerCase()) + "0.png"
    newArrow.classList.add(type, "Arrow")
    newArrow.style.top = `${100}%`;
    newArrow.style.zIndex = 2
    newArrow.id = type + "Arrow" + Index
    newsturm.IsAStrum = false
    ArrowObjects[type].push(newArrow.id)
    document.getElementById("Arrows").appendChild(newArrow)

    Index += 1

    if (strum > 0) {
        let times = Math.round(strum/60)
        for (let i = 0; i < times; i++) {
            const newsturm = document.createElement("img")
            newsturm.src = `Assets/Arrows/${type.toLowerCase()} hold piece instance 0.png`
            newsturm.classList.add(type, "Arrow")
            newsturm.style.top = `${105 + ((i+1) * 4)}%`;
            newsturm.id = type + "Arrow" + Index
            newsturm.IsAStrum = true
            ArrowObjects[type].push(newsturm.id)
            document.getElementById("Arrows").appendChild(newsturm)
            Index += 1
        }
        let newsturm = document.createElement("img")
        newsturm.src = `Assets/Arrows/${type.toLowerCase()} hold end instance 0.png`
        newsturm.classList.add(type, "Arrow")
        newsturm.style.top = `${105 + ((times+1) * 4)}%`;
        newsturm.id = type + "Arrow" + Index
        newsturm.IsAStrum = true
        ArrowObjects[type].push(newsturm.id)
        document.getElementById("Arrows").appendChild(newsturm)
    }    
}

let hits = 0
let misses = 0

function RenderArrows() {
    PressesArrows = GetArrowsPressed()
    for (let [key, value] of Object.entries(PressesArrows)) {
        for (let A = ArrowObjects[key].length - 1; A >= 0; A--) {
            let Arrow = ArrowObjects[key][A];
            //console.log(Arrow) // This will only print once per arrow
            let ArrowObj = document.getElementById(Arrow);
            if (!ArrowObj) {
                continue;
            }
            let ArrowY = ArrowObj.style.top;
            ArrowY = Number(ArrowY.replace("%", ""));
            
            if (ArrowY > -10 && ArrowY < 10 && value == true) {
                console.log(ArrowY);
                ArrowObj.remove();
                ArrowObjects[key].splice(A, 1);
                value = 3
                hits += 1
                document.getElementById("Hits").innerHTML = "Hits: " + hits
            } else {
                ArrowObj.style.top = `${ArrowY - (document.getElementById("speed").value * 1.6)}%`;
                if (ArrowY <= -50) {
                    ArrowObj.remove();
                    ArrowObjects[key].splice(A, 1);
                    misses +=1
                    document.getElementById("Misses").innerHTML = "Misses: " + misses
                }
            }
        }        

        if (value == 2) {
            document.getElementById(key).src = "Assets/Arrows/press" + capitalizeFirstLetter(key.toLowerCase()) + "3.png"
        } else if (value == 3) {
            Anim[key] = true
            document.getElementById(key).src = "Assets/Arrows/confirm" + capitalizeFirstLetter(key.toLowerCase()) + "0.png"
        } else if (value == 4) {
            document.getElementById(key).src = "Assets/Arrows/confirmHold" + capitalizeFirstLetter(key.toLowerCase()) + "0.png"
        } else if (value == false) {
            Anim[key] = false
            document.getElementById(key).src = "Assets/Arrows/static" + capitalizeFirstLetter(key.toLowerCase()) + "0.png"
        }
    }
}

let i = 0

let lastTime = 0;
function update(timestamp) {
    const delta = timestamp - lastTime;
    
    if (delta > 16) {  // Roughly 60fps, so run this code every ~16ms
        RenderArrows();  // Call the function to render arrows
        lastTime = timestamp;
    }

    requestAnimationFrame(update);
}

requestAnimationFrame(update);

// Chart Data

const Charts = {};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchJsonData = async () => {
    for (const [key, url] of Object.entries(urls)) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Network response was not ok for ${key}: ` + response.statusText);
        }
        const data = await response.json();
        Charts[key] = data;  // Store JSON in dictionary with the key
      } catch (error) {
        console.error(`There has been a problem with fetching the ${key} URL:`, error);
      }
    }
};
fetchJsonData();

console.log(Charts);  // The dict with all the JSON data

let Inst = null
let Voices = null

// document.addEventListener('visibilitychange', function() {
//     if (document.hidden) {
//         if (Inst && Voices) {
//             Voices.pause()
//             Inst.pause()
//         }
//         // You can pause media, stop actions, etc.
//     } else {
//         if (Inst && Voices) {
//             Voices.play()
//             Inst.play()
//         }
//         // Resume actions if needed
//     }
// });

async function LoadChart(Chartstr) {
    let Chart = Charts[Chartstr]["song"];
    let startTime = performance.now();  // Record the start time of the chart processing
    let x = 0;

    Inst = new Audio(`Charts/${Chartstr.toLowerCase()}/Inst.ogg`);
    Voices = new Audio(`Charts/${Chartstr.toLowerCase()}/Voices.ogg`);
    Inst.addEventListener("ended", () => {
        Inst.pause()
        Voices.pause()
        Inst = null
        Voices = null
    })

    // Play the sound after the delay
    setTimeout(() => {
        Inst.volume = .1
        Voices.volume = .1
        Inst.play();
        Voices.play();
    }, 500);  // Delay in milliseconds

    for (let section of Chart["notes"]) {
        section["sectionNotes"].sort((a, b) => a[0] - b[0]);
        for (let y = 0; y < section["sectionNotes"].length; y++) {
            console.log(y)
            console.log(section["sectionNotes"][y])
            let note = section["sectionNotes"][y];
            let notetype = note[1];

            // Calculate the absolute time (in milliseconds) when this note should appear
            let noteTime = note[0];  // Assuming note[0] is the time in milliseconds

            // Check if mustHitSection condition applies
            if (section["mustHitSection"] && notetype > 3) {
                console.log(`Skipping note with type ${notetype} because mustHitSection is true`);
                continue;
            } else if (!section["mustHitSection"] && notetype < 4) {
                console.log(`Skipping note with type ${notetype} because mustHitSection is false`);
                continue;
            }

            // Get the current time in the chart playback
            let currentTime = performance.now() - startTime;

            // Calculate how long to wait before spawning this note
            let waitTime = noteTime - currentTime;
            console.log(waitTime)
            if (waitTime > 0) {
                // Wait until the note is supposed to appear
                await delay(waitTime);
            }

            // Valid note, spawn arrow
            SpawnArrow(notetype - (4 * !section["mustHitSection"]));
        }
        x += 1;
    }
}