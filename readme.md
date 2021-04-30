# odin_javascript_2_tictactoe

Preview: https://jonro2955.github.io/odin_javascript_2_tictactoe/ 

The second project from TOP's Full Stack JavaScript Curriculum focuses on using the JavaScript module pattern to program an interactive game app. The modular programming pattern achieves increased security through function closure and non-pollution of the global namespace.   

The game itself is a simple Tic-Tac-Toe game that allows the user to play against another human player by taking turns using the mouse, or against the computer, which utilizes the minimax algorithm. 

Since the minimax algorithm plays the perfect move every time, in order to make the computer "dumber" for lower difficulty levels, each difficulty level associates a percentage threshold number representing the chance of selecting a minimax move or a "reverse" minimax move that lets the human win instead. We then generate a random number between 0 and 100, and if that number is below the threshold, we use the normal minimax, and if it is above the threshold, we use the reverse minimax. The threshold is for EASY is 0, for MED it is 50 and for HARD it is 100.  

Project Instructions:

1. Set up your project with a HTML, CSS and Javascript files and get the Git repo all set up.

2. You’re going to store the gameboard as an array inside of a Gameboard object, so start there! Your players are also going to be stored in objects… and you’re probably going to want an object to control the flow of the game itself.
- Your main goal here is to have as little global code as possible. Try tucking everything away inside of a module or factory. Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. If you need multiples of something (players!), create them with factories.

3. Set up your HTML and write a JavaScript function that will render the contents of the gameboard array to the webpage (for now you can just manually fill in the array with "X"s and "O"s)

4. Build the functions that allow players to add marks to a specific spot on the board, and then tie it to the DOM, letting players click on the gameboard to place their marker. Don’t forget the logic that keeps players from playing in spots that are already taken!
- Think carefully about where each bit of logic should reside. Each little piece of functionality should be able to fit in the game, player or gameboard objects.. but take care to put them in “logical” places. Spending a little time brainstorming here can make your life much easier later!

5. Build the logic that checks for when the game is over! Should check for 3-in-a-row and a tie.

6. Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that congratulates the winning player!

7. Optional: If you’re feeling ambitious create an AI so that a player can play against the computer!
- Start by just getting the computer to make a random legal move.
- Once you’ve gotten that, work on making the computer smart. It is possible to create an unbeatable AI using the minimax algorithm (read about it here, some googling will help you out with this one)
- If you get this running definitely come show it off in the chatroom. It’s quite an accomplishment!
