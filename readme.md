# Tic Tac Toe

# [Live Site](https://jonro2955.github.io/odin_javascript_2_tictactoe/)

This is a web based tic tac toe game with AI. The app is built using HTML, CSS and JavaScript. The user can play against the computer or with another human player by taking turns using the mouse. The computer player with artificial intelligence was implemented using the minimax algorithm in JavaScript. The user can select from 3 difficulty levels when playing against the computer. 

Difficulty levels are achieved by assigning each level a percentage threshold number between 0 and 100. 0 is assigned to Easy, 50 is assigned to Medium and 100 is assigned to Hard. Each time the computer plays, it generagtes a random number between 0 and 100, and if that number is below the difficulty threshold, the computer uses the minimax algorithm to make the best move possible. If it is above the threshold, the computer uses the algorithm in reverse to make a sub-optimal move.  

The key lessons from this project includes creatively setting up the objects according to the requirements and organizing code using JS modules with Webpack imports/exports. The most exciting part was stepping through each step of the minimax algorithm, adapting it into my code, and testing to see that it works! 

<hr/>


### Focus Areas
- JavaScript module patterns and IIFE's 
- Factory functions
- Closures and namespacing.
- Rendering data structures into DOM
- DOM events
- Minimax analysis and implementation

### Tools 
- Webpack
- Prettier
- Vanilla JavaScript
 
### Acknowledgements

[The Odin Project](https://www.theodinproject.com/)

### License

[ISC](https://opensource.org/licenses/ISC)
