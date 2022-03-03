import UserData from "../minesweeper/user_data.js";
import Board from "../minesweeper/board.js";

export default class Minesweeper {
    constructor() {
        this.userData = new UserData();
        this.board = new Board(this.userData);
        
    }

    /**
     * Assign specific events to specific elements
     */
    assignEvents() {
        const self = this;
    }

}

