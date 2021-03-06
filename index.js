// RULES OF THE GAME
/* 
    Any live cell with fewer than two live neighbors dies, as if by under population.
    Any live cell with two or three live neighbors lives on to the next generation.
    Any live cell with more than three live neighbors dies, as if by overpopulation.
    Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction. 
*/
// canvas init
var ctx = document.getElementById('canvas').getContext('2d');

// ================ GLOBAL VARS =====================
var frames;
var cell;
var generationOnScreen=0;
var squareSize=10;
var semiSquare=squareSize/2;
var aliveCell="blue";
var deadCell="white";
var outlineOfCells="#f5f5dc";
var generationSpeed=200;

canvas.addEventListener("mousedown", getPosition, false); // add element listener to canvas 

// get canvas height and width
var canvasWidth=$("canvas").width();
var canvasHeight=$("canvas").height();


//calculate the number of rows and cols
var rows=canvasWidth/squareSize; 
var cols=canvasHeight/squareSize;


// construct the bidimensinal array using the number of rows and cols
 cell=new Array();
for(let i=0;i<rows;i++){
        cell[i]=new Array();
}
// ==================================================
// alert user about non-responsive design once
var alerted = localStorage.getItem('alerted') || '';
if (alerted != 'yes') {
 alert("Be aware! This page has not a responsive design! :), also in this project you can find some minor bugs. ");
 localStorage.setItem('alerted','yes');
}

// ================ FUNCTIONS =====================

//  first frame of the game
function main(){

    killCells(); // fill the array with 0 elements (all cells are dead)
    drawSquares();
    
} main();
 
// start button function
function start(){  

      frames= setInterval(function(){
        legacy();
        drawSquares();
        generationOnScreen ++;
        $(".generation").text(generationOnScreen);

    },generationSpeed);
}

// stop button function
function stop(){

    clearInterval(frames);

}
function randomDraw(){
    stop();
    killCells();
    fillRandom();
    drawSquares();
}

function changeSpeed(){

     generationSpeed=$(".speed").val()*100;
     stop();
     
}

function cellsNumber(){

    let inputVal=$(".cells").val()
    if( inputVal < 10 || inputVal > 150 ){
        alert("Use coresponded values!");
    }else{
        var alertedSize = localStorage.getItem('alertedSize') || '';
        if (alertedSize != 'yes') {
        alert(" Not recomanded! (Cells can be drawed outside the screen after a while! ) ");
        localStorage.setItem('alertedSize','yes');
        }

        killCells();
        stop();
        squareSize=$(".cells").val();
        drawSquares();
    }
 
}

function killCells(){

    for(var i=0;i<rows;i++){
        for(var j=0;j<cols;j++){
            cell[i][j]=0;
        }
    }
}

// reset button function
function reset(){

    clearInterval(frames);
    generationOnScreen=0;
    $(".generation").text(generationOnScreen);
    killCells();
    drawSquares();

}


 // construct the array with random 0 or 1 values 
function fillRandom(){
   
    // 0 = dead cell
    // 1 = alive cell 

    for(var i=0;i<rows;i++){
        for(var j=0;j<cols;j++){

            var randomNumber=Math.random(); //get a random number
            var intVal=randomNumber*2;  
            var randomBinary=Math.floor(intVal);
            if(randomBinary === 1){
                cell[i][j]=1;
            }else{
                cell[i][j]=0;
            }

        }
    }
}

 // construct the squares
function drawSquares(){
   
    for(var m=0;m<rows;m++){  // m <  width of the page 
        for(var n=0;n<cols;n++){ // n< height of the page
            if(cell[m][n] === 1){

                paint(m,n,"aliveCell");

            }else{

                paint(m,n,"deadCell");

            }
        }
    }
}

function paint(x,y,state){
    var status=state;
    if(state == "aliveCell" ){
                // draw square
                ctx.fillStyle=aliveCell;
        ctx.fillRect(x*squareSize,y*squareSize,squareSize,squareSize);
                // draw outline
        ctx.strokeRect(x*squareSize,y*squareSize,squareSize,squareSize);
                ctx.strokeStyle = outlineOfCells;
            }else{
                // draw square
                ctx.fillStyle=deadCell;
        ctx.fillRect(x*squareSize,y*squareSize,squareSize,squareSize);
                // draw outline
        ctx.strokeRect(x*squareSize,y*squareSize,squareSize,squareSize);
                ctx.strokeStyle = outlineOfCells;
            }
        }

function checkNeighborsNum(arr,i,j){ // check number of alive neighbors

    var total=0;
    try{

        if( arr[i-1][j] == 1 )  total++; //N
        if( arr[i-1][j+1] == 1 ) total++;// NE
        if( arr[i][j+1] == 1 ) total++; //E
        if( arr[i+1][j+1] == 1 ) total++; // SE
        if( arr[i+1][j] == 1 ) total++; //S
        if( arr[i+1][j-1] == 1 ) total++; //SV
        if( arr[i][j-1] == 1 ) total++; //V
        if( arr[i-1][j-1] == 1 ) total++; // NV

        return total;
    }catch{
        // return stops the function , no needs for catch 
    }
}

// follow the rules of the game about the every cell

function legacy(){

    for(var i=0;i<rows;i++){
        for(var j=0;j<cols;j++){
            if( cell[i][j] === 0 ){
                // new state: live, reproduction 
                if( checkNeighborsNum(cell,i,j) === 3 )     cell[i][j]=1;
            } else {
                // new state: dead, overpopulation/ underpopulation
                if( checkNeighborsNum(cell,i,j) < 2 || checkNeighborsNum(cell,i,j) > 3 )  cell[i][j]=0;
                // lives on to next generation
                else if( checkNeighborsNum(cell,i,j) === 2 || checkNeighborsNum(cell,i,j) === 3 )  cell[i][j]= 1;
        
            }
        }
    }
}


// on input click function


function getPosition(event){

    stop();
    var x = new Number();
    var y = new Number();
    var canvas = document.getElementById("canvas");

    if (event.x != undefined && event.y != undefined){
      x = event.x;
      y = event.y;
    }else{ // Firefox method to get the position
      x = event.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
      y = event.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    // x and y now are numbers that needs to be rounded to square-size
    drawOnClick(Math.floor(x / squareSize) * squareSize,Math.floor(y / squareSize) * squareSize); //sent the values on %10=0

}

  function drawOnClick(x,y){

    cell[x/squareSize][y/squareSize]=1; // squareSize = 1 cell 

    // use this insted of paint function

    // draw square
    ctx.fillStyle=aliveCell;
    ctx.fillRect(x,y,squareSize,squareSize);
    // draw outline
    ctx.strokeRect(x,y,squareSize,squareSize);
    ctx.strokeStyle = outlineOfCells;
  }