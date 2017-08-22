'use strict';

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    scssLint = require('gulp-scss-lint'),
    sourcemaps = require('gulp-sourcemaps'),
    cssComb = require('gulp-csscomb'),
    autoprefixer = require('gulp-autoprefixer'),
    stylestats = require('gulp-stylestats'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    modernizr = require('gulp-modernizr'),
    stylish = require('jshint-stylish'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    favicons = require("gulp-favicons");

// SASS Task
//
var styles = (function() {
    return {
        compile: function(config) {
            gulp.src('./assets/styles/' + config.src + '.scss')
                .pipe(scssLint({
                    'config': 'scss-lint.yml',
                }));

            return sass('./assets/styles/' + config.src + '.scss', {
                    precision: 10,
                    sourcemap: true
                })
                .pipe(sourcemaps.init())
                .on('error', sass.logError)
                .pipe(autoprefixer("last 5 version", "> .5%", "ie 8", "ie 7", "ie 6"))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('./assets/' + config.dest))
                .pipe(rename(config.rename + '.css'))
                .pipe(gulp.dest('./assets/' + config.dest));

            return this;
        }
    };
}());

gulp.task('sass', function() {
    return styles
        .compile({
            src: 'app',
            rename: 'main',
            dest: 'css'
        });
});

// CSS Task
//
var css = (function() {
    return {
        compile: function(config) {
            gulp.src('./assets/css/' + config.src + '.css')
                .pipe(cssComb())
                .pipe(gulp.dest('./assets/' + config.dest))
                .pipe(cssnano({
                    compatibility: 'ie6'
                  }))
                .pipe(rename(config.rename + '.min.css'))
                .pipe(gulp.dest('./dist/' + config.dest));

            return this;
        }
    };
}());

gulp.task('css', ['sass'], function() {
    return css
        .compile({
            src: 'main',
            rename: 'main',
            dest: 'css/'
        });
});

// Style Stats Task
//
var stats = (function() {
    return {
        compile: function(config) {
          gulp.src('./assets/css/dist/' + config.src + '.css')
              .pipe(stylestats({
                  type: config.format,
                  outfile: true
            }))
            .pipe(gulp.dest(config.dest));

            return this;
        }
    };
}());

gulp.task('stats', ['css'], function() {
    return stats
        .compile({
            src: 'main',
            format: 'json',
            dest: 'assets/stats'
        });
});

// Scripts Task
//
var scripts = (function() {
    return {
        compile: function(config) {
            gulp.src('./assets/scripts/' + config.src + '.js')
                .pipe(jshint())
                .pipe(jshint.reporter('jshint-stylish'))
                .pipe(rename(config.rename + '.js'))
                .pipe(gulp.dest('./assets/' + config.dest));

            return this;
        }
    };
}());

gulp.task('scripts', function() {
    return scripts
        .compile({
            src: 'app',
            rename: 'main',
            dest: 'js'
        });
});

// JS Task
//
var js = (function() {
    return {
        compile: function(config) {
            gulp.src('./assets/js/' + config.src + '.js')
                .pipe(uglify())
                .pipe(rename(config.rename + '.min.js'))
                .pipe(gulp.dest('./dist/' + config.dest));

            return this;
        }
    };
}());

gulp.task('js', ['scripts'], function() {
    return js
        .compile({
            src: 'main',
            rename: 'main',
            dest: 'js'
        });
});

// Modernizr Task
//
var mdrnzr = (function() {
    return {
        compile: function(config) {
            gulp.src('./assets/{js,css}/' + config.src + '.{js,css}')
                .pipe(modernizr(config.rename + '.js'))
                .pipe(gulp.dest('./assets/' + config.dest))
                .pipe(uglify())
                .pipe(rename(config.rename + '.min.js'))
                .pipe(gulp.dest('./dist/' + config.dest));

            return this;
        }
    };
}());

gulp.task('modernizr', ['js', 'css'], function() {
    return mdrnzr
        .compile({
            src: 'main',
            rename: 'modernizr.custom',
            dest: 'js'
        });
});

// Favicons Task
//
var icons = (function() {
    return {
        compile: function(config) {
          gulp.src('assets/' + config.src + 'favicon.src.png')
              .pipe(favicons({
                  appName: "My Favicons",
                  appDescription: "These are my Favicons",
                  developerName: "Bryan Colosky",
                  developerURL: "http://bryancolosky.com/",
                  background: config.background,
                  path: 'assets/' + config.path,
                  url: "http://bryancolosky.com/",
                  display: "standalone",
                  orientation: "landscape",
                  version: 1.0,
                  logging: false,
                  online: false,
                  html: config.html,
                  replace: true
              }))
              .pipe(gulp.dest('assets/' + config.dest));

            return this;
        }
    };
}());

gulp.task('icons', function() {
    return icons
        .compile({
            src: 'images/favicons/',
            dest: 'images/favicons/',
            html: '_includes/favicons.html',
            path: 'images/favicons/',
            background: 'transparent'
        });

});

// Browser Sync Task
//
var settings = (function() {
    return {
        init: function(config) {
            browserSync.init({
                proxy: config.proxy + ':' + config.port,
                port: config.port,
                files: config.site,
            });

              return this;
        }
    };
}());

gulp.task('browser-sync', function() {
    return settings
        .init({
            proxy: "localhost",
            port: "4000",
            site: "_site/*.*"
        });
});

gulp.task('watch', function() {
    gulp.watch(['assets/styles/**/*.scss'], ['sass']);
    gulp.watch(['assets/scripts/**/*.js'], ['scripts']);
    gulp.watch(['assets/images/favicons/*.src.png'], ['icons']);
});

gulp.task('default', ['sass', 'scripts', 'browser-sync', 'watch']);
gulp.task('build', ['modernizr', 'icons']);
