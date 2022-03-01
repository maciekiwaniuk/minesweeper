import Translations from "../scripts/translations.js";
import Minesweeper from "../scripts/minesweeper/minesweeper.js";

class Main {
    constructor() {
        this.translations = new Translations();
        this.minesweeper = new Minesweeper();
    }

}

const main = new Main();
