import UserData from "../minesweeper/user_data.js";

export default class Minesweeper {
    constructor() {
        this.userData = new UserData();

        this.initializeGameBoard();
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
     * Return game board structure as filled two dimensional array
     */
     getGameBoardStructure(firstInitialField) {
        var generatedUniqueBombPositions = 0;
        const gameBoardStructure = [];
        let firstInitialFieldX = firstInitialField.getAttribute('data-field-x');
        let firstInitialFieldY = firstInitialField.getAttribute('data-field-y');

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

            if (
                    gameBoardStructure[randomBombPositionX][randomBombPositionY] != 'mine' &&
                    (firstInitialFieldX != randomBombPositionX || firstInitialFieldY != randomBombPositionY)
                ) 
            {
                gameBoardStructure[randomBombPositionX][randomBombPositionY] = 'mine';
                generatedUniqueBombPositions += 1;
            }
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
            field.innerHTML = amountOfBombsAroundField;
            field = this.getFieldWithOpenStatus(field);
            field.classList.add('board-field-open');
        });
    }

    /**
     * Handle left click on field event - open field
     */
    handleLeftClickOnFieldEvent(field) {
        if (field.innerHTML == '🚩') return;

        if (this.gameBoardStructureGenerated == false) {
            this.gameBoardStructure = this.getGameBoardStructure(field);
            this.gameBoardStructureGenerated = true;
        }

        let x = field.getAttribute('data-field-x');
        let y = field.getAttribute('data-field-y');
        let fieldContent = this.gameBoardStructure[x][y];
        
        if (fieldContent == 'mine') {
            field.innerHTML = '💣';
        } else {
            let amountOfBombsAroundField = this.gameBoardStructure[x][y];
            field.innerHTML = amountOfBombsAroundField;
            field = this.getFieldWithOpenStatus(field);
            // if field doesn't adjoin with any field with bomb - open adjoin fields
            if (amountOfBombsAroundField == 0) {
                // clear array with fields to open
                this.fieldsToOpen = [];
                this.specifyFieldsToOpen(parseInt(x), parseInt(y));
                this.openFieldsToOpen()
            }
        }
        field.classList.add('board-field-open');
    }

    /**
     * Handle right click on field event - mark flag on field
     */
    handleRightClickOnFieldEvent(field) {
        if (field.innerHTML == '🚩') field.innerHTML = '';
        else if (field.innerHTML == '') field.innerHTML = '🚩';
 
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
     * Initialize game
     */
    initializeGameBoard() {
        this.gameBoardStructureGenerated = false;

        this.boardSize = this.getBoardSize();
        this.bombsAmount = this.getBombsAmount();
        
        this.initializeBoard();
        this.assignClickEventOnFields();
    }
    
}

