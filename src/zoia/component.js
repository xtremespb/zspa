const pagesLoader = require("../../etc/pages-loader");
const routes = require("../../etc/routes.json");

module.exports = class {
    async onCreate() {
        this.state = {
            route: {
                name: "",
                params: {},
            },
            langDataLoaded: false,
            currentComponent: null,
            error500: false,
        };
        this.i18Components = ["navbar", "404", ...routes.map(r => r.name)];
        this.componentsLoaded = {};
        await import(/* webpackChunkName: "bulma" */ "../../etc/bulma.scss");
        await import(/* webpackChunkName: "zoia" */ "./zoia.scss");
    }

    onMount() {
        this.i18n = this.getComponent("i18n");
    }

    getAnimationTimer() {
        return setTimeout(() => this.getComponent("loading").setActive(true), 500);
    }

    clearAnimationTimer(timer) {
        clearTimeout(timer);
        const loadingComponent = this.getComponent("loading");
        if (loadingComponent) {
            this.getComponent("loading").setActive(false);
        }
    }

    async onStateChange(obj) {
        this.state.route = obj.route;
        let component = null;
        const timer = this.getAnimationTimer();
        try {
            component = await pagesLoader.loadComponent(obj.route.name);
            const navbarComponent = this.getComponent("navbar");
            if (navbarComponent) {
                navbarComponent.setRoute();
            }
        } catch {
            this.clearAnimationTimer(timer);
            this.setState("error500", true);
        }
        this.clearAnimationTimer(timer);
        this.componentsLoaded[obj.route.name] = true;
        this.setState("currentComponent", component);
    }

    langDataLoaded() {
        this.setState("langDataLoaded", true);
    }

    onLanguageChange() {
        this.forceUpdate();
        this.i18Components.map(c => {
            const component = this.getComponent(c);
            if (component) {
                component.updateLanguage(this.i18n.getLanguage());
            }
        });
    }
};
