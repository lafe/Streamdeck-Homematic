const {
    parallel,
    src,
    dest
} = require("gulp");
const jeditor = require("gulp-json-editor");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const fs = require('fs');
const log = require('fancy-log');

const config = {
    appName: "dev.fernhomberg.streamdeck.homematic",
};

const rootDistFolder = `dist/${config.appName}`;
const srcDistFolder = `${rootDistFolder}`;
const assetDistFolder = `${rootDistFolder}/assets`;

function build() {
    return tsProject
        .src()
        .pipe(tsProject())
        .js
        .pipe(dest(srcDistFolder));
}

function copyHtml() {
    return src("src/**/*.html")
        .pipe(dest(rootDistFolder));
}

function copyManifest() {
    return src("./manifest.json")
        .pipe(jeditor((json)=> {
            const packageDefinition = JSON.parse(fs.readFileSync("./package.json"));
            json.Version = packageDefinition.version;
            log.info(`Updated version information in manifest to ${packageDefinition.version}`);
            return json;
        }))
        .pipe(dest(rootDistFolder));
}

function copyAssets() {
    return src("assets/**/*.png")
        .pipe(dest(assetDistFolder));
}

exports.default = parallel(build, copyHtml, copyManifest, copyAssets);