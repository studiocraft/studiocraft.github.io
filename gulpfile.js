'use strict';

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    scssLint = require('gulp-scss-lint'),
    minifyCss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps');


var styles = (function() {
    return {
        compile: function(config) {
            gulp.src('assets/styles/' + config.src + '.scss')
                .pipe(scssLint({
                    'config': 'scss-lint.yml',
                }));

            return sass('assets/styles/' + config.src + '.scss', {
                    precision: 10,
                    sourcemap: true
                })
                .pipe(sourcemaps.init())
                .on('error', sass.logError)
                .pipe(autoprefixer("last 2 version", "> 1%", "ie 8", "ie 7"))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('assets/' + config.dest));

            return this;
        }
    };
}());

var css = (function() {
    return {
        compile: function(config) {
            gulp.src('assets/css/' + config.src + '.css')
                .pipe(minifyCss({
                    suffix: '.min'
                }))
                .pipe(gulp.dest('assets/' + config.dest));

            return this;
        }
    };
}());

var js = (function() {
    return {
        compile: function(config) {
            gulp.src('assets/scripts/' + config.src + '.js')
                .pipe(jshint())
                .pipe(jshint.reporter('jshint-stylish'))
                .pipe(rename(config.rename + '.js'))
                .pipe(gulp.dest('assets/' + config.dest));

            return this;
        }
    };
}());

var vendors = (function() {
    return {
        compile: function(config) {
            gulp.src('bower_components/' + config.src)
                .pipe(gulp.dest('assets/' + config.dest));

            return this;
        }
    };
}());

gulp.task('sass', function() {
    return styles
            .compile({
                src: 'app',
                dest: 'css'
            });
});

gulp.task('css', function() {
    return css
            .compile({
                src: 'app',
                dest: 'css/dist'
            });
});

gulp.task('js', function() {
    return js
            .compile({
                src: 'app',
                rename: 'main',
                dest: 'js'
            });
});

gulp.task('vendorScripts', function() {
    return vendors
            .compile({
                src: 'jquery/dist/*.js',
                dest: 'js/vendors'
            })
            .compile({
                src: 'respond/dest/*.js',
                dest: 'js/vendors'
            })
            .compile({
                src: 'bootstrap-sass/assets/javascripts/*.js',
                dest: 'js/vendors'
            })
            .compile({
                src: 'masonry/dist/*.js',
                dest: 'js/vendors'
            })
            .compile({
                src: 'imagesloaded/*.js',
                dest: 'js/vendors'
            });
});

gulp.task('vendorFonts', function() {
    return vendors
            .compile({
                src: 'bootstrap-sass/assets/fonts/bootstrap/*',
                dest: 'fonts/vendors'
            })
            .compile({
                src: 'font-awesome/fonts/*',
                dest: 'fonts/vendors'
            });
});

gulp.task('vendorStyles', function() {
    return vendors
});

gulp.task('watch', function() {
    gulp.watch(['assets/styles/**/*.scss'], ['sass', 'css']);
    gulp.watch(['assets/scripts/**/*.js'], ['js']);
});

gulp.task('vendors', ['vendorScripts', 'vendorStyles', 'vendorFonts']);
gulp.task('default', ['sass', 'css', 'js', 'watch', 'vendors']);
