class Adapter {
  static getGrids() {
    return fetch("https://bomberpikabackend.herokuapp.com/api/v1/grids").then(response => response.json())
  }
}
