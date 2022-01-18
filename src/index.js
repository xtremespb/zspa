import template from "./index.marko";

(async () => {
    template.render({}).then(data => data.appendTo(document.body));
})();
