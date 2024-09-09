

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
    // Add more key-value pairs of URLs here as needed
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

function SpawnArrow(type) {
    type = Object.keys(ArrowObjects)[type]
    const newArrow = document.createElement("img")
    console.log(type)
    newArrow.src = "Assets/Notes/note" + capitalizeFirstLetter(type.toLowerCase()) + "0.png"
    newArrow.classList.add(type, "Arrow")
    newArrow.style.top = `${100}%`;
    newArrow.id = type + "Arrow" + Index
    ArrowObjects[type].push(newArrow.id)
    document.getElementById("Arrows").appendChild(newArrow)
    Index += 1
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
                ArrowObj.style.top = `${ArrowY - document.getElementById("speed").value}%`;
                if (ArrowY <= -50) {
                    ArrowObj.remove();
                    ArrowObjects[key].splice(A, 1);
                    misses +=1
                    document.getElementById("Misses").innerHTML = "Misses: " + misses
                }
            }
        }        

        if (value == 2) {
            document.getElementById(key).src = "Assets/Arrows/Resized/press" + capitalizeFirstLetter(key.toLowerCase()) + "3.png"
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

setInterval(() => {
    // Your code here
    RenderArrows()

    // if (i >= 20) {
    //     SpawnArrow(Math.floor(Math.random() * 4))
    //     i = 0
    // }

    // if (i == 100) {
    //     SpawnArrow(0)
    // } else if (i == 115) {
    //     SpawnArrow(1)
    // } else if (i == 125) {
    //     SpawnArrow(2)
    // } else if (i == 135) {
    //     SpawnArrow(3)
    //     i = 0
    // }
    i+=1
}, 10); // 100 milliseconds = 0.1 seconds

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

async function LoadChart(Chart) {
    Chart = Charts[Chart]["song"]
    let x = 0
    for (const section of Chart["notes"]) {
        let y = 0
        for (let note of section["sectionNotes"]) {
            console.log(y);  // Process the note here
            SpawnArrow(note[1])
            // Example: wait for 500 milliseconds before moving to the next note
            let deleyLenth = 0
            if (y != 0) {
                if (section["sectionNotes"].length - 1 == y) {
                    deleyLenth = Chart["notes"][x+1]["sectionNotes"][0][0] - note[0]
                } else {
                    deleyLenth = section["sectionNotes"][y+1][0] - note[0]
                }
            }
            await delay(deleyLenth);
            y+=1
        }
        x += 1
    }
}