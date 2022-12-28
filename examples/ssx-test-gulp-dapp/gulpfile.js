let gulp = require('gulp'),
    browserify = require("browserify"),
    tsify = require("tsify"),
    babelify = require('babelify'),
    fs = require("fs"),
    path = require('path')
;

let app = {
    //entry extension can be .jsx, .js, .ts, or .tsx
    entry: './src/main.tsx',
    publish: './dist/publish.js',
    tsconfig: './tsconfig.json'
};

gulp.task('app.build', function () {

    let b = browserify({
        entries: [app.entry]
    });

    b.plugin(tsify, getJsonFile(app.tsconfig).compilerOptions);
    b.transform(babelify,
        {
            presets: ['env', 'react']
        }
    );

    console.log('Building...');
    return b.bundle()
        .pipe(createFile(app.publish));
});

function getJsonFile(path) {
    return JSON.parse(fs.readFileSync(path));
}

function createFile(pathToFile) {
    //Check if directory exists, if not, then create it before publishing
    let dir = path.dirname(pathToFile);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    return fs.createWriteStream(pathToFile);
}