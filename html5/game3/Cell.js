function c_Cell(i, j, w) {
  
  this.i = i;
  
  this.j = j;
  
  this.Xpos = i * w;
  
  this.Ypos = j * w;
  
  this.Size = w;
  
  this.neighborCount = 0;

  this.mine = false;
  
  this.revealed = false;
}

c_Cell.prototype.m_Draw = function() {
  
  stroke(0);
  
  noFill();
  
  rect(this.Xpos, this.Ypos, this.Size, this.Size);
  
  if (this.revealed) {
    
    if (this.mine) {
      
      fill(125);
      
      ellipse(this.Xpos + this.Size * 0.5, this.Ypos + this.Size * 0.5, this.Size * 0.5);
      
    } else {
      
      fill(175);
      
      rect(this.Xpos, this.Ypos, this.Size, this.Size);
      
      if (this.neighborCount > 0) {
        
        textAlign(CENTER);
        
        fill(0);
        
        textSize(12);
        
        text(this.neighborCount, this.Xpos + this.Size * 0.5, this.Ypos + this.Size - 6);
      }
      
    }
    
  }
  
}

c_Cell.prototype.m_CountMines = function() {
  
  if (this.mine) {
    
    this.neighborCount = -1;
    
    return;
    
  }
  
  var total = 0;
  
  for (var xoff = -1; xoff <= 1; xoff++) {
    
    var i = this.i + xoff;
    
    if (i < 0 || i >= cols) continue;
    
    for (var yoff = -1; yoff <= 1; yoff++) {
      
      var j = this.j + yoff;
      
      if (j < 0 || j >= rows) continue;

      var neighbor = grid[i][j];
      
      if (neighbor.mine) {
        
        total++;
        
      }
      
    }
    
  }
  
  this.neighborCount = total;
  
}

c_Cell.prototype.m_MouseInputChecks = function(x, y) {
  
  return (x > this.Xpos && x < this.Xpos + this.Size && y > this.Ypos && y < this.Ypos + this.Size);
  
}

c_Cell.prototype.m_Reveal = function() {
  
  this.revealed = true;
  
  if (this.neighborCount == 0) {
    
    // flood fill time
    
    this.m_FloodFill();
    
  }
  
}

c_Cell.prototype.m_FloodFill = function() {
  
  for (var xoff = -1; xoff <= 1; xoff++) {
    
    var i = this.i + xoff;
    
    if (i < 0 || i >= cols) continue;
    
    
    for (var yoff = -1; yoff <= 1; yoff++) {
      
      var j = this.j + yoff;
      
      if (j < 0 || j >= rows) continue;
      

      var neighbor = grid[i][j];
      
      if (!neighbor.revealed) {
        
        neighbor.m_Reveal();
        
      }
      
    }
    
  }
  
}