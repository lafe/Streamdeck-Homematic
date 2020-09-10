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
const fs = require("fs");
const log = require("fancy-log");
const eslint = require("gulp-eslint");
const del = require("del");
const webpack = require("webpack-stream");
const compiler = require("webpack");

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
    return src("./src/app.ts")
        .pipe(webpack(require("./webpack.config.js"), compiler, (err, stats) => {
            if (err != null) {
                log.error(`An error occured during the webpack task: ${err.message}`, err);
            }
        }))
        .pipe(dest(srcDistFolder));
}

function copyHtml() {
    return src(["src/**/*.html", "src/**/*.css"])
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
    watch(["src/**/*.html", "src/**/*.css"], series(build, copyToAppData));
    watch(["./manifest.json", "./package.json"], series(build, copyToAppData));
    watch("assets/**/*.png", series(build, copyToAppData));
};