//game
let app;
let player;
let playerSpeed = 5;
let enemy;
let enemies = [];
let highscore = 1;
let powerup;
let powerupSpawn = false;
let powerupPicked = false;
let powerInterval;

//move
let keys = {};
let keysDiv;

//screens
let screen = 0;
let titleScreen;
let mainScreen;
let endScreen;

//bullets
let bullets = [];
let bulletSpeed = 10;


window.onload = () => {
    app = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0xAAAAAA
    });
    
    document.body.appendChild(app.view);
    
    
    // create the screens
    window.addEventListener("mousedown", newGame)
    
    titleScreen = new PIXI.Container();
    mainScreen = new PIXI.Container();
    endScreen = new PIXI.Container();
    
    mainScreen.visible = false;
    endScreen.visible = false;
    
    app.stage.addChild(titleScreen);
    app.stage.addChild(mainScreen);
    app.stage.addChild(endScreen);
    
    // generate texts
    let text1 = new PIXI.Text("Kill the red");
    text1.anchor.set(0.5);
    text1.x = app.view.width / 2;
    text1.y = app.view.height / 2 - 50;
    text1.style = new PIXI.TextStyle({
        fill: 0xff2121,
        fontSize: 70,
        fontFamily: "Arial",
        fontStyle: "bold"
    })
    titleScreen.addChild(text1);

    let text2 = new PIXI.Text(" Move: (W A S D)");
    text2.anchor.set(0.5);
    text2.x = app.view.width / 2;
    text2.y = app.view.height / 2 + 50;
    text2.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 20,
        fontFamily: "Arial",
        fontStyle: "bold"
    })
    titleScreen.addChild(text2);
    
    let text3 = new PIXI.Text(" Shoot: (space)");
    text3.anchor.set(0.5);
    text3.x = app.view.width / 2;
    text3.y = app.view.height / 2 + 80;
    text3.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 20,
        fontFamily: "Arial",
        fontStyle: "bold"
    })
    titleScreen.addChild(text3);

    let text4 = new PIXI.Text("Click to start");
    text4.anchor.set(0.5);
    text4.x = app.view.width / 2;
    text4.y = app.view.height / 2 + 150;
    text4.style = new PIXI.TextStyle({
        fill: 0x2121ff,
        fontSize: 20,
        fontFamily: "Arial",
        fontStyle: "bold"
    })
    titleScreen.addChild(text4);

    let gameOverText = new PIXI.Text("Game Over");
    gameOverText.anchor.set(0.5);
    gameOverText.x = app.view.width / 2;
    gameOverText.y = app.view.height / 2 - 50;
    gameOverText.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 70,
        fontFamily: "Arial",
        fontStyle: "bold"
    })
    endScreen.addChild(gameOverText);

    let gameOverText2 = new PIXI.Text("Click to play again");
    gameOverText2.anchor.set(0.5);
    gameOverText2.x = app.view.width / 2;
    gameOverText2.y = app.view.height / 2 + 30;
    gameOverText2.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 30,
        fontFamily: "Arial",
        fontStyle: "bold"
    })
    endScreen.addChild(gameOverText2);

    // create the player
    
    player = new PIXI.Sprite.from("img/player.png");
    player.anchor.set(0.5);
    player.x = app.view.width / 2;
    player.y = app.view.height - 100;

    mainScreen.addChild(player);

    //create the powerup

    powerup = new PIXI.Sprite.from('img/powerup.png');
    powerup.anchor.set(0.5);

    // keyboard events
    
    document.addEventListener('keydown', e => {
        keys[e.keyCode] = true;
    })
    
    document.addEventListener('keyup', e => {
        keys[e.keyCode] = false;
    
        // shoot 
        if (e.keyCode === 32) {
            fireBullet();
        }
    })

    app.ticker.add(gameLoop);
}

const gameLoop = () => {
    updateBullets();
    updateEnemies();
    checkEnemies();
    checkHit();
    pickPowerUp();
    // move
    if (keys["87"]) {
        if (player.y > 15) {
            player.y -= playerSpeed;
        }
    }
    if (keys["83"]) {
        if (app.view.height - player.y > 15) {
            player.y += playerSpeed;
        }
    }
    if (keys["68"]) {
        if (app.view.width - player.x > 15) {
            player.x += playerSpeed;
        }
    }
    if (keys["65"]) {
        if (player.x > 15) {
            player.x -= playerSpeed;
        }
    }
}

const pickPowerUp = () => {
    if (powerupSpawn && intersect(player, powerup)) {
        clearInterval(powerInterval);
        mainScreen.removeChild(powerup);
        powerupPicked = true;
        powerupSpawn = false;
        powerInterval = setInterval(() => {
            powerupPicked = false;
        }, 5000)
    }
}

const fireBullet = () => {
    if (powerupPicked) {
        createPoweredBullet();
    } else {
        createBullet();
    }
}

const createBullet = () => {
    let bullet = new PIXI.Sprite.from("img/bullet.png");
    bullet.anchor.set(0.5);
    bullet.x = player.x;
    bullet.y = player.y;
    bullet.speed = bulletSpeed;
    bullet.direction = 1;
    mainScreen.addChild(bullet);
    bullets.push(bullet);
}

const createPoweredBullet = async () => {
    for (let i = 0; i < 3; i ++) {
        let bullet = new PIXI.Sprite.from("img/bullet.png");
        bullet.anchor.set(0.5);
        bullet.x = player.x;
        bullet.y = player.y;
        bullet.speed = bulletSpeed;
        
        bullet.direction = i;
        mainScreen.addChild(bullet);
        bullets.push(bullet);
    }
}

const updateBullets = () => {
    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].direction === 0) {
            bullets[i].position.y -= bullets[i].speed;
            bullets[i].position.x -= 1;
        } else if (bullets[i].direction === 1) {
            bullets[i].position.y -= bullets[i].speed;
        } else if (bullets[i].direction === 2) {
            bullets[i].position.y -= bullets[i].speed;
            bullets[i].position.x += 1;
        }

        if (bullets[i].position.y < -100 || bullets[i].position.x < -100 || bullets[i].position.x > 900) {
            mainScreen.removeChild(bullets[i]);
            bullets.splice(i, 1);
        } else {
            for (let e = 0; e < enemies.length; e++) {                
                if (intersect(bullets[i], enemies[e])) {
                    mainScreen.removeChild(enemies[e]);
                    enemies.splice(e, 1);
                    mainScreen.removeChild(bullets[i]);
                    bullets.splice(i, 1);
                    if (playerSpeed <= 9) {
                        playerSpeed += 1;
                        console.log(playerSpeed);
                    }
                }
            }
        }
    }
}

const checkHit = () => {
    for (let e = 0; e < enemies.length; e++) {                
        if (intersect(player, enemies[e])) {
            gameOver();
        }
    }
}

const gameOver = () => {
    if (screen > highscore) {
        highscore = screen;
        document.getElementById("hs").innerHTML = highscore;
    }

    mainScreen.visible = false;
    endScreen.visible = true;

    for (let i = 0; i < enemies.length; i++) {
        mainScreen.removeChild(enemies[i]);
        enemies.splice(i, 1);
    }

    screen = 1;
    player.x = app.view.width / 2;
    player.y = app.view.height - 100;
    powerupPicked = false;
    powerupSpawn = false;
    mainScreen.removeChild(powerup);

    window.addEventListener("mousedown", newGame);
}

const updateEnemies = () => {
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].position.y < app.view.height) {
            enemies[i].position.y += enemies[i].speed;
        } else {
            enemies[i].position.y = 0;
            if (playerSpeed > 5) {
                playerSpeed -= 1;
                console.log(playerSpeed);
            }
        }
    }
}

const intersect = (a, b) => {
    if (a && b) {
        let aBox = a.getBounds();
        let bBox = b.getBounds();
        
        return aBox.x + aBox.width > bBox.x && 
                aBox.y + aBox.height > bBox.y &&
                aBox.x < bBox.x + bBox.width &&
                aBox.y < bBox.y + bBox.height;
    } else {
        return false;
    }
}           

const checkEnemies = () => {
    if (enemies.length === 0 && screen > 0) {
        nextScreen();
    }
}

const addEnemy = (x, y, speed) => {
    enemy = new PIXI.Sprite.from("img/enemy.png");
    enemy.anchor.set(0.5);
    enemy.x = x;
    enemy.y = y;
    enemy.speed = speed;

    mainScreen.addChild(enemy);
    enemies.push(enemy);
}

const replaceEnemies = (screen) => {
    for (let i = 0; i < screen; i++) {
        addEnemy(Math.floor(Math.random() * (770 - 30)) + 30, 30, Math.floor(Math.random() * (5 - 1 + 1)) + 1) ;
    }
}

const newGame = () => {
    document.getElementById("screen").innerHTML = "1";
    screen = 1;
    titleScreen.visible = false;
    mainScreen.visible = true;
    endScreen.visible = false;
    addEnemy(Math.floor(Math.random() * (800)), 30, 2);
    window.removeEventListener("mousedown", newGame);
}

const nextScreen = () => {
    screen += 1;
    document.getElementById("screen").innerHTML = screen;
    replaceEnemies(screen);
    if (!powerupSpawn && screen % 3 === 0) {
        powerup.x = Math.floor(Math.random() * 790 - 10) + 10;
        powerup.y = Math.floor(Math.random() * 580 - 20) + 20;
        mainScreen.addChild(powerup);
        powerupSpawn = true;
    }
}