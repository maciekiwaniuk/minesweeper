import UserData from "../minesweeper/user_data.js";

export default class Minesweeper {
    constructor() {
        this.userData = new UserData();

        this.boardSize = this.getBoardSize();
        this.bombsAmount = this.getBombsAmount();
        this.gameBoardStructure = this.getGameBoardStructure();

        this.restartGame();
        this.assignEvents();
    }

    /**
     * Assign specific events to specific elements
     */
    assignEvents() {
        const self = this;

        document.getElementById('new-game-button').addEventListener('click', () => {
            self.restartGame();
        });
        
        
    }

    /**
     * Assign click on field event
     */
    assignClickEventOnFields() {
        const boardFields = document.querySelectorAll('.board-field');
        boardFields.forEach((field) => {
            field.addEventListener('click', () => {
                this.handleClickOnFieldEvent(field);
            });
        });
    }

    /**
     * Initialize board
     */
    initializeBoard() {
        const self = this;

        const data = this.getUserData();
        const boardArea = this.getBoardAreaElement();
        const board = this.getBoardElement();

        const boardAreaClassName = data.selectedLevel + '-board-area';
        const boardClassName = data.selectedLevel + '-board';
        const fieldClassName = data.selectedLevel + '-field';

        boardArea.classList.add(boardAreaClassName);
        board.classList.add(boardClassName);

        for (let x = 0; x < self.boardSize; x++) {
            for (let y = 0; y < self.boardSize; y++) {
                const field = document.createElement('div');
                field.setAttribute('data-field-x', x);
                field.setAttribute('data-field-y', y);
                field.classList.add(fieldClassName);
                field.classList.add('board-field');
                field.classList.add('center-verically');
                field.innerHTML = this.gameBoardStructure[x][y];
                board.appendChild(field);
            }
        }
    }

    /**
     * Return data from userData class instance
     */
    getUserData() {
        return this.userData.getUserDataCookieValue();
    }

    /**
     * Return empty board-area element
     */
    getBoardAreaElement() {
        const boardArea = document.getElementById('board-area');
        boardArea.classList.remove('beginner-board-area')
        boardArea.classList.remove('intermediate-board-area')
        boardArea.classList.remove('expert-board-area')
        boardArea.classList.remove('real-saper-board-area')
        return boardArea;
    }

    /**
     * Return empty board element
     */
    getBoardElement() {
        const board = document.getElementById('board');
        board.innerHTML = '';
        return board;
    }

    /**
     * Initialize game
     */
    restartGame() {
        this.refreshUserData();
        this.initializeBoard();
        this.assignClickEventOnFields();
    }

    /**
     * Refresh user data
     */
    refreshUserData() {
        this.boardSize = this.getBoardSize();
        this.bombsAmount = this.getBombsAmount();
    }

    /**
     * Handle click on field event
     */
    handleClickOnFieldEvent(field) {
        console.log(field);
    }

    /**
     * Return board size
     */
    getBoardSize() {
        const data = this.getUserData();
        switch (data.selectedLevel) {
            case 'beginner':     return 10;
            case 'intermediate': return 12;
            case 'expert':       return 16;
            case 'real-saper':   return 20;
        }
    }

    /**
     * Return bombs amount
     */
    getBombsAmount() {
        const data = this.getUserData();
        switch (data.selectedLevel) {
            case 'beginner':     return 10;
            case 'intermediate': return 20;
            case 'expert':       return 30;
            case 'real-saper':   return 40;
        }
    }

    /**
     * 
     */
    getGameBoardStructure() {
        const self = this;

        var generatedUniqueBombPositions = 0;
        const gameBoardStructure = [];

        // generate two dimensional array - empty board structure
        for (let x = 0; x < self.boardSize; x++) {
            gameBoardStructure[x] = [];
            for (let y = 0; y < self.boardSize; y++) {
                gameBoardStructure[x][y] = 0;
            }
        }

        // fill board structure with specified amount of bombs
        while (generatedUniqueBombPositions != this.bombsAmount) {
            let randomBombPositionX = Math.floor(Math.random() * self.boardSize);
            let randomBombPositionY = Math.floor(Math.random() * self.boardSize);

            if (gameBoardStructure[randomBombPositionX][randomBombPositionY] != 'mine') {
                gameBoardStructure[randomBombPositionX][randomBombPositionY] = 'mine';
                generatedUniqueBombPositions += 1;
            }
        }

        // fill board structure with numbers which means amount of opposite fields that contain bomb
        for (let x = 0; x < self.boardSize; x++) {
            for (let y = 0; y < self.boardSize; y++) {

                // [x-1][y-1]  [x-1][y]  [x-1][y+1]
                // [x][y-1]      bomb    [x][y+1]
                // [x+1][y-1]  [x+1][y]  [x+1][y+1]

                // field contains bomb
                if (gameBoardStructure[x][y] == 'mine') {
                    // increase amount of bombs opposite field in specific field

                    // first column
                    if (x - 1 >= 0 && y - 1 >= 0 && gameBoardStructure[x-1][y-1] != 'mine') gameBoardStructure[x-1][y-1] += 1;
                    if (y - 1 >= 0 && gameBoardStructure[x][y-1] != 'mine') gameBoardStructure[x][y-1] += 1;
                    if (x + 1 < self.boardSize && y - 1 >= 0 && gameBoardStructure[x+1][y-1] != 'mine') gameBoardStructure[x+1][y-1] += 1;

                    // second column
                    if (x - 1 >= 0 && y >= 0 && gameBoardStructure[x-1][y] != 'mine') gameBoardStructure[x-1][y] += 1;
                    if (x + 1 < self.boardSize && y >= 0 && gameBoardStructure[x+1][y] != 'mine') gameBoardStructure[x+1][y] += 1;

                    // third column
                    if (x - 1 >= 0 && y + 1 < self.boardSize && gameBoardStructure[x-1][y+1] != 'mine') gameBoardStructure[x-1][y+1] += 1;
                    if (y + 1 < self.boardSize && gameBoardStructure[x][y+1] != 'mine') gameBoardStructure[x][y+1] += 1;
                    if (x + 1 < self.boardSize && y + 1 < self.boardSize && gameBoardStructure[x+1][y+1] != 'mine') gameBoardStructure[x+1][y+1] += 1;
                }
            }
        }

        console.log(gameBoardStructure);

        return gameBoardStructure;
    }

    /**
     * Check if coordinates of field opposite to bomb is not behind board
     */
    drawOnFields() {
        
    }

}

