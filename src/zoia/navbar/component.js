module.exports = class {
    onCreate(input, out) {
        const state = {
            language: out.global.i18n.getLanguage(),
            route: null,
            langOpen: false,
            navOpen: false,
        };
        this.state = state;
    }

    onMount() {
        window.addEventListener("click", e => {
            if (!document.getElementById("zs_navbar_language").contains(e.target)) {
                this.setState("langOpen", false);
            }
            if (!document.getElementById("zs_navbar_burger").contains(e.target)) {
                this.setState("navOpen", false);
            }
        });
        this.setRoute();
    }

    setRoute() {
        this.setState("route", window && window.router ? window.router.getState().name : null);
    }

    updateLanguage(language) {
        if (language !== this.state.language) {
            setTimeout(() => {
                this.setState("language", language);
            });
        }
        this.setRoute();
    }

    onLanguageClick(e) {
        e.preventDefault();
        this.setState("langOpen", !this.state.langOpen);
    }

    onBurgerClick(e) {
        e.preventDefault();
        this.setState("navOpen", !this.state.navOpen);
    }
};
