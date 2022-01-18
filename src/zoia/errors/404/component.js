module.exports = class {
    onCreate(input, out) {
        const state = {
            language: out.global.i18n.getLanguage(),
        };
        this.state = state;
    }

    updateLanguage(language) {
        if (language !== this.state.language) {
            setTimeout(() => {
                this.setState("language", language);
            });
        }
    }
};
