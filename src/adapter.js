class Adapter {
  static getGrids() {
    return fetch("http://localhost:3000/api/v1/grids").then(response => response.json())
  }
}
