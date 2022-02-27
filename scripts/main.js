import Translations from "../scripts/translations.js";

var translations = new Translations();
var transPromiseDict = translations.translationsDict;

// fill content of website with text of selected language
transPromiseDict.then(function(transDict) {
    document.title = transDict.title;

    document.getElementById('header-text').textContent = transDict.title;
})