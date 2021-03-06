const score = document.querySelector('.score'),
 start = document.querySelector('.start'),
 gameArea = document.querySelector('.gameArea'),
 car = document.createElement('div'),
 easyMode = document.querySelector('.easy'),
 mediumMode = document.querySelector('.medium'),
 hardMode = document.querySelector('.hard'),
 sound = document.createElement('audio');

car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

easyMode.addEventListener('click',function(){
    setting.speed = 5;
    setting.traffic = 3;
});
mediumMode.addEventListener('click',function(){
    setting.speed = 6;
    setting.traffic = 2.5;

});
hardMode.addEventListener('click',function(){
    setting.speed = 7;
    setting.traffic = 2.3;
});

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score:  0,
    speed: 3,
    traffic: 1
};

function getQuantityElements(heightElement){
    return document.documentElement.clientHeight / heightElement + 1;
}

console.log();

function startGame(){
    gameArea.classList.remove('hide');
    start.classList.add('hide');
    gameArea.innerHTML = '';
    car.style.left = '125px';
    car.style.bottom = '10px';
    car.style.top = 'auto';

    for(let i = 0; i < getQuantityElements(100); i++){
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    loadEnemies();
    
    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = '125px';
    car.style.bottom = '10px';
    car.style.top = 'auto';
    sound.setAttribute('autoplay', true);
    sound.setAttribute('src', "./src/08 - Devil Lurks on the Road.mp3");
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame(){
    
    if(setting.start){
        setting.score += setting.speed - 3;
        score.innerHTML = 'SCORE<br>' + setting.score;
        moveRoad();
        moveEnemy();

        if(keys.ArrowLeft && setting.x > 0){
            setting.x -= setting.speed;
        }

        if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
            setting.x += setting.speed;
        }

        if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
            setting.y += setting.speed;
        }

        if(keys.ArrowUp && setting.y > 0){
            setting.y -= setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';


        requestAnimationFrame(playGame);
    }
    
}

function startRun(event){
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event){
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad(){
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if(line.y >= document.documentElement.clientHeight){
            line.y = -100;
        }
    })
}

function moveEnemy(){

    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(function(enemy){

        let carRect = car.getBoundingClientRect();
        let enemyRect = enemy.getBoundingClientRect();

        if(carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top){
                sound.pause();
                setting.start = false;

                let topScore = localStorage.getItem('topScore');
                if (topScore < setting.score) {
                    localStorage.setItem('topScore', setting.score);
                    score.innerHTML = `
                    Score<br>${setting.score}<br>
                    Congratulations!<br>
                    You set a new best score: ${setting.score}`;
                } else {
                    score.innerHTML = `Score<br>${setting.score}<br>
                    Best score: ${topScore}`;
                }

                start.classList.remove('hide');
                start.style.top = score.offsetHeight;
            }

        enemy.y += setting.speed / 2;
        enemy.style.top = enemy.y + 'px';

        if(enemy.y >= document.documentElement.clientHeight){
            enemy.y = -140 * setting.traffic;
            enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}

function loadEnemies(){

    for(let i = 0; i < getQuantityElements(100 * setting.traffic); i++ ){
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * i + 1;
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = "transparent url('./image/enemy.png') center / cover no-repeat";
        gameArea.appendChild(enemy);

    }

}