import Translations from "../scripts/translations.js";

class Main {
    constructor() {
        this.translations = new Translations();
        this.setTextContentOfAllElements()
    }

    /**
     * Return Promise of dictionary with text content of selected language
     */
    getTranslationPromiseDict() {
        return this.translations.getTransPromiseDictOfSpecificLanguage(
            this.translations.getLanguageCookieValue()
        );
    }

    /**
     * Set text content of all elements
     */
    setTextContentOfAllElements() {
        this.getTranslationPromiseDict().then(function (transDict) {
            document.title = transDict.title;

            document.getElementById('header-text').textContent = transDict.title;
        })
    }
}

var main = new Main();

document.getElementById('polish-flag').addEventListener('click', function() {
    main.translations.changeSelectedLanguage('pl');
    main.setTextContentOfAllElements();
});

document.getElementById('english-flag').addEventListener('click', function() {
    main.translations.changeSelectedLanguage('en');
    main.setTextContentOfAllElements();
});