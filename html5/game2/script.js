var g_Canvas = document.getElementById('canvas');

var g_Ctx = g_Canvas.getContext('2d');

var sizeInput = document.getElementById('size');

var changeSize = document.getElementById('change-size');

var scoreLabel = document.getElementById('score');

var score = 0;

var size = 4;

var width = g_Canvas.width / size - 6;

var cells = [];

var fontSize;

var loss = false;

f_StartGame();

changeSize.onclick = function () {
    
  if (sizeInput.value >= 2 && sizeInput.value <= 20) {
      
    size = sizeInput.value;
      
    width = g_Canvas.width / size - 6;
      
    //console.log(sizeInput.value);
      
    f_ClearCanvas();
      
    f_StartGame();
  }
}
//Cell Class
function cell(row, coll) {
    
  this.value = 0;
    
  this.x = coll * width + 5 * (coll + 1);
    
  this.y = row * width + 5 * (row + 1);
    
}
//Create Cells using Cell class
function f_CreateCells() {
    
  var i, j;
    
  for(i = 0; i < size; i++) {
      
    cells[i] = [];
      
    for(j = 0; j < size; j++) {
        
      cells[i][j] = new cell(i, j);
        
    }
  }
}
//Draw Cells on the canvas
function f_DrawCells(cell) {
    
  g_Ctx.beginPath();
    
  g_Ctx.rect(cell.x, cell.y, width, width);
    
  switch (cell.value){
          
    case 0 : g_Ctx.fillStyle = '#A9A9A9'; 
          break;
          
    case 2 : g_Ctx.fillStyle = '#D2691E'; 
          break;
          
    case 4 : g_Ctx.fillStyle = '#FF7F50'; 
          break;
          
    case 8 : g_Ctx.fillStyle = '#ffbf00';
          break;
          
    case 16 : g_Ctx.fillStyle = '#bfff00';
          break;
          
    case 32 : g_Ctx.fillStyle = '#40ff00';
          break;
          
    case 64 : g_Ctx.fillStyle = '#00bfff';
          break;
          
    case 128 : g_Ctx.fillStyle = '#FF7F50';
          break;
          
    case 256 : g_Ctx.fillStyle = '#0040ff';
          break;
          
    case 512 : g_Ctx.fillStyle = '#ff0080';
          break;
          
    case 1024 : g_Ctx.fillStyle = '#D2691E';
          break;
          
    case 2048 : g_Ctx.fillStyle = '#FF7F50';
          break;
          
    case 4096 : g_Ctx.fillStyle = '#ffbf00';
          break;
          
    default : g_Ctx.fillStyle = '#ff0080';
  }
    
  g_Ctx.fill();
    
  if (cell.value) {
      
    fontSize = width / 2;
      
    g_Ctx.font = fontSize + 'px Arial';
      
    g_Ctx.fillStyle = 'white';
      
    g_Ctx.textAlign = 'center';
      
    g_Ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width/7);
      
  }
}
//Clear the canvas every frame
function f_ClearCanvas() {
    
  g_Ctx.clearRect(0, 0, 500, 500);
    
}
//Event Handlers 
document.onkeydown = function (event) {
    
  if (!loss) {
      
    if (event.keyCode === 38 || event.keyCode === 87) {
        
      f_MoveUp(); 
        
        event.preventDefault();
        
    } else if (event.keyCode === 39 || event.keyCode === 68) {
        
      f_MoveRight();
        
        event.preventDefault();
        
    } else if (event.keyCode === 40 || event.keyCode === 83) {
        
      f_MoveDown(); 
        
        event.preventDefault();
        
    } else if (event.keyCode === 37 || event.keyCode === 65) {
        
      f_MoveLeft(); 
        
        event.preventDefault();
        
    }
      
    scoreLabel.innerHTML = 'Score : ' + score;
      
  }
}
//This function is called at the start of the game and when every game over is called
function f_StartGame() {
    
    f_CreateCells();

    f_DrawAllCells();

    f_PasteNewCells();

    f_PasteNewCells();
    
}
//Checks for game over condition
function f_FinishGame() {
    
    g_Canvas.style.opacity = '0.5';

    loss = true;

    fontSize = width / 2;

    g_Ctx.font = fontSize + 'px Arial';

    g_Ctx.fillStyle = 'red';

    g_Ctx.textAlign = 'center';

    g_Ctx.fillText("GameOver", g_Canvas.width/2, g_Canvas.height/2);
    
}

function f_DrawAllCells() {
    
  var i, j;
    
  for(i = 0; i < size; i++) {
      
    for(j = 0; j < size; j++) {
        
      f_DrawCells(cells[i][j]);
        
    }
  }
}

function f_PasteNewCells() {
    
  var countFree = 0;
    
  var i, j;
    
  for(i = 0; i < size; i++) {
      
    for(j = 0; j < size; j++) {
        
      if(!cells[i][j].value) {
          
        countFree++;
          
      }
    }
  }
  if(!countFree) {
      
    f_FinishGame();
      
    return;
      
  }
  while(true) {
      
    var row = Math.floor(Math.random() * size);
      
    var coll = Math.floor(Math.random() * size);
      
    if(!cells[row][coll].value) {
        
      cells[row][coll].value = 2 * Math.ceil(Math.random() * 2);
        
      f_DrawAllCells();
        
      return;
        
    }
  }
}

function f_MoveRight () {
    
  var i, j;
    
  var coll;
    
  for(i = 0; i < size; i++) {
      
    for(j = size - 2; j >= 0; j--) {
        
      if(cells[i][j].value) {
          
        coll = j;
          
        while (coll + 1 < size) {
            
          if (!cells[i][coll + 1].value) {
              
            cells[i][coll + 1].value = cells[i][coll].value;
              
            cells[i][coll].value = 0;
              
            coll++;
              
          } else if (cells[i][coll].value == cells[i][coll + 1].value) {
              
            cells[i][coll + 1].value *= 2;
              
            score +=  cells[i][coll + 1].value;
              
            cells[i][coll].value = 0;
              
            break;
              
          } else {
              
            break;
              
          }
        }
      }
    }
  }
    
  f_PasteNewCells();
    
}

function f_MoveLeft() {
    
  var i, j;
    
  var coll;
    
  for(i = 0; i < size; i++) {
      
    for(j = 1; j < size; j++) {
        
      if(cells[i][j].value) {
          
        coll = j;
          
        while (coll - 1 >= 0) {
            
          if (!cells[i][coll - 1].value) {
              
            cells[i][coll - 1].value = cells[i][coll].value;
              
            cells[i][coll].value = 0;
              
            coll--;
              
          } else if (cells[i][coll].value == cells[i][coll - 1].value) {
              
            cells[i][coll - 1].value *= 2;
              
            score +=   cells[i][coll - 1].value;
              
            cells[i][coll].value = 0;
              
            break;
              
          } else {
              
            break; 
              
          }
        }
      }
    }
  }
    
  f_PasteNewCells();
    
}

function f_MoveUp() {
    
  var i, j, row;
    
  for(j = 0; j < size; j++) {
      
    for(i = 1; i < size; i++) {
        
      if(cells[i][j].value) {
          
        row = i;
          
        while (row > 0) {
            
          if(!cells[row - 1][j].value) {
              
            cells[row - 1][j].value = cells[row][j].value;
              
            cells[row][j].value = 0;
              
            row--;
              
          } else if (cells[row][j].value == cells[row - 1][j].value) {
              
            cells[row - 1][j].value *= 2;
              
            score +=  cells[row - 1][j].value;
              
            cells[row][j].value = 0;
              
            break;
              
          } else {
              
            break; 
              
          }
        }
      }
    }
  }
    
  f_PasteNewCells();
    
}

function f_MoveDown() {
    
  var i, j, row;
    
  for(j = 0; j < size; j++) {
      
    for(i = size - 2; i >= 0; i--) {
        
      if(cells[i][j].value) {
          
        row = i;
          
        while (row + 1 < size) {
            
          if (!cells[row + 1][j].value) {
              
            cells[row + 1][j].value = cells[row][j].value;
              
            cells[row][j].value = 0;
              
            row++;
              
          } else if (cells[row][j].value == cells[row + 1][j].value) {
              
            cells[row + 1][j].value *= 2;
              
            score +=  cells[row + 1][j].value;
              
            cells[row][j].value = 0;
              
            break;
              
          } else {
              
            break; 
              
          }
        }
      }
    }
  }
    
  f_PasteNewCells();
    
}
