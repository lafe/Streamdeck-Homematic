/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import { deleteAsync } from "del";
import log from "fancy-log";
import fs from "fs";
import gulp from "gulp";
import eslint from "gulp-eslint";
import jeditor from "gulp-json-editor";
import compiler from "webpack";
import webpack from "webpack-stream";
const {
    dest,
    parallel,
    series,
    src,
    watch
} = gulp;

const appName = "dev.fernhomberg.streamdeck.homematic.sdPlugin";
const rootDistFolder = `dist/${appName}`;
const srcDistFolder = `${rootDistFolder}`;
const assetDistFolder = `${rootDistFolder}/assets`;

function clean() {
    return deleteAsync([`${rootDistFolder}/**/*`]);
}

function lint() {
    return src(["src/**/*.ts", "src/**/*.tsx"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

// async function buildTypeScript() {
//     const webpackConfig = await import("./webpack.config.js");
//     return src("./src/app.ts")
//         .pipe(webpack(webpackConfig, compiler, (err) => {
//             if (err != null) {
//                 log.error(`An error occured during the webpack task: ${err.message}`, err);
//             }
//         }))
//         .pipe(dest(srcDistFolder));
// }

async function buildTypeScript() {
    try {
        const webpackConfig = await import("./webpack.config.js");
        return src("./src/app.ts")
            .pipe(webpack(webpackConfig.default, compiler))
            .on("error", function(err) {
                log.error(`An error occurred during the webpack task: ${err.message}`, err);
                this.emit("end"); // Ensure that Gulp knows the task has ended in case of error
            })
            .pipe(dest(srcDistFolder));
    } catch (err) {
        log.error(`An error occurred in buildTypeScript: ${err.message}`, err);
    }
}

function copyHtml() {
    return src(["src/**/*.html", "src/**/*.css", "src/**/*.svg"])
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

const build = series(
    clean,
    parallel(
        series(
            lint,
            buildTypeScript
        ),
        copyHtml,
        copyManifest,
        copyAssets
    )
);

const watcher = () => {
    return watch(
        [
            "src/**/*.ts",
            "src/**/*.tsx",
            "src/**/*.html",
            "src/**/*.css",
            "src/**/*.svg",
            "./manifest.json",
            "./package.json",
            "assets/**/*.png"
        ],
        series(build, copyToAppData)
    );
};

export {
    build,
    lint,
    watcher as watch
};

