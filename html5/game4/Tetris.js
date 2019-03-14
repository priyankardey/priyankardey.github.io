var canvas = document.getElementById('myCanvas');

var Ctx = canvas.getContext("2d");

Ctx.scale(20,20);

Ctx.fillStyle = "#000";

Ctx.fillRect(0,0,canvas.width,canvas.height);

var g_FrameRate = 30;

var g_TimeInterval = 1000/g_FrameRate;

var g_Times = 1;
    
var g_StartGame = false;

var g_Restarted = false;

setInterval(f_GameLoop,g_TimeInterval)

var player = {
    
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
    
}

const colors = [
    
    null,
    "#3877FF",
    "#0DFF72",
    "#FF8E0D",
    "#0DC2FF",
    "#FFE138",
    "#FF0D72",
    "#F538FF",
    
]

document.addEventListener("keydown", f_PressedKey)

function f_PressedKey(e){
    
    if(e.keyCode == 37 && !g_StartGame && !g_Restarted){
        
        f_PlayerMove(-1);
        
        e.preventDefault();
        
    }else if(e.keyCode == 39 && !g_StartGame && !g_Restarted){
        
        f_PlayerMove(1);
        
        e.preventDefault();
        
    }else if(e.keyCode == 40 && !g_StartGame && !g_Restarted){
        
        f_PlayerDrop();
        
        e.preventDefault();
        
    }else if(e.keyCode == 81 && !g_StartGame && !g_Restarted){
        
        f_PlayerRotate(-1);
        
        e.preventDefault();
        
    }else if(e.keyCode == 87 && !g_StartGame && !g_Restarted){
        
        f_PlayerRotate(1);
        
        e.preventDefault();
        
    }else if(e.keyCode == 32){
        
        g_StartGame = false;
        
        g_Restarted = false;
        
        e.preventDefault();
        
    }
    
}

const arena = f_CreateMatrix(12,20);

function f_SweepArena(){
    
    let rowCount = 1;
    
    outer: for(y = arena.length - 1; y > 0; --y){
        
        for(x = 0; x < arena[y].length; ++x){
            
            if(arena[y][x] === 0){
                
                continue outer;
                
            }
            
        }
        
        const row = arena.splice(y, 1)[0].fill(0);
        
        arena.unshift(row);
        
        ++y;
        
        player.score += rowCount * 10;
        
        rowCount *= 2;
        
    }
    
}

function f_Collide(arena, player){
    
    const [m, o] = [player.matrix, player.pos];
    
    for(y = 0; y < m.length; ++y){
        
        for(x = 0; x < m[y].length; ++x){
            
            if(m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0){
                
                return true;
                
            }
            
        }
        
    }
    
    return false;
    
}

function f_CreateMatrix(w,h){
    
    const matrix = [];
    
    while(h--){
        
        matrix.push(new Array(w).fill(0));
        
    }
    return matrix;
}

function f_CreatePieces(type){
    
    if(type === "T"){
        
        return [
            
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],

        ];
        
    }else if(type === "O"){
        
        return [
            
            [2, 2],
            [2, 2],

        ];
        
    }else if(type === "L"){
        
        return [
            
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],

        ];
        
    }else if(type === "J"){
        
        return [
            
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],

        ];
        
    }else if(type === "I"){
        
        return [
            
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],

        ];
        
    }else if(type === "S"){
        
        return [
            
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],

        ];
        
    }else if(type === "Z"){
        
        return [
            
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],

        ];
        
    }
    
}


function f_Draw() {
    
    f_DrawMatrix(arena, {x: 0, y: 0});
    
    f_DrawMatrix(player.matrix, player.pos);
    
}

function f_DrawMatrix(matrix, offset){
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {

            if(value !== 0){

                Ctx.fillStyle = colors[value];

                Ctx.fillRect(x + offset.x,y + offset.y,1,1);

            }

        });

    });  
}

function merge(arena, player){
    
    player.matrix.forEach((row, y) => {
        
        row.forEach((value, x) => {
            
            if(value !== 0){
                
                arena[y + player.pos.y][x + player.pos.x] = value;
                
            }
            
        });
        
    });
    
}

function f_PlayerDrop(){
    
    player.pos.y++;
    
    if(f_Collide(arena,player)){
        
        player.pos.y--;
        
        merge(arena, player);
        
        f_PlayerReset();
        
        f_SweepArena();
        
        f_UpdateScore();
        
    }
    
    dropCounter = 0;
    
}

function f_PlayerMove(dir){
    
    player.pos.x += dir;
    
    if(f_Collide(arena, player)) {
        
        player.pos.x -= dir;
        
    }
    
}

function f_PlayerReset(){
    
    const pieces = "ILJOTSZ";
    
    player.matrix = f_CreatePieces(pieces[pieces.length * Math.random() | 0]);
    
    player.pos.y = 0;
    
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    
    if(f_Collide(arena, player)){
        
        arena.forEach(row => row.fill(0));
        
        player.score = 0;
        
        g_Restarted = true;
        
    }
    
}

f_PlayerReset();

function f_PlayerRotate(dir){
    
    const pos = player.pos.x;
    
    let offset = 1;
    
    f_Rotate(player.matrix, dir);
    
    while(f_Collide(arena, player)){
        
        player.pos.x += offset;
        
        offset = -(offset + (offset > 0 ? 1 : -1));
        
        if(offset > player.matrix[0].length){
            
            f_Rotate(player.matrix, -dir);
            
            player.pos.x = pos;
            
            return;
            
        }
        
    }
    
}

function f_Rotate(matrix, dir){
    
    for(y = 0; y < matrix.length; ++y){
        
        for(x = 0;x < y; ++x){
           [
               matrix[x][y],
               matrix[y][x],
               
           ] = [
               
               matrix[y][x],
               matrix[x][y],
               
           ];
            
        }
        
    }
    
    if(dir > 0){
        
        matrix.forEach(row => row.reverse());
        
    }else{
        
        matrix.reverse();
        
    }
    
}

let dropCounter = 0;
let dropInterval = 25;

function f_MovePieces(){
    
    if(dropCounter > dropInterval){
        
        f_PlayerDrop();
        
    }
    
    dropCounter++;
    
}

function f_UpdateScore(){
    
    document.getElementById("Score").innerText = player.score;
    
}

f_UpdateScore();

function f_GameLoop(){
    
    if(g_Restarted){
        
        f_DrawCanvasAndClear();
        
        Ctx.fillStyle = "white";

        Ctx.font = "1px Arial";

        Ctx.fillText("Press Space Bar To Start", 0.35,10);
        
        return;
        
    }
    
    if(g_StartGame){
           
        return;
           
    }
    
    f_MovePieces();
    
    f_DrawCanvasAndClear();
    
    f_Draw();
    
    if(g_Times == 1){
            
            g_Times--;

            Ctx.fillStyle = "white";

            Ctx.font = "1px Arial";

            Ctx.fillText("Press Space Bar To Start", 0.35,10);
        
            Ctx.font = "0.6px Arial";
        
            Ctx.fillText("Q - Rotate Clockwise" , 1,11);
        
            Ctx.fillText("W - Rotate Anticlockwise" , 1,12);
        
            Ctx.fillText("Left Arrow - Move Left ", 1,13);
        
            Ctx.fillText("Right Arrow - Move Right ", 1,14);
        
            Ctx.fillText("Down Arrow - Increase Speed ", 1,15);

            g_StartGame = true;
           
       }
    
}

function f_DrawCanvasAndClear(){
    
    Ctx.fillStyle = "#000";

    Ctx.fillRect(0,0,canvas.width,canvas.height);
                
}

