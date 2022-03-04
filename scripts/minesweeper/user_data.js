export default class UserData {
    constructor() {
        this.userDataCookieName = 'minesweeper-user-data';

        this.assignEvents();
        this.setContentOfElementsWithUserData();
    }

    /**
     * Assign specific events to specific elements
     */
    assignEvents() {
        const self = this;

        // change select level
        const selectLevel = document.getElementById('select-level');
        selectLevel.addEventListener('change', function() {
            self.changeSelectLevelUserData(selectLevel.value);
        });
    }

    /**
     * Create cookie with default values
     */
    createDefaultUserDataCookie() {
        const data = {
            scoreRecord: {
                'beginner': 0,
                'intermediate': 0,
                'expert': 0,
                'real-sapper': 0
            },
            selectedLevel: 'beginner'
        };
        Cookies.set(
            this.userDataCookieName,
            JSON.stringify(data),
            { expires: 365 }
        );
    }

    /**
     * Create default minesweeper user data cookie if it doesnt exist
     */
    createDefaultUserDataCookieIfNotExists() {
        const cookie = Cookies.get(this.userDataCookieName);
        if (cookie == null) {
            this.createDefaultUserDataCookie();
        }
    }

    /**
     * Return value from minesweeper user data cookie
     */
    getUserDataCookieValue() {
        this.createDefaultUserDataCookieIfNotExists();
        return JSON.parse(Cookies.get(this.userDataCookieName));
    }

    /**
     * Save minesweeper user data cookie
     */
    saveUserDataCookie(data) {
        Cookies.set(
            this.userDataCookieName, 
            JSON.stringify(data),
            { expires: 365 }
        );
    }

    /**
     * Change select level in user data cookie
     */
    changeSelectLevelUserData(level) {
        const data = this.getUserDataCookieValue();
        data.selectedLevel = level;
        this.saveUserDataCookie(data);
    }

    /**
     * Set content of elements with values from minesweeper user data
     */
    setContentOfElementsWithUserData() {
        const data = this.getUserDataCookieValue();

        // set option in level of difficulty select
        const selectLevel = document.getElementById('select-level');
        selectLevel.value = data.selectedLevel;

    }
}