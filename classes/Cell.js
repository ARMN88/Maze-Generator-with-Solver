class Cell {
  constructor(x, y) {
    this.isUsed = false;

    this.x = x;
    this.y = y;
  }
  draw() {
    //if(this.isUsed) return;
    ctx.fillRect(this.x, this.y, scale, scale);
  }
  getSurroundingCells(distance) {
    let surrounding = [];
    for(let x = 0;x < cells.length;x++) {
      for(let y = 0;y < cells[0].length;y++) {
        if(getDistance(this.x, this.y, cells[x][y].x, cells[x][y].y) === distance && !cells[x][y].isUsed) {
          surrounding.push(cells[x][y]);
        }
      }
    }
    return surrounding;
  }
  getNearestPoints(threshold=scale) {
    var nearestPoints = [];
    for(let point of points) {
      if(getDistance(point.x, point.y, this.x, this.y) <= threshold && point.isUsed && getDistance(point.x, point.y, this.x, this.y) !== 0) {
        nearestPoints.push(point);
      }
    }
    return nearestPoints;
  }
}
