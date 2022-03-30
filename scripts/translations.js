export default class Translations {
    constructor() {
        this.languageLocalStorageName = 'selected-language';
        this.defaultLanguage = 'en';
        this.selectedLanguage = this.getLanguageLocalStorageValue();

        this.setTextContentOfAllElements();
        this.assignEvents();
    }

    /**
     * Assign specific events to specific elements
     */
    assignEvents() {
        const self = this;

        // change language to polish
        document.getElementById('polish-flag').addEventListener('click', () => {
            self.changeSelectedLanguage('pl');
        });
        // change language to english
        document.getElementById('english-flag').addEventListener('click', () => {
            self.changeSelectedLanguage('en');
        });
    }

    /**
     * Create local storage with default english language
     */
    createDefaultLanguageLocalStorage() {
        localStorage.setItem(
            this.languageLocalStorageName,
            this.defaultLanguage
        );
    }

    /**
     * Create default language local storage if it doesnt exist
     */
    createDefaultLanguageLocalStorageIfNotExists() {
        const storage = localStorage.getItem(this.languageLocalStorageName);
        if (storage == null) {
            this.createDefaultLanguageLocalStorage();
        }
    }

    /**
     * Return value from language local storage
     */
    getLanguageLocalStorageValue() {
        this.createDefaultLanguageLocalStorageIfNotExists();
        return localStorage.getItem(this.languageLocalStorageName);
    }

    /**
     * Change selected language
     */
    changeSelectedLanguage(language) {
        localStorage.setItem(this.languageLocalStorageName, language);
        this.setTextContentOfAllElements();
    }

    /**
     * Return dictionary with translations of specific language
     */
    getTransPromiseDictOfSpecificLanguage(language) {
        return fetch('../translations/'+language+'/trans.json').then((response) => {
            return response.json();
        });
    }

    /**
     * Return Promise of dictionary with text content of selected language
     */
    getTranslationPromiseDict() {
        return this.getTransPromiseDictOfSpecificLanguage(
            this.getLanguageLocalStorageValue()
        );
    }
    
    /**
     * Set text content with selected language of all elements
     */
    setTextContentOfAllElements() {
        this.getTranslationPromiseDict().then((transDict) => {
            // title
            document.title = transDict.title;
            document.documentElement.setAttribute('lang', this.getLanguageLocalStorageValue());

            // header
            document.getElementById('header-text').textContent = transDict.header;

            // game info bar
            document.getElementById('level-of-difficulty-label').textContent = `${transDict.infoBar.levelOfDifficulty}:\xa0`;
            document.getElementById('amount-of-mines-label').textContent = `${transDict.infoBar.amountOfMines}:\xa0`;
            document.getElementById('personal-record-label').textContent = `${transDict.infoBar.personalRecord}:\xa0`;
            document.getElementById('game-time-label').textContent = `${transDict.infoBar.gameTime}:\xa0`;

            // level bar
            document.getElementById('new-game-button').textContent = `${transDict.levelBar.newGame}`;
            document.getElementById('beginner-level').textContent = `${transDict.difficultyLevels.beginner}`;
            document.getElementById('intermediate-level').textContent = `${transDict.difficultyLevels.intermediate}`;
            document.getElementById('expert-level').textContent = `${transDict.difficultyLevels.expert}`;
            document.getElementById('real-sapper-level').textContent = `${transDict.difficultyLevels.realSapper}`;

            // footer
            document.getElementById('footer-text').textContent = `${transDict.footer.author} - ${transDict.footer.text}`;
        });
    }

}