/* eslint-disable import/no-unresolved */
module.exports = class {
    onCreate(input, out) {
        const state = {
            language: out.global.i18n.getLanguage(),
            currentComponent: null,
        };
        this.state = state;
        this.i18n = out.global.i18n;
        this.parentComponent = input.parentComponent;
    }

    async loadComponent(language = this.i18n.getLanguage()) {
        let component = null;
        const timer = this.parentComponent.getAnimationTimer();
        try {
            switch (language) {
            case "ru-ru":
                component = await import(/* webpackChunkName: "page.license.ru-ru" */ "./license-ru-ru");
                break;
            default:
                component = await import(/* webpackChunkName: "page.license.en-us" */ "./license-en-us");
            }
            this.parentComponent.clearAnimationTimer(timer);
        } catch {
            this.parentComponent.clearAnimationTimer(timer);
            this.parentComponent.setState("500", true);
        }
        this.setState("currentComponent", component);
    }

    onMount() {
        this.loadComponent();
    }

    async updateLanguage(language) {
        if (language !== this.state.language) {
            setTimeout(() => {
                this.setState("language", language);
            });
        }
        this.loadComponent(language);
    }
};
