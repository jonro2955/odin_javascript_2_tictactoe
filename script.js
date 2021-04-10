"use strict";

/*******************************************************************************
 * Board Module  
 *******************************************************************************/
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

  return {setMark, getBoard, highlightCell, clear, checkBoardFull};

})();


/*******************************************************************************
 * Settings Module  
 *******************************************************************************/
 const Settings = (() => {

  let mode = "Player VS Human"; 
  let level = "MED" 
  let humanSign = "X";
  let buttonsOn = true;
  const modeBtns = document.querySelectorAll(".modeBtn");
  const levelBtns = document.querySelectorAll(".levelBtn");
  const signBtns = document.querySelectorAll(".signBtn");

  function getMode(){
    return mode;
  };

  function getLevel(){
    return level;
  };

  function getHumanSign(){
    return humanSign;
  }

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
    Sounds.playClickSound();
    mode = e.target.textContent;
    Game.resetCurrentPlayerToX();
    if(mode === "Player VS Human"){
      Game.displayMessage(`Player ${Game.getCurrentPlayer().getSign()}'s Turn`);
      document.getElementById("compMode").style.display = "none";
    }
    if(mode === "Player VS Computer"){
      Game.displayMessage("Your Turn");
      document.getElementById("compMode").style.display = "flex";
    }
    e.target.style.backgroundColor = "aquamarine";
    modeBtns.forEach(btn => {
      if(btn.textContent != mode){
        btn.style.backgroundColor = "white";
      }; 
    });  
  }

  function activateLevel(e){
    Sounds.playClickSound();
    level = e.target.textContent;
    e.target.style.backgroundColor = "aquamarine";
    levelBtns.forEach(btn => {
      if(btn.textContent != level){
        btn.style.backgroundColor = "white";
      }; 
    });  
  }

  function activateSign(e){
    Sounds.playClickSound();
    humanSign = e.target.textContent;
    //the only place where a move execution is made outside of the Game module
    if(e.target.textContent === "O"){
      if(Settings.buttonsAreOn()) Settings.deActivateBtns();
      Game.humanSelectedO();
      Game.displayMessage("AI Computing move...");
      setTimeout(function(){ 
        Ai.compMove();
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

  return {getMode, getLevel, getHumanSign, buttonsAreOn, activateBtns, deActivateBtns};

})();


/*******************************************************************************
 * AI Module  
 *******************************************************************************/
 const Ai = (() => {

  function getCompSign(){
    return Game.getCurrentPlayer().getSign();
  }

  function getOpponentSign(){
    return Game.getCurrentOpponent().getSign();
  }

  /*this should not be declared in the Board module because it needs 
  to be used recursively inside minimax() */ 
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
   * win/loss/tie occurs. The resulting endgame state is used to assign a score to the 
   * initial move, and at the end, the move with the best score is returned. 
   * https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37/
   * Here is a sample call to return only the board index number of the best move:
   * Ai.minimax(someBoard, someSign).index 
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

  /**compMove() uses minimax to make an automatic move for the computer player 
   * depending on the current difficulty settings. For difficulty MED,
   * minimax is used 50% of the time, and for the other 50% of the time, 
   * minimax is used in reverse with the opposite sign to make a dumb move.
   * */
  function compMove(){
    Sounds.playCompSound();
    //generate random integer 0-100
    let randomPercent = Math.floor(Math.random() * 101);
    //set difficulty level thresholds
    let percentThreshold; 
    switch(Settings.getLevel()){
      case "EASY":
        percentThreshold = 0;
        break;
      case "MED":
        percentThreshold = 50;
        break;
      case "HARD":
        percentThreshold = 100;
        break;
    }
    let aiMove;
    if(randomPercent < percentThreshold){
      //minimax for curent player in order to win
      aiMove = minimax(Board.getBoard(), Game.getCurrentPlayer().getSign()).index
      Board.setMark(aiMove, Game.getCurrentPlayer().getSign());
    } else {
      //minimax for curent opponent in order to lose
      aiMove = minimax(Board.getBoard(), Game.getCurrentOpponent().getSign()).index
      Board.setMark(aiMove, Game.getCurrentPlayer().getSign());
    }
  }

  return {compMove, minimax};

})();


/*******************************************************************************
 * Player Factory Function
 *******************************************************************************/
 const Player = (sign) => {

  this.sign = sign;

  function getSign(){
    return sign;
  };

  return {getSign};

};


/*******************************************************************************
 * Game Module
 *******************************************************************************/
 const Game = (() => {

  let playerX = Player("X");
  let playerO = Player("O");  
  let currentPlayer = playerX;
  let currentOpponent = playerO;
  let currentHumanPlayer = playerX;
  let currentComputerPlayer = playerO;
  let winningCells = []; 
  let gameOver = false;
  let quitDemo = false;
  const replayBtnDiv = document.getElementById("replayBtnDiv");
  const settingsDiv = document.getElementById("settingsDiv");
  const message = document.getElementById("message");
  const grid = document.querySelectorAll(".cell");
  const demoLabel = document.getElementById("demoLabel");

  const backToDemoDiv = document.getElementById("backToDemoDiv");
  backToDemoDiv.addEventListener("click", ()=>{
    location.reload();
    Sounds.playClickSound();
  });

  const beginBtn = document.getElementById("beginBtn");
  beginBtn.addEventListener("click", () => {
    Sounds.playClickSound();
    quitDemo = true;
    resetCurrentPlayerToX();
    beginBtn.style.display = "none";
    backToDemoDiv.style.display = "flex";
    replayBtnDiv.style.display = "flex";
    settingsDiv.style.display = "flex";
    message.style.display = "flex";
    message.textContent = "Player X's Turn";
    demoLabel.remove();
    Board.clear();
    Settings.activateBtns();
    grid.forEach(cell => {
      cell.addEventListener("click", playRound);
      cell.style.opacity = 1;
    });  
  });

  /*Demo Mode*/
  function demoMode () {
    setTimeout(function(){ 
      if(quitDemo){
        return;
      }
      Ai.compMove();        
      checkAndSwitch(); 
      if(gameOver){
        return;
      };
      demoMode();
    }, 500);
    setTimeout(function(){
      if(quitDemo){
        return;
      }  
      location.reload();
    }, 6000);
  }

  demoMode();

  function getCurrentPlayer(){
    return currentPlayer;
  }

  function getCurrentOpponent(){
    return currentOpponent;
  }

  function resetCurrentPlayerToX(){
    currentPlayer = playerX;
    currentOpponent = playerO;
  }

  function humanSelectedO(){
    currentHumanPlayer = playerO;
    currentComputerPlayer = playerX;
  }

  function humanBackToX(){
    currentHumanPlayer = playerX;
    currentComputerPlayer = playerO;
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
    winningCells.forEach(i => Board.highlightCell(i));
    switch(Settings.getMode()){
      case "Player VS Human":
        displayMessage(`${playerSign} Wins! Game Over.`);
        Sounds.playWinSound();
        return;
      case "Player VS Computer":
        if(playerSign === currentHumanPlayer.getSign()){
          displayMessage(`You Win! Game Over.`);  
          Sounds.playWinSound();
        }else if(playerSign === currentComputerPlayer.getSign()){
          displayMessage(`Computer Wins! Game Over.`);
          Sounds.playLoseSound();
        }
    }
  }

  function switchCurrentPlayer(){
    if(currentPlayer === playerX){
      currentPlayer = playerO;
      currentOpponent = playerX;
    } else {
      currentPlayer = playerX;
      currentOpponent = playerO;
    }
    switch(Settings.getMode()){
      case "Player VS Human":
        displayMessage(`Player ${currentPlayer.getSign()}'s Turn.`);
        return;
      case "Player VS Computer":
        if(currentPlayer.getSign() === currentHumanPlayer.getSign()){
          displayMessage(`Your Turn`);  
        }
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
      gameOver = true;
    }else if(Board.checkBoardFull()){
      displayMessage(`It's a Tie. Game Over.`);
      grid.forEach(cell => {
        cell.style.opacity = 0.5;
      });
      disableGrid();
      gameOver = true;
      Sounds.playTieSound();
    }else{
      switchCurrentPlayer();
    }    
  }


  /*The main game flow algorithm*/
  function playRound(e){
    Sounds.playMoveSound();
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
        if(!gameOver){
          displayMessage("AI Computing move...");
          setTimeout(function(){ 
            Ai.compMove();    
            checkAndSwitch();  
          }, 500);
        }
    }
  }

  //reset button
  const replayBtn = document.getElementById("replayBtn");
  replayBtn.addEventListener("click", () => {
    Sounds.playClickSound();
    gameOver = false;
    resetCurrentPlayerToX();
    humanBackToX();
    Board.clear();
    Settings.activateBtns();
    grid.forEach(cell => {
      cell.addEventListener("click", playRound);
      cell.style.opacity = 1;
    });
    switch(Settings.getMode()){
      case "Player VS Human":
        displayMessage(`Player ${currentPlayer.getSign()}'s Turn`); 
        return;
      case "Player VS Computer":
        displayMessage("Your Turn");
        document.getElementById("xBtn").style.backgroundColor = "aquamarine"
        document.getElementById("oBtn").style.backgroundColor = "white"
    }
  });

  return {
    getCurrentPlayer, 
    getCurrentOpponent, 
    checkAndSwitch, 
    switchCurrentPlayer, 
    checkWin, 
    displayMessage, 
    resetCurrentPlayerToX,
    humanSelectedO,
    humanBackToX
  };

})();


const Sounds = (() => {

  function playMoveSound(){
    const moveSound = document.getElementById("move");
    moveSound.currentTime = 0;
    moveSound.play();
  }

  function playWinSound(){
    const winSound = document.getElementById("win");
    winSound.currentTime = 0;
    winSound.play();
  }

  function playLoseSound(){
    const loseSound = document.getElementById("lose");
    loseSound.currentTime = 0;
    loseSound.play();
  }

  function playTieSound(){
    const tieSound = document.getElementById("tie");
    tieSound.currentTime = 0;
    tieSound.play();
  }

  function playCompSound(){
    const compSound = document.getElementById("comp");
    compSound.currentTime = 0;
    compSound.play();
  }

  function playClickSound(){
    const clickSound = document.getElementById("click");
    clickSound.currentTime = 0;
    clickSound.play();
  }

  return {playMoveSound, playWinSound, playLoseSound, playTieSound, playCompSound, playClickSound}
})();