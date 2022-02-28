import Translations from "../scripts/translations.js";

class Main {
    constructor() {
        this.translations = new Translations();
        this.initializeEvents();
    }

    /**
     * Assign specific events to specific elements
     */
    initializeEvents() {
        var self = this;

        // change language to polish
        document.getElementById('polish-flag').addEventListener('click', function() {
            self.translations.changeSelectedLanguage('pl');
        });
        // change language to english
        document.getElementById('english-flag').addEventListener('click', function() {
            self.translations.changeSelectedLanguage('en');
        });
    }
}

var main = new Main();
