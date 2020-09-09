/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const {
    parallel,
    series,
    src,
    dest,
    watch
} = require("gulp");
const jeditor = require("gulp-json-editor");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const fs = require("fs");
const log = require("fancy-log");
const eslint = require("gulp-eslint");
const del = require("del");

const appName = "dev.fernhomberg.streamdeck.homematic.sdPlugin";

const rootDistFolder = `dist/${appName}`;
const srcDistFolder = `${rootDistFolder}`;
const assetDistFolder = `${rootDistFolder}/assets`;

function clean() {
    return del([`${rootDistFolder}/**/*`]);
}

function lint() {
    return src(["src/**/*.ts"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function buildTypeScript() {
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
        .pipe(jeditor((json) => {
            const packageDefinition = JSON.parse(fs.readFileSync("./package.json"));
            json.Version = packageDefinition.version;
            json["$schema"] = undefined;
            log.info(`Updated version information in manifest to ${packageDefinition.version}`);
            return json;
        }))
        .pipe(dest(rootDistFolder));
}

function copyAssets() {
    return src("assets/**/*.png")
        .pipe(dest(assetDistFolder));
}

function copyToAppData() {
    return src(`${rootDistFolder}/**/*.*`)
        .pipe(dest(`${process.env.HOME}\\AppData\\Roaming\\Elgato\\StreamDeck\\Plugins\\${appName}`));

}

const build = parallel(
    clean,
    series(
        lint,
        buildTypeScript
    ),
    copyHtml,
    copyManifest,
    copyAssets
);


exports.default = build;
exports.lint = lint;
exports.watch = () => {
    watch("src/**/*.ts", series(build, copyToAppData));
    watch("src/**/*.html", series(build, copyToAppData));
    watch(["./manifest.json", "./package.json"], series(build, copyToAppData));
    watch("assets/**/*.png", series(build, copyToAppData));
};