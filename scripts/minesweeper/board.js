export default class Board {
    constructor(userData) {
        this.data = userData.getUserDataCookieValue();

        this.setBoardSize();
        this.setBoardFields();
    }

    /**
     * Set board size
     */
    setBoardSize() {
        const boardArea = document.getElementById('board-area');
        const board = document.getElementById('board');

        if (this.data.selectedLevel == 'beginner') {
            boardArea.classList.add('beginner-board-area');
            board.classList.add('beginner-board');

        } else if (this.data.selectedLevel == 'intermediate') {
            boardArea.classList.add('intermediate-board-area');
            board.classList.add('intermediate-board');

        } else if (this.data.selectedLevel == 'expert') {
            boardArea.classList.add('expert-board-area');
            board.classList.add('expert-board');

        } else if (this.data.selectedLevel == 'real-saper') {
            boardArea.classList.add('real-saper-board-area');
            board.classList.add('real-saper-board');
        }
    }

    /**
     * Set specific amount of board fields
     */
    setBoardFields() {
        const board = document.getElementById('board');
        var fieldsAmount = 0;
        var fieldClassName = '';

        if (this.data.selectedLevel == 'beginner') {
            fieldsAmount = 10;
            fieldClassName = 'beginner-field';
        } else if (this.data.selectedLevel == 'intermediate') {
            fieldsAmount = 12;
            fieldClassName = 'intermediate-field';
        } else if (this.data.selectedLevel == 'expert') {
            fieldsAmount = 16;
            fieldClassName = 'expert-field';
        } else if (this.data.selectedLevel == 'real-saper') {
            fieldsAmount = 20;
            fieldClassName = 'real-saper-field';
        }

        for (let x = 0; x < fieldsAmount; x++) {
            for (let y = 0; y < fieldsAmount; y++) {
                const field = document.createElement('div');
                field.setAttribute('data-field-x', x);
                field.setAttribute('data-field-y', y);
                field.classList.add(fieldClassName);
                field.classList.add('board-field');
                board.appendChild(field);
            }
        }
    }
}