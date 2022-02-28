export default class Translations {
    constructor() {
        this.languageCookieName = 'selected-language';
        this.defaultLanguage = 'en';
        this.selectedLanguage = this.getLanguageCookieValue();

        this.setTextContentOfAllElements();
    }

    /**
     * Create cookie with default english language
     */
     createDefaultLanguageCookie() {
        Cookies.set(this.languageCookieName, this.defaultLanguage);
    }

    /**
     * Create default language cookie if it doesnt exist
     */
     createDefaultLanguageCookieIfNotExists() {
        let cookie = Cookies.get(this.languageCookieName);

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
     * Return dictionary with translations of specific language
     */
    getTransPromiseDictOfSpecificLanguage(language) {
        return fetch('../translations/'+language+'/trans.json').then(function (response) {
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
     * Return currently selected language
     */
    getSelectedLanguage() {
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
     * Set text content with selected language of all elements
     */
     setTextContentOfAllElements() {
        this.getTranslationPromiseDict().then(function (transDict) {
            document.title = transDict.title;

            // header
            document.getElementById('header-text').textContent = transDict.header;

            // game info bar
            document.getElementById('level-of-difficulty-label').textContent = transDict.info_bar.level_of_difficulty.title + ':';
            document.getElementById('amount-of-mines-label').textContent = transDict.info_bar.amount_of_mines + ':';
            document.getElementById('personal-record-label').textContent = transDict.info_bar.personal_record + ':';
            document.getElementById('game-time-label').textContent = transDict.info_bar.game_time + ':';

        });
    }

}