export default class Translations {
    constructor() {
        this.languageCookieName = 'selected-language';
        this.defaultLanguage = 'en';
        this.selectedLanguage = this.getLanguageCookieValue();
        this.translationsDict = this.getTranslationsPromiseDictOfSpecificLanguage(this.selectedLanguage);
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
    getTranslationsPromiseDictOfSpecificLanguage(language) {
        let promiseTransDict = fetch('../translations/'+language+'/trans.json')
        .then(function (response) {
            return response.json();
        }).then(function (jsonData) {
            return jsonData;
        });

        return promiseTransDict;
    }
    
}