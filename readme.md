# Tic Tac Toe

This is a simple implementation of a tic tac toe game with AI.

[Live Site](https://jonro2955.github.io/odin_javascript_2_tictactoe/)

The computer player with artificial intelligence was implemented using the minimax algorithm in JavaScript. 

Difficulty levels are achieved by assigning each level a percentage threshold number between 0 and 100. 0 is assigned to Easy, 50 is assigned to Medium and 100 is assigned to Hard. Each time the computer plays, a random number between 0 and 100 is generated, and if that number is below the currently set difficulty threshold, the computer uses the minimax algorithm to make the best move given its current circumstances. If it is above the threshold, the computer uses a "reverse" minimax move that lets the human win instead.  

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
