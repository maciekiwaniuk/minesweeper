import UserData from "../scripts/minesweeper/user_data.js";

export default class Translations {
    constructor() {
        this.userData = new UserData();
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
     * Set text content of personal record label
     */
    setTextContentOfPersonalRecordLabel() {
        let data = this.userData.getUserDataLocalStorageValue();
        this.getTranslationPromiseDict().then((transDict) => {
            var personalRecordLabel = document.getElementById('personal-record-label');
            switch (data.selectedLevel) {
                case 'beginner': {
                    personalRecordLabel.textContent = `${transDict.infoBar.personalRecord.beginner}:\xa0`;
                } break;
                case 'intermediate': {
                    personalRecordLabel.textContent = `${transDict.infoBar.personalRecord.intermediate}:\xa0`;
                } break;
                case 'expert': {
                    personalRecordLabel.textContent = `${transDict.infoBar.personalRecord.expert}:\xa0`;
                } break;
                case 'realSapper': {
                    personalRecordLabel.textContent = `${transDict.infoBar.personalRecord.realSapper}:\xa0`;
                } break;
            }
        });
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
            document.getElementById('mines-left-label').textContent = `${transDict.infoBar.minesLeft}:\xa0`;
            document.getElementById('game-time-label').textContent = `${transDict.infoBar.gameTime}:\xa0`;

            // level bar
            document.getElementById('new-game-button').textContent = `${transDict.levelBar.newGame}`;
            document.getElementById('beginner-level').textContent = `${transDict.difficultyLevels.beginner}`;
            document.getElementById('intermediate-level').textContent = `${transDict.difficultyLevels.intermediate}`;
            document.getElementById('expert-level').textContent = `${transDict.difficultyLevels.expert}`;
            document.getElementById('realSapper-level').textContent = `${transDict.difficultyLevels.realSapper}`;

            // game win/lose screen - try catch because elements don't exist all the time
            try { document.getElementById('restart-game-button').textContent = `${transDict.levelBar.newGame}`; } catch (e) { }
            try { document.getElementById('game-win-text').textContent = `${transDict.game.win}`; } catch (e) {  }
            try { document.getElementById('game-lose-text').textContent = `${transDict.game.lose}`; } catch (e) {  }

            // footer
            document.getElementById('footer-text').textContent = `${transDict.footer.author} - ${transDict.footer.text}`;
        });

        this.setTextContentOfPersonalRecordLabel();
    }

}