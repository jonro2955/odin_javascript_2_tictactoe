# odin_javascript_2_tictactoe
https://jonro2955.github.io/odin_javascript_2_tictactoe/ 

This is the 2nd project in The Odin Project's Full Stack JavaScript Curriculum.    

It is a simple Tic-Tac-Toe game that allows the user to play against the computer or another human by taking turns.  

The computer's AI was implemented using a minimax algorithm in JavaScript that has been customized for this application. 

The various difficulty ratings are achieved in the following way. Since the minimax algorithm plays the perfect move every time, in order to create different difficulty levels, each level uses a percentage threshold number between 0 and 100. For EASY, this is 0. For MED, it is 50. And for HARD it is 100. Each time the computer plays, a random number between 0 and 100 is generated, and if that number is below the threshold for the currently selected difficulty level, the computer uses the minimax move. But if the random number is above the threshold, the computer uses a "reversed" minimax move that lets the human win instead.  

Focus Areas:
- JavaScript module patterns and IIFE's (Immediately Invoked Function Expressions)
- Factory functions
- Function closures and non-pollution of global namespace.
- Rendering data structures such as arrays into DOM interfaces
- DOM events
- Game logic
- Algorithmic analysis and implementation
