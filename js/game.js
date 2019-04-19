//core functions, rules, animation

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setTimeout(function () {

                callback(+performance.now());
            }, 1000 / 150); //max fps but capped to screen refreshRate
        };
})();

var currentFrame = 0;
var lastRun;//performance.now();
var game_running = true;

function animate() {
    if (!lastRun) {
        lastRun = performance.now();
        requestAnimFrame(animate);
        return;
    }
    var delta = (performance.now() - lastRun) / 1000;
    lastRun = performance.now();
    var FPS = Math.round(1 / delta);
    //drawCanvas()
    if (game_running) {
        requestAnimFrame(animate);
    } else {
        FPS = 0;
    }
    game();
    document.getElementById("Frame").innerHTML = "Frame : " + currentFrame + "(" + FPS + "fps)";
    currentFrame++;
}
animate();

var lastCircle;
var speed = 1000;
var persoDisplay = []
var lastPeradd = 0  

function addperso(){
    const oe = personnages[Math.floor(Math.random() * personnages.length)];
        oe.x = Math.floor(Math.random() * (canvas.width - oe.width)) + 10;
        oe.y = Math.floor(Math.random() * (canvas.height - oe.height)) + 10;
        persoDisplay.push(oe)
}

function game() {
    if (!lastCircle) {
        lastCircle = performance.now();
    }
    
    

   

    currentTime = performance.now();

    if (currentTime - lastCircle > speed) {
        lastCircle = performance.now();
        
        playerAccuracy.miss += 1;
        playerStats.accuracyMiss += 1;
        playerStats.currentCombo = 0;
        computeAccuracy(playerAccuracy.hit, playerStats.accuracyMiss);
        nextCircle();
        updateLabels();

       
    }

}

function mouseClick(event) {
    const clientPos = {
        x: event.clientX,
        y: event.clientY
    };

    if (playerStats.totalClick - lastPeradd > 5){
        console.log('add')
        addperso();
        lastPeradd = playerStats.totalClick
        //personnages[Math.floor(Math.random() * personnages.length)].draw();
    }

    if (persoDisplay.length > 0){
        persoDisplay.map(perso => perso.draw())
    }

    var coords = "Client : x " + clientPos.x + ", y " + clientPos.y;
    document.getElementById("Mouse").innerHTML = coords;

    playerStats.totalClick += 1;
    playerStats.accuracyMiss += 1;

    let hitsCircle = isIntersect(clientPos, oeufs[currOeuf]);
    // document.getElementById("Intersect").innerHTML =
    //     "isIntersect : " + hitsCircle;

    if (hitsCircle) {
        playerAccuracy.hit += 1;
        playerStats.currentCombo += 1;
        if (playerStats.currentCombo > 1) {
            playerStats.score += 100 * playerStats.currentCombo;
        } else {
            playerStats.score += 100;
        }
        nextCircle(hitsCircle);
    } else {
        playerAccuracy.miss += 1;
        playerStats.currentCombo = 0;
        drawCombo(playerStats.currentCombo);
    }
    if (playerStats.currentCombo > playerStats.bestCombo) {
        playerStats.bestCombo = playerStats.currentCombo;
        document.getElementById("BestCombo").innerHTML =
            "Best Combo : x" + playerStats.bestCombo;
    }
    computeAccuracy(playerAccuracy.hit, playerStats.accuracyMiss);
    updateLabels();   
}
var currOeuf = 0;
function nextCircle(hitsCircle) {

    //circle.draw();
    if (oeufs){
        currOeuf = Math.floor(Math.random()* oeufs.length)
        oeufs[currOeuf].draw();
    }

    lastCircle = performance.now();
    playerStats.totalCircle += 1;
    updateLabels();
}

function isIntersect(point, circle) {
    return (

        (point.y > circle.y && point.y < circle.y + circle.height 
            && point.x > circle.x && point.x < circle.x + circle.width)
            
    );
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCombo(playerCombo){
    //Combo Indicator
    ctx.beginPath();

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = 60 + "px Arial";
    ctx.fillStyle = "rgba(255,255,255," + 0.8 + ")";
    ctx.fillText("x" + playerCombo, 45, canvas.height - 50);
    ctx.lineCap = "round";

    ctx.closePath();
}

function updateLabels() {
    document.getElementById("Score").innerHTML = "Score : " + playerStats.score;
    document.getElementById("CurrentCombo").innerHTML =
        "Combo : x" + playerStats.currentCombo;
    document.getElementById("HitMiss").innerHTML =
        "Hit/Miss : " + playerAccuracy.hit + " / " + playerAccuracy.miss;
    document.getElementById("TotalClick").innerHTML =
        "Total Click : " + playerStats.totalClick;
}

function input(event) {
    circle.draw();
    document.getElementById("Key").innerHTML = "Key Pressed : " + event.key;
}