allGrids = [];
class Grid {
  constructor(gridObj) {
    let srcArr = ["media/background.jpg", "media/brick.png"];
    this.id = gridObj.id;
    this.column = gridObj.column;
    this.row = gridObj.row;
    this.power = false;
    if (this.id === 1) {
      this.src = "media/avatar1.png";
      this.category = "player1";
    } else if (this.id === 225) {
      this.src = "media/avatar2.png";
      this.category = "player2";
    } else if ([2, 3, 16, 31, 195, 210, 223, 224].includes(this.id)) {
      this.src = "media/background.jpg"
      this.category = "background"
    } else {
      this.src = srcArr[Math.floor(Math.random()*srcArr.length)];
      if (this.src === "media/background.jpg") {
        this.category = "background";
      } else {
        this.category = "brick";
      }
    }
    allGrids.push(this);
  }

  static allBricks() {
    return allGrids.filter(grid => grid.category === "brick");
  }

  static renderAll(){
    return allGrids.map(grid => {
       return `<img id="grid-${grid.id}" src=${grid.src} style="grid-column: ${grid.column}; grid-row: ${grid.row}" data-category="${grid.category}" data-power=${grid.power}>`
    }).join("")
  }
}
