module.exports = class {
    onCreate(input, out) {
        this.t = out.global.i18n.t;
    }

    onMount() {
        this.router = window.router;
    }

    navigate(e) {
        e.preventDefault();
        if (this.input.route) {
            document.title = this.t(this.input.route) ? `${this.t(this.input.route)} | ${this.t("title")}` : this.t("title");
            this.router.navigate(this.input.route, this.input.params ? JSON.parse(this.input.params) : {} || {});
        } else {
            throw new Error(`Missing attribute "route" on router-link component`);
        }
    }
};
