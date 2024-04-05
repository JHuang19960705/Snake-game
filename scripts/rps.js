import { resurrectCheck } from './snake.js';

// 當文件準備好時執行
$(document).ready(function () {
  // 當玩家點擊移動按鈕時執行遊戲
  $(".js-move-button").click(e => playGame(e.currentTarget.dataset.playMove));
})

// 遊戲運行的函數
function playGame(playerMove) {
  // 電腦選擇拳的動作
  const computerMove = pickComputerMove();
  // 計算結果
  const result = calculateResult(playerMove, computerMove);
  // 重生處理
  resurrect(result);
  // 更新遊戲UI
  updateGameUI(playerMove, computerMove, result);
}

// 計算遊戲結果的函數
function calculateResult(playerMove, computerMove) {
  // 定義拳的勝負規則
  const rules = {
    Rock: { beats: "Scissors", losesTo: "Paper" },
    Paper: { beats: "Rock", losesTo: "Scissors" },
    Scissors: { beats: "Paper", losesTo: "Rock" }
  };

  // 判斷結果並返回
  if (playerMove === computerMove) return "Tie";
  else if (rules[playerMove].beats === computerMove) return "You win";
  else return "You lose";
}

// 重生處理的函數
function resurrect(result) {
  // 如果玩家贏了，則執行重生處理
  if (result === 'You win') resurrectCheck(true);
  // 如果玩家輸了，則執行重生處理
  else if (result === 'You lose') resurrectCheck(false);
  // 如果是平手，則彈出提示
  else setTimeout(() => alert("平手！再試一次"), 500);
}

// 電腦選擇拳的函數
function pickComputerMove() {
  // 定義可選擇的拳
  const moves = ['Rock', 'Paper', 'Scissors'];
  // 隨機選擇一個拳並返回
  return moves[Math.floor(Math.random() * moves.length)];
}

// 更新遊戲UI的函數
function updateGameUI(playerMove, computerMove, result) {
  // 顯示遊戲結果區塊
  $(".result-wrap").css("display", "block");
  // 更新結果顯示
  $('.js-result').html(result);
  // 顯示玩家和電腦的拳圖示
  $('.js-move').html(`You <img src="img/${playerMove}-emoji.png" alt="" class="move-icon"> VS. <img src="img/${computerMove}-emoji.png" alt="" class="move-icon"> Computer`);
}
