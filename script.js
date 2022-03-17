eruda.init();

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const scale = 10;
let speed = 10;

const cells = [];
let currentCell;

const path = [];

let isMazeGenerated = false;

//

const startPosition = new Cell(0, 0);
startPosition.gCost = 0;
let endPosition;

let currentNode = startPosition;

let closedList = [];
let openList = [];
let finalList = [];

let points = [];
let obstacles = [];

let found = false;

let searchSpeed = 30;

function Start() {
  for(let x = 0;x < canvas.width;x+=scale) {
    cells.push([])
    for(let y = 0;y < canvas.height-scale;y+=scale) {
      cells[cells.length-1].push(new Cell(x, y));     
    }
  }
  currentCell = cells[0][0];
  Update();
}
function Update() {
  requestAnimationFrame(Update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let cell of cells.flat()) {
    ctx.fillStyle = (cell.isUsed) ? "black" : "grey";
      cell.draw();
  }
  if(!isMazeGenerated) {
    for(let i = 0; i < speed;i++) {
      var surrounding = currentCell.getSurroundingCells(scale*2);
      if(surrounding.length > 0) {
        currentCell.isUsed = true;
        // get random direction cell
        var cell = surrounding[Math.floor(Math.random() * surrounding.length)];
  
        // get cell wall
        var wallX = currentCell.x+(cell.x-currentCell.x)/2;
        var wallY = currentCell.y+(cell.y-currentCell.y)/2;
        var cellWall = cells.flat().find(element => {
          return element.x === wallX && element.y === wallY;
        });
  
        cellWall.isUsed = true;
        cell.isUsed = true;
  
        cell.rparent = currentCell;
        currentCell = cell;
      }else {
        if(currentCell.rparent) {
          currentCell = currentCell.rparent;
        }else {
          isMazeGenerated = true;
          endPosition = cells.flat().reverse().find(element => {
            return element.y > canvas.height/2 && element.x >= canvas.width-scale*3 && element.isUsed;
          });
          for(let cell of cells.flat()) {
            if(cell.isUsed) {
              points.push(cell);
            }else {
              obstacles.push(cell);
            }
          }
          break;
        }
      }
    }
  }else if(!found){
    // Sove Maze
    for(let i = 0; i < searchSpeed;i++) {
    if(found) break;
      if((endPosition.x === currentNode.x && endPosition.y === currentNode.y) || finalList.length > 0) {
        if(currentNode.nparent) {
          finalList.push(currentNode);
          currentNode = currentNode.nparent;
      }else {
        found = true;
      }
      continue;
      }
    // get nearest points to current Node
    for(let point of currentNode.getNearestPoints()) {
      point.gCost = currentNode.gCost + getDistance(point.x, point.y, currentNode.x, currentNode.y);

        point.hCost = getDistance(point.x, point.y, endPosition.x, endPosition.y);

        point.fCost = point.hCost + point.gCost;
        openList.push(point);

        point.nparent = currentNode;
    }

    var lowestFValue = Infinity;
      var lowestFNode;
      for(let point of openList) {
        if(point.fCost < lowestFValue) {
          lowestFValue = point.fCost;
          lowestFNode = point;
        }
      }
      if(lowestFNode) {
        points = points.filter(value => {
        var isOpen = true;
        if(value.x === lowestFNode.x && value.y === lowestFNode.y) {
          isOpen = false;
        }
        return isOpen;
      });
      openList = openList.filter(value => {
        var isOpen = true;
        if(value.x === lowestFNode.x && value.y === lowestFNode.y) {
          isOpen = false;
        }
        return isOpen;
      });
        closedList.push(lowestFNode);
        currentNode = lowestFNode;
      }
  }
  }

  ctx.fillStyle = "darkgreen";
  for(let point of closedList) {
    ctx.fillRect(point.x, point.y, scale, scale);
  }

  var index = 0;
  for(let point of finalList) {
    ctx.fillStyle = "rgb(0, "+(index/finalList.length)*255+", 255)";
    ctx.fillRect(point.x, point.y, scale, scale);
    index++;
  }
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(
    (x2-x1) ** 2 +
    (y2-y1) ** 2
  )
}

window.onload = function() {
  Start();
}
