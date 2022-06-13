export default class UserData {
    constructor() {
        this.userDataLocalStorageName = 'minesweeper-user-data';

        this.assignEvents();
        this.setContentOfElementsWithUserData();
    }

    /**
     * Assign specific events to specific elements
     */
    assignEvents() {
        const self = this;

        // change select level
        const selectLevel = document.querySelector('#select-level');
        selectLevel.addEventListener('change', function() {
            self.changeSelectLevelUserData(selectLevel.value);
        });
    }

    /**
     * Create minesweeper user data local storage with default values
     */
    createDefaultUserDataLocalStorage() {
        const data = {
            scoreRecord: {
                'beginner': 0,
                'intermediate': 0,
                'expert': 0,
                'realSapper': 0
            },
            selectedLevel: 'beginner'
        };
        localStorage.setItem(
            this.userDataLocalStorageName,
            JSON.stringify(data)
        );
    }

    /**
     * Create default minesweeper user data local storage if it doesnt exist
     */
     createDefaultUserDataLocalStorageIfNotExists() {
        const storage = localStorage.getItem(this.userDataLocalStorageName);
        if (storage == null) {
            this.createDefaultUserDataLocalStorage();
        }
    }

    /**
     * Return value from minesweeper user data local storage
     */
    getUserDataLocalStorageValue() {
        this.createDefaultUserDataLocalStorageIfNotExists();
        return JSON.parse(localStorage.getItem(this.userDataLocalStorageName));
    }

    /**
     * Save minesweeper user data local storage
     */
    saveUserDataLocalStorage(data) {
        localStorage.setItem(
            this.userDataLocalStorageName, 
            JSON.stringify(data)
        );
    }

    /**
     * Change select level in user data local storage
     */
    changeSelectLevelUserData(level) {
        const data = this.getUserDataLocalStorageValue();
        data.selectedLevel = level;
        this.saveUserDataLocalStorage(data);
    }

    /**
     * Set content of elements with values from minesweeper user data
     */
    setContentOfElementsWithUserData() {
        const data = this.getUserDataLocalStorageValue();

        // set option in level of difficulty select
        const selectLevel = document.querySelector('#select-level');
        selectLevel.value = data.selectedLevel;

    }

    /**
     * Return score record of currently selected level
     */
    getCurrentlySelectedLevelScoreRecord() {
        const data = this.getUserDataLocalStorageValue();
        let currentlySelectedLevel = data.selectedLevel;

        return data.scoreRecord[currentlySelectedLevel];
    }

    /**
     * Update score record of currently selected level
     */
    updateCurrentlySelectedLevelScoreRecord(score) {
        const data = this.getUserDataLocalStorageValue();
        let currentlySelectedLevel = data.selectedLevel;

        data.scoreRecord[currentlySelectedLevel] = score;
        this.saveUserDataLocalStorage(data);
    }
}