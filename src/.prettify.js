/* eslint-disable no-console */
const fs = require("fs-extra");
const path = require("path");
const {
    prettyPrintFile,
} = require("@marko/prettyprint");

const processMarkoFiles = async dir => {
    const files = await fs.readdir(dir);
    for (const file of files) {
        const filePath = path.resolve(`${dir}/${file}`);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
            await processMarkoFiles(filePath);
        } else if (path.extname(filePath) === ".marko") {
            prettyPrintFile(filePath, {});
            const fileData = (await fs.readFile(filePath, "utf8")).replace(/\\\$\{/gm, "${").replace(/\\\$!\{/gm, "$!{").split(/\n|\r\n/);
            let tagFound = false;
            let fileDataNew = "";
            for (const line of fileData) {
                const lineProcessed = String(line).trimRight();
                if (!tagFound && lineProcessed.match(/^</)) {
                    tagFound = true;
                }
                if (tagFound && lineProcessed.match(/^\n|\r\n$/)) {
                    // Do something, we're not adding an empty line
                } else {
                    // Add a new line, it's not empty
                    fileDataNew += `${lineProcessed}\n`;
                }
            }
            fileDataNew = tagFound ? `${fileDataNew.trim()}\n` : `${fileData.join("\n")}\n`;
            await fs.writeFile(filePath, fileDataNew, "utf8");
        }
    }
};

(async () => {
    await processMarkoFiles(path.resolve(`${__dirname}`));
})();
