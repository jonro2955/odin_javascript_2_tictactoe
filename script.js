"use strict";

const Board = (() => {

  let board = ["", "", "", "", "", "", "", "", ""];
  const grid = document.querySelectorAll(".cell");

  function setMark(index, mark){
      board[index] = mark;
      grid[index].textContent = mark;
  };

  function getBoard(){
    return board;
  };

  function getEmptyCells(){
    let arr = [];
    board.forEach((val, i)=>{
      if(val === ""){
        arr.push(i);
      }
    });
    return arr;
  }

  function highlightCell(index){
    grid[index].classList.add("winCell");
  }

  function clear(){
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
      grid[i].textContent = "";
      grid[i].classList.remove("winCell");
    }
  };

  function checkBoardFull(){
    let returnBool = true;
    board.forEach(val => {
      if(val === ""){
        returnBool = false;
      }
    });
    return returnBool;
  }

  return {grid, setMark, getBoard, getEmptyCells, highlightCell, clear, checkBoardFull};

})();


const Settings = (() => {

  let mode = "VS Human";   //defaults
  let playerXSign = "X"; 
  let playerOSign = "O"; 
  let level = "EASY"; 
  let buttonsOn = true;
  const modeBtns = document.querySelectorAll(".modeBtn");
  const levelBtns = document.querySelectorAll(".levelBtn");
  const signBtns = document.querySelectorAll(".signBtn");

  function getMode(){
    return mode;
  };

  function getPlayerXSign(){
    return playerXSign;
  };

  function getPlayerOSign(){
    return playerOSign;
  }

  function getlevel(){
    return level;
  };

  function buttonsAreOn(){
    return buttonsOn;
  };

  function activateBtns(){
    modeBtns.forEach(btn => {
      btn.addEventListener("click", activateMode);
    });
    levelBtns.forEach(btn => {
      btn.addEventListener("click", activateLevel);
    });
    signBtns.forEach(btn => {
      btn.addEventListener("click", activateSign);
    });
    document.getElementById("settingsDiv").style.opacity = "1";
    buttonsOn = true;
  }

  function deActivateBtns(){
    modeBtns.forEach(btn => {
      btn.removeEventListener("click", activateMode);
    });
    levelBtns.forEach(btn => {
      btn.removeEventListener("click", activateLevel);
    });
    signBtns.forEach(btn => {
      btn.removeEventListener("click", activateSign);
    });
    document.getElementById("settingsDiv").style.opacity = "0.5";
    buttonsOn = false;
  }

  function activateMode(e){
    mode = e.target.textContent;
    if(mode === "VS Human"){
      document.getElementById("compMode").style.display = "none";
    }
    if(mode === "VS Computer"){
      document.getElementById("compMode").style.display = "flex";
      alert("This mode is under development");
    }
    e.target.style.backgroundColor = "aquamarine";
    modeBtns.forEach(btn => {
      if(btn.textContent != mode){
        btn.style.backgroundColor = "white";
      }; 
    });  
  }

  function activateLevel(e){
    level = e.target.textContent;
    e.target.style.backgroundColor = "aquamarine";
    levelBtns.forEach(btn => {
      if(btn.textContent != level){
        btn.style.backgroundColor = "white";
      }; 
    });  
  }

  function activateSign(e){
    if(e.target.textContent === "O"){
      /*
      Board.setMark(AI.nextMove, playerXSign);
      GameLogic.switchCurrentPlayer();
      */
    }
    e.target.style.backgroundColor = "aquamarine";
    signBtns.forEach(btn => {
      if(btn.textContent != e.target.textContent){
        btn.style.backgroundColor = "white";
      }; 
    });  
  }

  activateBtns();

  return {getMode, getPlayerXSign, getPlayerOSign, getlevel, buttonsAreOn, activateBtns, deActivateBtns};

})();


const Player = (sign) => {

  this.sign = sign;

  function getSign(){
    return sign;
  };

  return {getSign};

};


const GameLogic = (() => {

  let Player1 = Player(Settings.getPlayerXSign());
  let Player2 = Player(Settings.getPlayerOSign());  
  let currentPlayer = Player1;
  let winningSign; 
  let winningCells = []; 
  const winSets = [ 
    [0,1,2], 
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  function checkWin(board, playerSign){
    let playerCells = [];
    let returnBool = false;
    board.forEach((val, index) => {
      if(val === playerSign) {
        playerCells.push(index);
      }
    });
    winSets.forEach(set => {
      if(set.every(num => playerCells.includes(num))){
        winningSign = playerSign;
        winningCells = set; 
        returnBool = true;
      }; 
    });
    return returnBool;
  }
  
  function displayWin(playerSign, winningCells){
    displayMessage(`${playerSign} Wins! Game Over.`);
    winningCells.forEach(i => Board.highlightCell(i));
  }

  function announceTie(){
    displayMessage(`It's a Tie. Game Over.`);
  }

  function switchCurrentPlayer(){
    if(currentPlayer === Player1){
      currentPlayer = Player2;
      displayMessage("O's Turn");
    } else {
      currentPlayer = Player1;
      displayMessage("X's Turn");
    }
  }

  function displayMessage(str) {
    document.getElementById("message").textContent = str;
  };
  
  const grid = document.querySelectorAll(".cell");
  grid.forEach(cell => {
    cell.addEventListener("click", playRound);
  });
  function playRound(e){
    if(e.target.textContent != "") return;
    if(Settings.buttonsAreOn()) Settings.deActivateBtns();
    switch(Settings.getMode()){
      case "VS Human":
        Board.setMark(e.target.dataset.key, currentPlayer.getSign());
        if(checkWin(Board.getBoard(), currentPlayer.getSign())){
          displayWin(currentPlayer.getSign(), winningCells);
          grid.forEach(cell => {
            cell.removeEventListener("click", playRound);
          });
        }else if(Board.checkBoardFull()){
          announceTie();
          grid.forEach(cell => {
            cell.removeEventListener("click", playRound);
          }); 
        }else{
          switchCurrentPlayer();
        }    
        return;
      case "VS Computer": 
        /*
        Board.setMark(e.target.dataset.key, currentPlayer.getSign());
        evaluateAndSwitch();
        //delay animation
        Board.setMark(Ai.nextMove(), currentPlayer.getSign());
        evaluateAndSwitch();
        */
    }
  }


  const restartBtn = document.getElementById("restartBtn");
  restartBtn.addEventListener("click", () => {
    Board.clear();
    Settings.activateBtns();
    grid.forEach(cell => {
      cell.addEventListener("click", playRound);
    });
    switch(Settings.getMode()){
      case "VS Human":
        currentPlayer = Player1;
        displayMessage(`${currentPlayer.getSign()}'s Turn`); 
        return;
      case "VS Computer":
        /*
        incomplete
        */
    }
  });

  return {switchCurrentPlayer};

})();







const Ai = (() => {


  function minmax(board, player){
    let emptySpots = Board.getEmptyCells();

  }


  function nextMove(){
    let move;
    let difficulty = Settings.getlevel();
    let board = Board.getBoard();
    //Use board and 4 different difficulty levels to change cellNumber
    return move;
  };










  return {nextMove}

})();