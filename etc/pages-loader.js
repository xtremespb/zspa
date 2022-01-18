/* eslint-disable import/no-unresolved */
module.exports = {
    loadComponent: async route => {
        switch (route) {
        case "home":
            return import(/* webpackChunkName: "page.home" */ "../src/zoia/pages/home");
        case "license":
            return import(/* webpackChunkName: "page.license" */ "../src/zoia/pages/license");
        default:
            return import(/* webpackChunkName: "page.404" */ "../src/zoia/errors/404");
        }
    },
};
