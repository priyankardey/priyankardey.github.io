function f_make2DArray(cols, rows) {
  
  var arr = new Array(cols);
  
  for (var i = 0; i < arr.length; i++) {
    
    arr[i] = new Array(rows);
    
  }
  
  return arr;
  
}

var grid;

var cols;

var rows;

var w = 20;

var gameOver = false;

var totalmines = 80;

function setup() {
  
  createCanvas(601, 601);
  
  cols = floor(width / w);
  
  rows = floor(height / w);
  
  grid = f_make2DArray(cols, rows);
  
  for (var i = 0; i < cols; i++) {
    
    for (var j = 0; j < rows; j++) {
      
      grid[i][j] = new c_Cell(i, j, w);
      
    }
    
  }

  // Pick totalmines spots
  var options = [];
  
  for (var i = 0; i < cols; i++) {
    
    for (var j = 0; j < rows; j++) {
      
      options.push([i, j]);
      
    }
    
  }


  for (var n = 0; n < totalmines; n++) {
    
    var index = floor(random(options.length));
    
    var choice = options[index];
    
    var i = choice[0];
    
    var j = choice[1];
    
    // Deletes that spot so it's no longer an option
    options.splice(index, 1);
    
    grid[i][j].mine = true;
    
  }


  for (var i = 0; i < cols; i++) {
    
    for (var j = 0; j < rows; j++) {
      
      grid[i][j].m_CountMines();
      
    }
    
  }

}

function f_gameOver() {
  
  for (var i = 0; i < cols; i++) {
    
    for (var j = 0; j < rows; j++) {
      
      grid[i][j].revealed = true;
      
    }
    
  }
  
}

function keyPressed(){
 
  if(keyCode == 32 && gameOver){
   
    f_Restart();
    
  }
  
}

function f_Restart(){
 
  location.reload();
  
}

function mousePressed() {
  
  for (var i = 0; i < cols; i++) {
    
    for (var j = 0; j < rows; j++) {
      
      if (grid[i][j].m_MouseInputChecks(mouseX, mouseY)) {
        
        grid[i][j].m_Reveal();

        if (grid[i][j].mine) {
          
          f_gameOver();
          
          gameOver = true;
          
        }

      }
      
    }
    
  }
  
}

function draw() {
  
  background(255);
  
  for (var i = 0; i < cols; i++) {
    
    for (var j = 0; j < rows; j++) {
      
      grid[i][j].m_Draw();
      
    }
    
  }
  
  if(gameOver){ 
    
    fill(255,0,0);
    
    textSize(35);
   
    text("Game Over", 300, 300);
    
    fill(255,165,0);
    
    textSize(25);
    
    text("Press 'Space Bar' to play again", 300, 345);
    
  }
  
}