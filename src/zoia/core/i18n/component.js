const i18nLoader = require("../../../../etc/i18n-loader");
const languageList = require("../../../../etc/languages.json");

module.exports = class {
    onCreate(input, out) {
        this.languages = languageList;
        const state = {
            language: null,
        };
        this.state = state;
        this.languageData = {};
        this.func = {
            t: this.t.bind(this),
            setLanguage: this.setLanguage.bind(this),
            getLanguage: this.getLanguage.bind(this),
            loadDefaultLanguage: this.loadDefaultLanguage.bind(this),
            languages: this.languages,
            defaultLanguage: Object.keys(this.languages)[0],
        };
        out.global.i18n = this.func;
        this.parentComponent = input.parentComponent;
    }

    async loadLanguage(lang) {
        const timer = this.parentComponent.getAnimationTimer();
        try {
            this.languageData[lang] = this.languageData[lang] || await i18nLoader.loadLanguageFile(lang);
            if (!this.languageData[lang] && window.router) {
                window.router.navigate("404", {});
            }
            this.parentComponent.clearAnimationTimer(timer);
        } catch {
            this.parentComponent.clearAnimationTimer(timer);
            this.parentComponent.setState("500", true);
        }
    }

    async loadDefaultLanguage() {
        await this.loadLanguage(this.func.defaultLanguage);
    }

    async setLanguage(language = this.func.defaultLanguage) {
        await this.loadLanguage(language || this.func.defaultLanguage);
        this.setState("language", language);
        this.emit("language-change");
    }

    getLanguage() {
        return this.state.language;
    }

    t(id) {
        const language = this.state.language || this.func.defaultLanguage;
        return this.languageData[language] && this.languageData[language][id] ? this.languageData[language][id] : this.languageData[this.func.defaultLanguage] && this.languageData[this.func.defaultLanguage][id] ? this.languageData[this.func.defaultLanguage][id] : id || "";
    }
};
