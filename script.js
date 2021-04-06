"use strict";

/**Board module */
const Board = (() => {

  let board = ["", "", "", "", "", "", "", "", ""];
  const grid = document.querySelectorAll(".cell");

  function setMark(index, mark){
    if(board[index] === ""){
      board[index] = mark;
      grid[index].textContent = mark;
    }
  };

  function getBoard(){
    return board;
  };

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
    if(board.some(x => x === "")){
      return false;
    }else{
      return true;
    };
  }

  return {grid, setMark, getBoard, highlightCell, clear, checkBoardFull};

})();


/**Settings module */
const Settings = (() => {

  let mode = "Player VS Human";  
  let buttonsOn = true;
  const modeBtns = document.querySelectorAll(".modeBtn");
  const signBtns = document.querySelectorAll(".signBtn");

  function getMode(){
    return mode;
  };

  function buttonsAreOn(){
    return buttonsOn;
  };

  function activateBtns(){
    modeBtns.forEach(btn => {
      btn.addEventListener("click", activateMode);
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
    signBtns.forEach(btn => {
      btn.removeEventListener("click", activateSign);
    });
    document.getElementById("settingsDiv").style.opacity = "0.5";
    buttonsOn = false;
  }

  function activateMode(e){
    mode = e.target.textContent;
    if(mode === "Player VS Human"){
      document.getElementById("compMode").style.display = "none";
    }
    if(mode === "Player VS Computer"){
      document.getElementById("compMode").style.display = "flex";
    }
    e.target.style.backgroundColor = "aquamarine";
    modeBtns.forEach(btn => {
      if(btn.textContent != mode){
        btn.style.backgroundColor = "white";
      }; 
    });  
  }

  function activateSign(e){
    //the only instance where a game move is made outside of the Game module
    if(e.target.textContent === "O"){
      Game.displayMessage("AI Computing move...");
      setTimeout(function(){ 
        let currentBoard = Board.getBoard();
        let currentPlayerSign = Game.getCurrentPlayer().getSign();
        let aiMove = Ai.minimax(currentBoard, currentPlayerSign).index;
        Board.setMark(aiMove, currentPlayerSign);
        Game.checkAndSwitch();  
      }, 500);
    }
    e.target.style.backgroundColor = "aquamarine";
    signBtns.forEach(btn => {
      if(btn.textContent != e.target.textContent){
        btn.style.backgroundColor = "white";
      }; 
    });  
  }

  activateBtns();

  return {getMode, buttonsAreOn, activateBtns, deActivateBtns};

})();


/**Ai module */
const Ai = (() => {

  function getCompSign(){
    return Game.getCurrentPlayer().getSign();
  }

  function getOpponentSign(){
    return Game.getCurrentOpponent().getSign();
  }

  function getEmptyCellIndices(boardArray){
    let myArray = [];
    boardArray.forEach((val, i)=>{
      if(val === ""){
        myArray.push(i);
      }
    });
    return myArray;
  }

  /**The minimax AI function, given a 9 cell tic-tac-toe array in any state,  
   * and a player's sign, returns a "move" object containing: 
   * (1) An array index number for the player's next best move, and 
   * (2) A move score used to rank the move against other possible moves.
   * It creates this by evaluating the endgame results of every possible combination 
   * of moves through a recursive algorithm which contunously makes a hypothetical 
   * move in an empty cell and then makes a recursive call to itself using the newly
   * altered copy of the board and the opposing player's sign until either a 
   * win/loss/tie occurs. The resulting endgame state is used to assign points to the 
   * initial moves, and the move with the best score is returned. Return only the  
   * index move number using the following sample call:
   * Ai.minimax(newBoard, newSign).index 
   * */
  function minimax(newBoard, newSign){
    //create an array containing all empty cell index numbers of the given newBoard
    let emptyCellIndices = getEmptyCellIndices(newBoard);
    //check for terminal states and return a corresponding score
    if (Game.checkWin(newBoard, newSign)){
      return {score:10};
    }
    else if (Game.checkWin(newBoard, getOpponentSign())){
      return {score:-10};
    }
    else if (emptyCellIndices.length === 0){
      return {score:0};
    }
    //create an empty array to hold the possible moves on the current board
    let movesArray = [];
    //loop through each empty cell indices
    for (let i = 0; i < emptyCellIndices.length; i++){
      //for each empty cell, create an object called move 
      let move = {};
      //store the index number of the current empty cell inside move{}
      move.index = emptyCellIndices[i];
      //then set the empty cell of newBoard to newSign
      newBoard[move.index] = newSign;
      /*using this newly modified newBoard, recursively call minimax with 
      the opponent's sign and insert the resulting score into the move object as 
      a property called score*/
      if (newSign == getCompSign()){
        let result = minimax(newBoard, getOpponentSign());
        move.score = result.score;
      }
      else{
        let result = minimax(newBoard, getCompSign());
        move.score = result.score;
      }
      //revert the cell back to empty
      newBoard[move.index] = "";
      //push the current move object into movesArray
      movesArray.push(move);
    }
    //loop over movesArray. If it is the computer's turn, save the move with the highest score
    let bestMoveIndex;
    if(newSign === getCompSign()){
      let bestScore = -100;
      for(let i = 0; i < movesArray.length; i++){
        if(movesArray[i].score > bestScore){
          bestScore = movesArray[i].score;
          bestMoveIndex = i;
        }
      }
    }else{
      // else, save the move with the lowest score
      let bestScore = 100; 
      for(let i = 0; i < movesArray.length; i++){
        if(movesArray[i].score < bestScore){
          bestScore = movesArray[i].score;
          bestMoveIndex = i;
        }
      }
    }
    //Finally, return the chosen move object from the movesArray array
    return movesArray[bestMoveIndex];
  }

  return {minimax};

})();


/**Player module */
const Player = (sign) => {

  this.sign = sign;

  function getSign(){
    return sign;
  };

  return {getSign};

};


/**Game module */
const Game = (() => {

  let playerX = Player("X");
  let playerO = Player("O");  
  let currentPlayer = playerX;
  let currentOpponent = playerO;
  let winningCells = []; 

  function getCurrentPlayer(){
    return currentPlayer;
  }

  function getCurrentOpponent(){
    return currentOpponent;
  }

  function checkWin(board, playerSign){
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
    let playerCells = [];
    let result = false;
    board.forEach((val, index) => {
      if(val === playerSign) {
        playerCells.push(index);
      }
    });
    winSets.forEach(set => {
      if(set.every(num => playerCells.includes(num))){
        winningCells = set; 
        result = true;
      }; 
    });
    return result;
  }
  
  function displayWin(playerSign, winningCells){
    displayMessage(`${playerSign} Wins! Game Over.`);
    winningCells.forEach(i => Board.highlightCell(i));
  }

  function switchCurrentPlayer(){
    if(currentPlayer === playerX){
      currentPlayer = playerO;
      currentOpponent = playerX;
      displayMessage("O's Turn");
    } else {
      currentPlayer = playerX;
      currentOpponent = playerO;
      displayMessage("X's Turn");
    }
  }

  function displayMessage(str) {
    document.getElementById("message").textContent = str;
  };

  function disableGrid(){
    grid.forEach(cell => {
      cell.removeEventListener("click", playRound);
    });
  }

  function checkAndSwitch(){
    if(checkWin(Board.getBoard(), currentPlayer.getSign())){
      displayWin(currentPlayer.getSign(), winningCells);
      disableGrid();
    }else if(Board.checkBoardFull()){
      displayMessage(`It's a Tie. Game Over.`);
      disableGrid();
    }else{
      switchCurrentPlayer();
    }    
  }

  //the board (the "grid") click listener setup
  const grid = document.querySelectorAll(".cell");
  grid.forEach(cell => {
    cell.addEventListener("click", playRound);
  });

  //the main game flow 
  function playRound(e){
    if(e.target.textContent != "") return;
    if(Settings.buttonsAreOn()) Settings.deActivateBtns();
    switch(Settings.getMode()){
      case "Player VS Human":
        Board.setMark(e.target.dataset.key, currentPlayer.getSign());
        checkAndSwitch();        
        return;
      case "Player VS Computer": 
        Board.setMark(e.target.dataset.key, currentPlayer.getSign());
        checkAndSwitch(); 
        displayMessage("AI Computing move...");
        setTimeout(function(){ 
          let aiMove = Ai.minimax(Board.getBoard(), currentPlayer.getSign()).index;
          Board.setMark(aiMove, currentPlayer.getSign());     
          checkAndSwitch();  
        }, 500);
    }
  }

  //restart button
  const restartBtn = document.getElementById("restartBtn");
  restartBtn.addEventListener("click", () => {
    Board.clear();
    Settings.activateBtns();
    grid.forEach(cell => {
      cell.addEventListener("click", playRound);
    });
    switch(Settings.getMode()){
      case "Player VS Human":
        currentPlayer = playerX;
        displayMessage(`${currentPlayer.getSign()}'s Turn`); 
        return;
      case "Player VS Computer":
        if(currentPlayer === playerX){ 
          displayMessage(`${currentPlayer.getSign()}'s Turn`);
          document.getElementById("xBtn").style.backgroundColor = "aquamarine"
          document.getElementById("oBtn").style.backgroundColor = "white"
        }else{
          switchCurrentPlayer();
          document.getElementById("xBtn").style.backgroundColor = "aquamarine"
          document.getElementById("oBtn").style.backgroundColor = "white"
        }
    }
  });

  return {getCurrentPlayer, getCurrentOpponent, checkAndSwitch, switchCurrentPlayer, checkWin, displayMessage};

})();