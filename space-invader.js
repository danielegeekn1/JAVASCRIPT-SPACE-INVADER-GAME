const flex = document.querySelector(".flex");
const results = document.querySelector(".results");
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
killedAliens = [];
let fResults = 0;
//dynamically creating all the div necessary for our board game
for (let i = 0; i < 225; i++) {
  const square = document.createElement("div");
  flex.appendChild(square);
}
//converting all our dynamically created divs  in an array
const squares = Array.from(document.querySelectorAll(".flex div"));
const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!killedAliens.includes(i)) {
      squares[alienInvaders[i]].classList.add("invader");
    }
  }
}
//code to remove the invader of our game
function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove("invader");
  }
}
draw();
//adding shooter piece
squares[currentShooterIndex].classList.add("shooter");

function moveShooter(e) {
  //removing the shooter piece
  squares[currentShooterIndex].classList.remove("shooter");
  switch (e.key) {
    //checking positions
    case "ArrowLeft":
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
      break;
    case "ArrowRight":
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
      break;
  }
  squares[currentShooterIndex].classList.add("shooter");
}
document.addEventListener("keydown", moveShooter);

function moveInvaders() {
  //that's another way to define the position as we made in moveShooter function
  //that's is needed to define the left and right edge of our board game
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;
  remove();
  //conditions to set the movement of our invador from rigth to left
  //in this case we're saying if it touches the rightedge than change direction
  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      goingRight = false;
    }
  }
  //in this case we're saying if it touches the  left edge than change direction
  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
      goingRight = true;
    }
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }
  draw();
  //setting game over conditions
  if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
    results.innerHTML = "GAME OVER";
    clearInterval(invadersId);
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > squares.length) {
      results.innerHTML = "GAME OVER";
      clearInterval(invadersId);
    }
  }
  //code to set the winning conditions
  if (killedAliens.length === alienInvaders.length) {
    results.innerHTML = "YOU WON";
    clearInterval(invadersId);
  }
}
invadersId = setInterval(moveInvaders, 300);
function shootAlienInvaders(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;
  function moveLaser() {
    squares[currentLaserIndex].classList.remove("laser");
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add("laser");
    if (squares[currentLaserIndex].classList.contains("invader")) {
      squares[currentLaserIndex].classList.remove("laser");
      squares[currentLaserIndex].classList.remove("invader");
      squares[currentLaserIndex].classList.add("boom");

      setTimeout(() => {
        squares[currentLaserIndex].classList.remove("boom"), 300;
        clearInterval(laserId);
        const aliensRemoved = alienInvaders.indexOf(currentLaserIndex);
        killedAliens.push(aliensRemoved);
        fResults++;
        results.innerHTML = fResults;
      });
    }
  }
  switch (e.key) {
    case "ArrowUp":
      laserId = setInterval(moveLaser, 100);
  }
}
document.addEventListener("keyup", shootAlienInvaders);
