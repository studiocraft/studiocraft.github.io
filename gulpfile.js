'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    scssLint = require('gulp-scss-lint');

var css = (function() {
    return {
        compile: function(config) {
            gulp.src('assets/styles/' + config.src + '.scss')
                .pipe(scssLint({
                    'config': 'scss-lint.yml',
                }));

            gulp.src('assets/styles/' + config.src + '.scss')
                .pipe(sass())
                .pipe(autoprefixer())
                .pipe(rename(config.rename + '.css'))
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
    return css
            .compile({
                src: 'app',
                rename: 'main',
                dest: 'css'
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
    gulp.watch(['assets/styles/**/*.scss'], ['sass']);
    gulp.watch(['assets/scripts/**/*.js'], ['js']);
});

gulp.task('vendors', ['vendorScripts', 'vendorStyles', 'vendorFonts']);
gulp.task('default', ['sass', 'js', 'watch', 'vendors']);
