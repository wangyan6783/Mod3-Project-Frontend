document.addEventListener("DOMContentLoaded", () => {

  const background = document.querySelector("#background");
  const backdrop = document.querySelector("#backdrop");
  const gameover = document.querySelector("#gameover");
  const winner = document.querySelector("#winner");
  const login = document.querySelector("#login");
  const enterGameBtn = document.querySelector("#enter-game-btn");
  const playerForm = document.querySelector("#player-name-form");
  const rulesImg = document.querySelector("#rules-img");

  const bombSound = new Audio("sounds/bomb.mp3");
  const pikaSound = new Audio("sounds/pikachu.mp3");

  let player1Name;
  let player2Name;

  let col1 = 1;
  let row1 = 1;
  let col2 = 15;
  let row2 = 15;
  let currentLocation1 = [col1, row1];
  let currentLocation2 = [col2, row2];
  let power1 = 1;
  let power2 = 1;
  let gameoverStatus = false;
  let currentGrid1;
  let currentGrid2;

  enterGameBtn.addEventListener("click", (event) => {
    player1Name = document.querySelector("#player1-name").value;
    player2Name = document.querySelector("#player2-name").value;
    rulesImg.style.display = "block";
    login.style.display = "none";
  })

  rulesImg.addEventListener("click", (event) => {
    rulesImg.style.display = "none";
    background.style.display = "grid";
    backdrop.style.display = "block";
    document.body.addEventListener("keydown", eventFn);
  })

  let eventFn = (e) => {
    // console.log(e.keyCode);
    if (gameoverStatus === false) {
      if (e.keyCode === 88) {
        dropBomb(currentLocation1[0], currentLocation1[1], power1);
      }
      if (e.keyCode === 190) {
        dropBomb(currentLocation2[0], currentLocation2[1], power2);
      }
      if (e.keyCode === 38) {
        moveUp(currentLocation2, 2);
      }
      if(e.keyCode === 40){
        moveDown(currentLocation2, 2)
      }
      if(e.keyCode === 37){
        moveLeft(currentLocation2, 2)
      }
      if(e.keyCode === 39){
        moveRight(currentLocation2, 2)
      }
      if (e.keyCode === 87) {
        moveUp(currentLocation1, 1);
      }
      if(e.keyCode === 83){
        moveDown(currentLocation1, 1)
      }
      if(e.keyCode === 65){
        moveLeft(currentLocation1, 1)
      }
      if(e.keyCode === 68){
        moveRight(currentLocation1, 1)
      }
    }
  }

  Adapter.getGrids()
  .then(gridObjs => {
    gridObjs.map(gridObj => {
      new Grid(gridObj);
    })
    let brickArr = Grid.allBricks();
    let powerArr = [];
    for (var i = 0; i < 15; i++) {
      powerArr.push(brickArr[Math.floor(Math.random()*brickArr.length)]);
    }
    powerArr.map(powerInstance => powerInstance.power = true)
    background.innerHTML = Grid.renderAll();
    currentGrid1 = background.querySelector("#grid-1");
    currentGrid2 = background.querySelector("#grid-225");
  })

  function getGridId(col, row) {
    return 15 * row - (15 - col);
  }

  function getGridElement(id) {
    return document.querySelector(`#grid-${id}`);
  }


  function moveUp(location, player) {
    if (location[1] > 1) {
      let currentGridId = getGridId(location[0], location[1]);
      let currentGrid = getGridElement(currentGridId);
      let topGridId = getGridId(location[0], location[1] - 1);
      let topGrid = getGridElement(topGridId);

      console.log(currentGrid.dataset.category);
      if (currentGrid.dataset.category === "fire") {
        currentGrid.dataset.category = "burned";
        currentGrid.src = "media/burned.png";
        debugger
        winner.innerText += player === 1 ? `${player2Name} Wins!`.toUpperCase() : `${player1Name} Wins!`.toUpperCase();
        gameoverStatus === true;
        setTimeout(showGameover, 4000)
      } else if (currentGrid.dataset.category === "bomb") {
          currentGrid.src = "media/bomb.png";
      } else if (currentGrid.dataset.category === "background") {
          currentGrid.src = "media/background.jpg";
      } else if (currentGrid.dataset.category === `player${player}`) {
          currentGrid.dataset.category = "background";
          currentGrid.src = "media/background.jpg";
      }

      if (topGrid.dataset.category === "fire") {
        topGrid.dataset.category = "burned";
        topGrid.src = "media/burned.png";
        winner.innerText += player === 1 ? `${player2Name} Wins!`.toUpperCase() : `${player1Name} Wins!`.toUpperCase();
        gameoverStatus === true;
        setTimeout(showGameover, 4000)
      }

      if (!["brick", "bomb", "fire"].includes(topGrid.dataset.category)) {
        location[1]--;
        topGrid.dataset.category = `player${player}`;
        topGrid.src = `media/avatar${player}.png`;
        if (topGrid.dataset.power === "true") {
          player === 1 ? power1++ : power2++
          topGrid.dataset.power = "false"
        }
        player === 1 ? currentGrid1 = topGrid : currentGrid2 = topGrid
      }
    }
  }

  function moveDown(location, player) {
    if (location[1] < 15) {
      let currentGridId = getGridId(location[0], location[1]);
      let currentGrid = getGridElement(currentGridId);
      let bottomGridId = getGridId(location[0], location[1] + 1);
      let bottomGrid = getGridElement(bottomGridId);
      if (!["brick", "bomb"].includes(bottomGrid.dataset.category)) {
        location[1]++;
        bottomGrid.dataset.category = `player${player}`;
        bottomGrid.src = `media/avatar${player}.png`;
        if (bottomGrid.dataset.power === "true") {
          player === 1 ? power1++ : power2++
          bottomGrid.dataset.power = "false"
        }
        if (currentGrid.dataset.category === "bomb") {
            currentGrid.src = "media/bomb.png";
          } else if (currentGrid.dataset.category === "background") {
            currentGrid.src = "media/background.jpg";
          } else if (currentGrid.dataset.category === `player${player}`) {
            currentGrid.dataset.category = "background";
            currentGrid.src = "media/background.jpg";
        }

        player === 1 ? currentGrid1 = bottomGrid : currentGrid2 = bottomGrid
      }
    }
  }

  function moveLeft(location, player) {
    if (location[0] > 1) {
      let currentGridId = getGridId(location[0], location[1]);
      let currentGrid = getGridElement(currentGridId);
      let leftGridId = getGridId(location[0] - 1, location[1]);
      let leftGrid = getGridElement(leftGridId);
      if (!["brick", "bomb"].includes(leftGrid.dataset.category)) {
        location[0]--;
        leftGrid.dataset.category = `player${player}`;
        leftGrid.src = `media/avatar${player}.png`;
        if (leftGrid.dataset.power === "true") {
          player === 1 ? power1++ : power2++
          leftGrid.dataset.power = "false"
        }
        if (currentGrid.dataset.category === "bomb") {
            currentGrid.src = "media/bomb.png";
          } else if (currentGrid.dataset.category === "background") {
            currentGrid.src = "media/background.jpg";
          } else if (currentGrid.dataset.category === `player${player}`) {
            currentGrid.dataset.category = "background";
            currentGrid.src = "media/background.jpg";
        }

        player === 1 ? currentGrid1 = leftGrid : currentGrid2 = leftGrid
      }
    }
  }

  function moveRight(location, player) {
    if (location[0] < 15) {
      let currentGridId = getGridId(location[0], location[1]);
      let currentGrid = getGridElement(currentGridId);
      let rightGridId = getGridId(location[0] + 1, location[1]);
      let rightGrid = getGridElement(rightGridId);
      if (!["brick", "bomb"].includes(rightGrid.dataset.category)) {
        location[0]++;
        rightGrid.dataset.category = `player${player}`;
        rightGrid.src = `media/avatar${player}.png`;
        if (rightGrid.dataset.power === "true") {
          player === 1 ? power1++ : power2++
          rightGrid.dataset.power = "false"
        }
        if (currentGrid.dataset.category === "bomb") {
            currentGrid.src = "media/bomb.png";
          } else if (currentGrid.dataset.category === "background") {
            currentGrid.src = "media/background.jpg";
          } else if (currentGrid.dataset.category === `player${player}`) {
            currentGrid.dataset.category = "background";
            currentGrid.src = "media/background.jpg";
        }

        player === 1 ? currentGrid1 = rightGrid : currentGrid2 = rightGrid
      }
    }
  }

  function getFireGrids(col, row, power) {
    let fireArr = [];
    let counterLR = 0;
    let counterTB = 0;
    while (counterLR <= power) {
      if (col + counterLR <= 15) {
        fireArr.push([col + counterLR, row]);
      }
      if (col - counterLR >= 1) {
        fireArr.push([col - counterLR, row]);
      }
      counterLR++;
    }

    while (counterTB <= power) {
      if (row + counterTB <= 15) {
        fireArr.push([col, row + counterTB]);
      }
      if (row - counterTB >= 1) {
        fireArr.push([col, row - counterTB]);
      }
      counterTB++;
    }
    return fireArr;
  }

  function dropBomb(col, row, power) {
    let bombGridId = getGridId(col, row);
    let bombGrid = getGridElement(bombGridId);
    bombGrid.src = "media/bomb.png"
    bombGrid.dataset.category = "bomb"

    let fireArr = getFireGrids(col, row, power);
    let fireIds = fireArr.map(fire => getGridId(fire[0], fire[1]));
    let fireGrids = fireIds.map(fireId => getGridElement(fireId));

    setTimeout(showFire, 2500);

    function showFire () {
      fireGrids.map(fireGrid => {
        fireGrid.dataset.category = "fire";
        fireGrid.src = "media/fire.png";
        bombSound.play();
      })

    setTimeout(removeFire, 800);

    function removeFire() {
      currentGridId1 = getGridId(currentLocation1[0], currentLocation1[1]);
      currentGrid1 = getGridElement(currentGridId1);
      currentGridId2 = getGridId(currentLocation2[0], currentLocation2[1]);
      currentGrid2 = getGridElement(currentGridId2);

      fireGrids.map(fireGrid => {
        if (currentGrid1.dataset.category !== "burned" && currentGrid2.dataset.category !== "burned") {
          if (fireGrid.dataset.power === "false") {
            fireGrid.dataset.category = "background";
            fireGrid.src = "media/background.jpg";
          } else {
            fireGrid.dataset.category = "powerup";
            fireGrid.src = "media/powerup.png";
          }
        }
      })
    } //remove fire
  } //show fire
}  //drop bomb

  // function checkGameover(grid, player) {
  //   if (currentGrid1.dataset.category === "fire" && gameoverStatus === false) {
  //     gameoverStatus = true;
  //     currentGrid1.src = "media/burned.png";
  //     currentGrid1.dataset.category = "burned";
  //     winner.innerText += `${player2Name} Wins!`.toUpperCase();
  //     setTimeout(showGameover, 4000)
  //   }
  //   if (currentGrid2.dataset.category === "fire" && gameoverStatus === false) {
  //     gameoverStatus = true;
  //     currentGrid2.src = "media/burned.png";
  //     currentGrid2.dataset.category = "burned";
  //     winner.innerText += `${player1Name} Wins!`.toUpperCase();
  //     setTimeout(showGameover, 4000)
  //   }
  //   }

  function showGameover(){
    gameoverStatus = true;
    pikaSound.play();
    background.style.display = "none";
    backdrop.style.display = "none";
    gameover.style.display = "block";
  }

// Restart the game
  gameover.addEventListener("click", e => {
    window.location.href = "index.html"
  })

});
