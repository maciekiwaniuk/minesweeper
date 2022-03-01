export default class Translations {
    constructor() {
        this.languageCookieName = 'selected-language';
        this.defaultLanguage = 'en';
        this.selectedLanguage = this.getLanguageCookieValue();

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
     * Create cookie with default english language
     */
    createDefaultLanguageCookie() {
        Cookies.set(
            this.languageCookieName,
            this.defaultLanguage,
            { expires: 365 }
        );
    }

    /**
     * Create default language cookie if it doesnt exist
     */
    createDefaultLanguageCookieIfNotExists() {
        const cookie = Cookies.get(this.languageCookieName);
        if (cookie == null) {
            this.createDefaultLanguageCookie();
        }
    }

    /**
     * Return value from language cookie
     */
    getLanguageCookieValue() {
        this.createDefaultLanguageCookieIfNotExists();
        return Cookies.get(this.languageCookieName);
    }

    /**
     * Change selected language
     */
    changeSelectedLanguage(language) {
        Cookies.set(this.languageCookieName, language);
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
            this.getLanguageCookieValue()
        );
    }
    
    /**
     * Set text content with selected language of all elements
     */
    setTextContentOfAllElements() {
        this.getTranslationPromiseDict().then((transDict) => {
            // title
            document.title = transDict.title;
            document.documentElement.setAttribute('lang', this.getLanguageCookieValue());

            // header
            document.getElementById('header-text').textContent = transDict.header;

            // game info bar
            document.getElementById('level-of-difficulty-label').textContent = transDict.infoBar.levelOfDifficulty + ':';
            document.getElementById('amount-of-mines-label').textContent = transDict.infoBar.amountOfMines + ':';
            document.getElementById('personal-record-label').textContent = transDict.infoBar.personalRecord + ':';
            document.getElementById('game-time-label').textContent = transDict.infoBar.gameTime + ':';

            // level bar
            document.getElementById('new-game-button').textContent = transDict.levelBar.newGame;
            document.getElementById('beginner-level').textContent = transDict.difficultyLevels.beginner;
            document.getElementById('intermediate-level').textContent = transDict.difficultyLevels.intermediate;
            document.getElementById('expert-level').textContent = transDict.difficultyLevels.expert;
            document.getElementById('real-sapper-level').textContent = transDict.difficultyLevels.realSapper;

            // footer
            document.getElementById('footer-text').textContent = transDict.footer.author + ' - ' + transDict.footer.text;
        });
    }

}