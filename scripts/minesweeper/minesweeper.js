import UserData from "../minesweeper/user_data.js";
import Translations from "../translations.js";

export default class Minesweeper {
    constructor() {
        this.userData = new UserData();
        this.translations = new Translations();

        this.initializeGameBoard();
        this.setContentOfLabels();
        this.assignEvents();
    }

    /**
     * Assign specific events to specific elements
     */
    assignEvents() {
        document.getElementById('new-game-button').addEventListener('click', () => {
            this.initializeGameBoard();
        });
    }

    /**
     * Set content of labels above game board
     */
    setContentOfLabels() {
        let data = this.getUserData();

        this.translations.getTranslationPromiseDict().then((promiseDict) => {
            let levelOfDifficultyValueDiv = document.getElementById('level-of-difficulty-value');
            let personalRecordValueDiv = document.getElementById('personal-record-value');
            switch (data.selectedLevel) {
                case 'beginner': {
                    levelOfDifficultyValueDiv.innerHTML = promiseDict.difficultyLevels.beginner;
                    personalRecordValueDiv.innerHTML = data.scoreRecord.beginner;
                } break;
                case 'intermediate': {
                    levelOfDifficultyValueDiv.innerHTML = promiseDict.difficultyLevels.intermediate;
                    personalRecordValueDiv.innerHTML = data.scoreRecord.intermediate;
                } break;
                case 'expert': {
                    levelOfDifficultyValueDiv.innerHTML = promiseDict.difficultyLevels.expert;
                    personalRecordValueDiv.innerHTML = data.scoreRecord.expert;
                } break;
                case 'real-sapper': {
                    levelOfDifficultyValueDiv.innerHTML = promiseDict.difficultyLevels.realSapper;
                    personalRecordValueDiv.innerHTML = data.scoreRecord.realSapper;
                } break;
            }
        });

        this.updateMinesLeftLabel();

        document.getElementById('game-time-value').innerHTML = 0;
    }

    /**
     * Return data from userData class instance
     */
    getUserData() {
        return this.userData.getUserDataLocalStorageValue();
    }

    /**
     * Return empty board-area element
     */
    getBoardAreaElement() {
        const boardArea = document.getElementById('board-area');
        boardArea.classList.remove('beginner-board-area')
        boardArea.classList.remove('intermediate-board-area')
        boardArea.classList.remove('expert-board-area')
        boardArea.classList.remove('real-sapper-board-area')
        return boardArea;
    }

    /**
     * Return empty board element
     */
    getBoardElement() {
        const board = document.getElementById('board');
        board.classList.remove('beginner-board');
        board.classList.remove('intermediate-board');
        board.classList.remove('expert-board');
        board.classList.remove('real-sapper-board');
        board.innerHTML = '';
        return board;
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
            case 'real-sapper':   return 20;
        }
    }

    /**
     * Return bombs amount
     */
    getBombsAmount() {
        const data = this.getUserData();
        switch (data.selectedLevel) {
            case 'beginner':     return 10;
            case 'intermediate': return 25;
            case 'expert':       return 35;
            case 'real-sapper':   return 50;
        }
    }

    /**
     * Return game board structure as filled two dimensional array
     */
     getGameBoardStructure(firstInitialField) {
        var generatedUniqueBombPositions = 0;
        const gameBoardStructure = [];
        let firstInitialFieldX = parseInt(firstInitialField.getAttribute('data-field-x'));
        let firstInitialFieldY = parseInt(firstInitialField.getAttribute('data-field-y'));

        // generate two dimensional array - empty board structure
        for (let x = 0; x < this.boardSize; x++) {
            gameBoardStructure[x] = [];
            for (let y = 0; y < this.boardSize; y++) {
                gameBoardStructure[x][y] = 0;
            }
        }

        // fill board structure with specified amount of bombs
        while (generatedUniqueBombPositions != this.bombsAmount) {
            let randomBombPositionX = Math.floor(Math.random() * this.boardSize);
            let randomBombPositionY = Math.floor(Math.random() * this.boardSize);

            if (gameBoardStructure[randomBombPositionX][randomBombPositionY] == 'mine') continue;

            // [x-1][y-1]         [x-1][y]          [x-1][y+1]
            // [x][y-1]      first initial field    [x][y+1]
            // [x+1][y-1]         [x+1][y]          [x+1][y+1]

            // prevent to generate bombs around initial field click

            // first column
            if (firstInitialFieldX - 1 == randomBombPositionX && firstInitialFieldY - 1 == randomBombPositionY) continue;
            if (firstInitialFieldX == randomBombPositionX && firstInitialFieldY - 1 == randomBombPositionY) continue;
            if (firstInitialFieldX + 1 == randomBombPositionX && firstInitialFieldY - 1 == randomBombPositionY) continue;

            // second column
            if (firstInitialFieldX - 1 == randomBombPositionX && firstInitialFieldY == randomBombPositionY) continue;
            if (firstInitialFieldX == randomBombPositionX && firstInitialFieldY == randomBombPositionY) continue;
            if (firstInitialFieldX + 1 == randomBombPositionX && firstInitialFieldY == randomBombPositionY) continue;

            // third column
            if (firstInitialFieldX - 1 == randomBombPositionX && firstInitialFieldY + 1 == randomBombPositionY) continue;
            if (firstInitialFieldX == randomBombPositionX && firstInitialFieldY + 1 == randomBombPositionY) continue;
            if (firstInitialFieldX + 1 == randomBombPositionX && firstInitialFieldY + 1 == randomBombPositionY) continue;

            gameBoardStructure[randomBombPositionX][randomBombPositionY] = 'mine';
            generatedUniqueBombPositions += 1;
        }

        // fill board structure with numbers which means amount of adjoin fields that contain bomb
        for (let x = 0; x < this.boardSize; x++) {
            for (let y = 0; y < this.boardSize; y++) {

                // [x-1][y-1]  [x-1][y]  [x-1][y+1]
                // [x][y-1]      bomb    [x][y+1]
                // [x+1][y-1]  [x+1][y]  [x+1][y+1]

                // field contains bomb
                if (gameBoardStructure[x][y] == 'mine') {
                    // increase amount of bombs nearby field

                    // first column
                    if (x - 1 >= 0 && y - 1 >= 0 && gameBoardStructure[x-1][y-1] != 'mine') gameBoardStructure[x-1][y-1] += 1;
                    if (y - 1 >= 0 && gameBoardStructure[x][y-1] != 'mine') gameBoardStructure[x][y-1] += 1;
                    if (x + 1 < this.boardSize && y - 1 >= 0 && gameBoardStructure[x+1][y-1] != 'mine') gameBoardStructure[x+1][y-1] += 1;

                    // second column
                    if (x - 1 >= 0 && y >= 0 && gameBoardStructure[x-1][y] != 'mine') gameBoardStructure[x-1][y] += 1;
                    if (x + 1 < this.boardSize && y >= 0 && gameBoardStructure[x+1][y] != 'mine') gameBoardStructure[x+1][y] += 1;

                    // third column
                    if (x - 1 >= 0 && y + 1 < this.boardSize && gameBoardStructure[x-1][y+1] != 'mine') gameBoardStructure[x-1][y+1] += 1;
                    if (y + 1 < this.boardSize && gameBoardStructure[x][y+1] != 'mine') gameBoardStructure[x][y+1] += 1;
                    if (x + 1 < this.boardSize && y + 1 < this.boardSize && gameBoardStructure[x+1][y+1] != 'mine') gameBoardStructure[x+1][y+1] += 1;
                }
            }
        }

        console.log(gameBoardStructure);
        return gameBoardStructure;
    }

    /**
     * Initialize board
     */
    initializeBoard() {
        const data = this.getUserData();
        const boardArea = this.getBoardAreaElement();
        const board = this.getBoardElement();

        const boardAreaClassName = `${data.selectedLevel}-board-area`;
        const boardClassName = `${data.selectedLevel}-board`;
        const fieldClassName = `${data.selectedLevel}-field`;

        boardArea.classList.add(boardAreaClassName);
        board.classList.add(boardClassName);

        for (let x = 0; x < this.boardSize; x++) {
            for (let y = 0; y < this.boardSize; y++) {
                const field = document.createElement('div');
                field.setAttribute('data-field-x', x);
                field.setAttribute('data-field-y', y);
                field.setAttribute('data-field-status', 'hidden');
                field.classList.add(fieldClassName);
                field.classList.add('board-field');
                board.appendChild(field);
            }
        }
    }

    /**
     * Return field element with specific coordinates
     */
    getFieldElement(data_field_x, data_field_y) {
        return document.querySelector(`[data-field-x="${data_field_x}"][data-field-y="${data_field_y}"]`);
    }

    /**
     * Return field with open attribute set to true
     */
    getFieldWithOpenStatus(field) {
        field.setAttribute('data-field-status', 'open');
        return field;
    }

    /**
     * Function that checks if specific field has been opened and checked,
     * if it hasn't been checked before it runs recursive checking untill it
     * will check every nearby field
     */
    handleSpecificFieldAndCheckNearbyAlso(row, column) {
        let field = this.getFieldElement(row, column);
        if (field.getAttribute('data-field-status') == 'open') return;
        this.fieldsToOpen.push(field);
        field.setAttribute('data-field-status', 'open');
        this.specifyFieldsToOpen(row, column)
    }

    /**
     * Open fields that has 0 bombs around specific field
     */
    specifyFieldsToOpen(row, column) {
        // [row-1][column-1]  [row-1][column]  [row-1][column+1]
        // [row][column-1]      empty field    [row][column+1]
        // [row+1][column-1]  [row+1][column]  [row+1][column+1]

        if (this.gameBoardStructure[row][column] != '0') return;

        // first column
        if (row - 1 >= 0 && column - 1 >= 0) this.handleSpecificFieldAndCheckNearbyAlso(row-1, column-1)
        if (column - 1 >= 0) this.handleSpecificFieldAndCheckNearbyAlso(row, column-1)
        if (row + 1 < this.boardSize && column - 1 >= 0) this.handleSpecificFieldAndCheckNearbyAlso(row+1, column-1)

        // second column
        if (row - 1 >= 0 && column >= 0) this.handleSpecificFieldAndCheckNearbyAlso(row-1, column);
        if (row + 1 < this.boardSize && column >= 0) this.handleSpecificFieldAndCheckNearbyAlso(row+1, column);

        // third column
        if (row - 1 >= 0 && column + 1 < this.boardSize) this.handleSpecificFieldAndCheckNearbyAlso(row-1, column+1)
        if (column + 1 < this.boardSize) this.handleSpecificFieldAndCheckNearbyAlso(row, column+1)
        if (row + 1 < this.boardSize && column + 1 < this.boardSize) this.handleSpecificFieldAndCheckNearbyAlso(row+1, column+1)
    }

    /**
     * Open fields to open
     */
    openFieldsToOpen() {
        this.fieldsToOpen.forEach((field) => {
            let x = field.getAttribute('data-field-x');
            let y = field.getAttribute('data-field-y');
            let amountOfBombsAroundField = this.gameBoardStructure[x][y];
            if (amountOfBombsAroundField != 0) {
                field.innerHTML = amountOfBombsAroundField;
            }
            field = this.getFieldWithOpenStatus(field);
            field.classList.add('board-field-open');

            this.openedFields += 1;
        });
    }

    /**
     * Initialize timer after first initial click
     */
    initializeGameTimer() {
        let gameTimeValueDiv = document.getElementById('game-time-value');
        let time = 0;

        this.clearGameTimer();

        this.timer = setInterval(() => {
            time += 1;
            gameTimeValueDiv.innerHTML = time;
        }, 1000);
    }

    /**
     * Clear game timer if exists
     */
    clearGameTimer() {
        if (this.timer != null) {
            clearInterval(this.timer);
        }
    }

    /**
     * Handle lose
     */
    handleLose() {
        console.log('lose');
    }

    /**
     * Handle win
     */
    handleWin() {
        console.log('win');
    }

    /**
     * Check if user won or lost
     */
    checkIfWon() {
        let boardSize = this.getBoardSize();
        let bombsAmount = this.getBombsAmount();
        let fieldsAmount = boardSize * boardSize;

        if (fieldsAmount - bombsAmount - this.openedFields == 0) {
            this.handleWin();
        }
    }

    /**
     * Initialize new game
     */
    initializeGame(initialField) {
        this.openedFields = 1;

        this.gameBoardStructure = this.getGameBoardStructure(initialField);
        this.gameBoardStructureGenerated = true;
        
        this.initializeGameTimer();
    }

    /**
     * Handle left click on field event - open field
     */
    handleLeftClickOnFieldEvent(field) {
        if (field.innerHTML == '🚩') return;

        // first initial click
        if (this.gameBoardStructureGenerated == false) {
            // generate and randomize game
            this.initializeGame(field);
        }

        let x = field.getAttribute('data-field-x');
        let y = field.getAttribute('data-field-y');
        let fieldContent = this.gameBoardStructure[x][y];
        
        if (fieldContent == 'mine') {
            field.innerHTML = '💣';
            this.handleLose();
        } else {
            let amountOfBombsAroundField = this.gameBoardStructure[x][y];
            if (amountOfBombsAroundField != 0) {
                field.innerHTML = amountOfBombsAroundField;
            }
            field = this.getFieldWithOpenStatus(field);
            // if field doesn't adjoin with any field with bomb - open adjoin fields
            if (amountOfBombsAroundField == 0) {
                // clear array with fields to open
                this.fieldsToOpen = [];
                this.specifyFieldsToOpen(parseInt(x), parseInt(y));
                this.openFieldsToOpen()
            }

            // check if user won
            this.checkIfWon();
        }

        this.openedFields += 1;
        field.classList.add('board-field-open');
    }

    /**
     * Handle right click on field event - mark flag on field
     */
    handleRightClickOnFieldEvent(field) {
        if (field.innerHTML == '🚩') {
            field.innerHTML = '';
            this.bombsLeft += 1;

        } else if (field.innerHTML == '' && field.getAttribute('data-field-status') != 'open') {
            field.innerHTML = '🚩';
            this.bombsLeft -= 1;
        }

        this.updateMinesLeftLabel()
    }

    /**
     * Assign click on field event
     */
    assignClickEventOnFields() {
        const boardFields = document.querySelectorAll('.board-field');
        boardFields.forEach((field) => {
            // left click
            field.addEventListener('click', (event) => {
                event.preventDefault();
                this.handleLeftClickOnFieldEvent(field);
            });
            // right click
            field.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                this.handleRightClickOnFieldEvent(field);
            });
        });
    }

    /**
     * Update mines left label
     */
    updateMinesLeftLabel() {
        let minesLeftDiv = document.getElementById('mines-left-value');
        minesLeftDiv.innerHTML = this.bombsLeft;
    }

    /**
     * Initialize game
     */
    initializeGameBoard() {
        this.gameBoardStructureGenerated = false;
        this.bombsLeft = this.getBombsAmount();

        this.boardSize = this.getBoardSize();
        this.bombsAmount = this.getBombsAmount();
        
        this.clearGameTimer();
        this.setContentOfLabels();
        this.translations.setTextContentOfPersonalRecordLabel();
        this.initializeBoard();
        this.assignClickEventOnFields();
    }
    
}

