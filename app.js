const grid = document.querySelector('.grid');
for (let i=0; i<200;i++){
    let newDiv = document.createElement('div');
    grid.appendChild(newDiv)
}

for (let i=0; i<10; i++){
    let newDiv = document.createElement('div');
    newDiv.classList.add('taken')
    grid.appendChild(newDiv)
}

const scoreBoard = [0, 0, 0, 0, 0,]

//Levels

document.addEventListener("DOMContentLoaded", ()=>{
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button')
    const resetBtn = document.querySelector("#reset-button")
    const width = 10;
    let nextRandom = 0;
    let nextColor = 0;
    let velocity = 500;
    let timerId;
    let movement = true;
    let score = 0;
    let colors = ["orange", "red", "brown", "salmon", "tomato"]

    function loadScores(){
        console.log(localStorage.getItem("score-"+0).split(","))
        for (let i=0; i<5;i++){
            let x = "score-"+i     
            if (localStorage.getItem(x) !== null){
                let score = localStorage.getItem(x).split(",")
                scoreBoard.splice(i, 1, [score[0], score[1]])
                console.log(scoreBoard)        
            }
        }
        for (let i=0; i<5;i++){
            if (scoreBoard[i][0]>0){
                document.getElementById("score-"+i).innerHTML = `${scoreBoard[i][1]} - ${scoreBoard[i][0]}` 
            }
            console.log(scoreBoard)
        }
    }

    loadScores()

    const lTetromino = [
        [1, width+1, width*2+1, 2],[width+1,width+2, width+3, width*2+3],
        [width*2+1, 2, width+2, width*2+2], [width+1, width*2+1, width*2+2, width*2+3]
    ]
    const zTetromino = [
        [width*2+1, width+2,width*2+2, width+3], [1, width+1,width+2,width*2+2],
        [width*2+1, width+2,width*2+2, width+3], [1, width+1,width+2,width*2+2]
    ]

    const tTetromino = [
        [width+1, 2, width+2, width+3], [2, width+2, width*2+2,width+3], 
        [width+1,width+2,width*2+2,width+3], [width+1, 2, width+2, width*2+2]
    ]

    const oTetromino = [
        [1, width+1, 2, width+2], [1, width+1, 2, width+2], 
        [1, width+1, 2, width+2], [1, width+1, 2, width+2]
    ]

    const iTetromino = [
        [2, width+2, width*2+2,width*3+2], [width+1, width+2, width+3, width+4],
        [2, width+2, width*2+2,width*3+2], [width+1, width+2, width+3, width+4]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    let currentPosition = 4;
    let currentRotation = 0

    //Select a random Tetromino
    let random = Math.floor(Math.random()*theTetrominoes.length)
    console.log(random)
    let current = theTetrominoes[random][currentRotation];
    let color = Math.floor(Math.random()*colors.length)

    //Draw Tetromino
    function draw(){
        current.forEach(index =>{
            squares[currentPosition + index].classList.add(colors[color])
        })
    }

    //Undraw Tetromino
    function undraw(){
        current.forEach(index =>{
            squares[currentPosition + index].classList.remove(...colors)
        })
    }
    
    //assign function to keyCodes
    function control(e){
        if (movement === true){
            if(e.keyCode === 37){
                moveLeft()
            } else if (e.keyCode === 38){
                rotate()
            } else if (e.keyCode === 39){
                moveRight()
            } else if (e.keyCode === 40){
                moveDown()
            }
        }
    }
    document.addEventListener('keydown', control)

    //Move down Tetromino
    function moveDown(){
        undraw();
        currentPosition += width;
        draw();
        freeze()
    }

    //freeze function
    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains("taken"))){
            current.forEach(index => squares[currentPosition + index].classList.add("taken"))
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            color = nextColor;
            nextColor = Math.floor(Math.random() * colors.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    function moveLeft(){
        undraw()
        const isAtLeftEdge = current.some((index) =>(currentPosition + index) % width === 0)
        if(!isAtLeftEdge) {currentPosition -=1;}
        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))){
            currentPosition +=1;
        }

        draw();
    }

    function moveRight(){
        undraw()
        const isAtRightEdge = current.some((index) =>(currentPosition + index) % width === width-1)
        console.log(currentPosition)
        if(!isAtRightEdge) {currentPosition +=1;}
        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))){
            currentPosition -=1;
        }

        draw();
    }

    function rotate(){
        undraw();
        if (currentRotation ===3){
            currentRotation = 0
        } else { 
            currentRotation++}
        current = theTetrominoes[random][currentRotation];
        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))){
            currentRotation -=1;
        }
        draw();
    }

    //show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    //the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1], 
        [1, displayWidth, displayWidth+1, displayWidth+2], 
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1,displayWidth*3+1], 
    ]

    function displayShape(){
        displaySquares.forEach(square =>{
            square.classList.remove(...colors)
        })
        upNextTetrominoes[nextRandom].forEach(index =>{
            displaySquares[displayIndex+index].classList.add(colors[nextColor])
        })
    }

    //add funcionality to start btn
    startBtn.addEventListener("click", ()=>{
        if(timerId){
            movement = false;
            clearInterval(timerId)
            timerId = null
            startBtn.innerHTML = "Resume"
        } else {
            movement = true;
            draw()
            timerId = setInterval(moveDown, velocity)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            nextColor = Math.floor(Math.random()*colors.length)
            displayShape()
            startBtn.innerHTML = "Pause"
        }
    })
    
    //add funcionality to reset btn
    resetBtn.addEventListener("click", ()=>{
        reset()
    })
    function reset(){
        velocity = 500;
        score = 0;
        scoreDisplay.innerHTML = score;
        startBtn.innerHTML = "Start"
        clearInterval(timerId);
        timerId = null
        for(let i=0; i<200;i++){
            squares[i].classList.remove(...colors);
            squares[i].classList.remove("taken");
        }
    }

    //add score
    function addScore(){
        for (let i=0; i<199; i +=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            if (row.every(index => squares[index].classList.contains('taken'))){
                movement = false
                score +=10;
                velocity -=100;
                clearInterval(timerId);
                row.forEach(index =>{
                    squares[index].style.animation = "blinking 2s ease"
                })
                setTimeout(()=>{
                    timerId = setInterval(moveDown, velocity)
                    scoreDisplay.innerHTML = score;
                    row.forEach(index =>{
                        squares[index].classList.remove('taken');
                        squares[index].classList.remove(...colors)
                    })
                    const squaresRemoved = squares.splice(i, width)
                    squares = squaresRemoved.concat(squares)
                    squares.forEach(cell => {grid.appendChild(cell)})
                    movement = true
                }, 2000)

            }
        }
    }

    //gameover
    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
            showScores();
            reset()
        }
    }

    //ScoreBoard
    function showScores(){
        for (let i=0; i<4; i++){
            if (scoreBoard[i][0]<score || !scoreBoard[i][0]){
                scoreName = prompt("Congrats, you arrived to the top 5. Write your name");
                scoreBoard.splice(i,0,[score, scoreName]);
                localStorage.setItem("score-"+(i), scoreBoard[i]);
                for (let i=0; i<5;i++){
                    if (scoreBoard[i][0]>0){
                        document.getElementById("score-"+i).innerHTML = `${scoreBoard[i][1]} - ${scoreBoard[i][0]}` 
                    }
                }
                return;
            }
        }
    }

})