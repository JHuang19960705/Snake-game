const canvas = $("#myCanvas")[0];
const ctx = canvas.getContext("2d"); // 取得 canvas 的繪圖上下文
const unit = 20; // 蛇和果實的單位大小
const row = canvas.height / unit; // 格子行數
const column = canvas.width / unit; // 格子列數
let snake = []; // 蛇的身體部分
let myFruit; // 蛇要吃的果實
let myGame; // 遊戲進行中的計時器

$(document).ready(function() {
  initializeGame();
});

// 初始化遊戲
function initializeGame() {
  createSnake(); // 建立蛇
  myFruit = new Fruit(); // 建立果實
  myGame = setInterval(draw, 150); // 設定遊戲繪製計時器
  $(document).on("keydown", changeDirection); // 監聽方向鍵事件
}

// 重生檢查
export function resurrectCheck(newResurrect) {
  if (newResurrect === true) {
    setTimeout(() => {
      alert("復活成功，分數繼續累積");
      myFruit.pickALocation(); // 重製果實位置
      myGame = setInterval(draw, 150); // 重新啟動遊戲計時器
    }, 100);
    setTimeout(() => {
      // 隱藏猜拳遊戲區域
      $(".rps").css("opacity", "0");
      $(".rps").css("top", "150%");
      $(".result-wrap").css("display", "none");
      resurrectSnake(); // 重生蛇
    }, 500);
  } else if (newResurrect === false) {
    setTimeout(() => {
      alert("復活失敗，重新開始");
      setTimeout(() => {
        // 隱藏猜拳遊戲區域
        $(".rps").css("opacity", "0");
        $(".rps").css("top", "150%");
        $(".result-wrap").css("display", "none");
        setTimeout(() => {
          location.reload(); // 重新載入頁面
        }, 800);
      }, 100);
    }, 100);
  }
}

// 建立蛇的起始位置
function createSnake() {
  snake[0] = { x: 80, y: 0 };
  snake[1] = { x: 60, y: 0 };
  snake[2] = { x: 40, y: 0 };
  snake[3] = { x: 20, y: 0 };
}

// 果實類別
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  // 繪製果實
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  // 隨機設定果實位置，確保不與蛇的身體重疊
  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          console.log("overlapping...");
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

// 重生蛇
function resurrectSnake() {
  let newSnakeX = snake[0].x + unit * snake.length;
  let newSnakeY = snake[0].y;
  if (d === "Left") {
    newSnakeX = snake[0].x - unit * snake.length;
  } else if (d === "Right") {
    newSnakeX = snake[0].x + unit * snake.length;
  } else if (d === "Up") {
    newSnakeY = snake[0].y - unit * snake.length;
  } else if (d === "Down") {
    newSnakeY = snake[0].y + unit * snake.length;
  }

  // 更新蛇的位置
  for (let i = 0; i < snake.length; i++) {
    snake[i] = { x: newSnakeX + i * unit, y: newSnakeY };
  }
}

// 改變蛇的移動方向
function changeDirection(e) {
  if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }

  // 防止連續按下按鍵導致蛇的自殺
  $(document).off("keydown", changeDirection);
}

let d = "Right"; // 蛇的初始移動方向

// 繪製遊戲畫面
function draw() {
  // 檢查蛇是否咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      $(".rps").css("top", "50%");
      setTimeout(() => {
        $(".rps").css("opacity", "1");
      }, 500);
      clearInterval(myGame); // 停止遊戲計時器
    }
  }

  // 清空畫面
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit(); // 繪製果實

  // 繪製蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen"; // 蛇頭的顏色
    } else {
      ctx.fillStyle = "lightblue"; // 蛇身的顏色
    }
    ctx.strokeStyle = "white";

    // 如果蛇到達畫布邊界，則將其移動到另一側
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // 繪製蛇的身體
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // 根據方向移動蛇的頭部位置
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = { x: snakeX, y: snakeY };

  // 檢查是否吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation(); // 重新設定果實位置
    snakeScore++; // 分數加一
    setHighestScore(snakeScore); // 設定最高分數
    $("#myScore").html("遊戲分數:" + snakeScore); // 更新遊戲分數顯示
    $("#myScore2").html("最高分數:" + highestScore); // 更新最高分數顯示
  } else {
    snake.pop(); // 移除蛇的尾部，使其看起來在移動
  }

  snake.unshift(newHead); // 將新的頭部插入到蛇的開始位置
  $(document).on("keydown", changeDirection); // 重新啟用方向鍵監聽
}

let snakeScore = 0; // 遊戲分數
$("#myScore").html("遊戲分數:" + snakeScore); // 初始化遊戲分數顯示

let highestScore; // 最高分數
loadHighestScore(); // 載入最高分數
$("#myScore2").html("最高分數:" + highestScore); // 初始化最高分數顯示

// 載入最高分數
function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

// 設定最高分數
function setHighestScore(snakeScore) {
  if (snakeScore > highestScore) {
    localStorage.setItem("highestScore", snakeScore);
    highestScore = snakeScore;
  }
}
