'use strict';

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    scssLint = require('gulp-scss-lint'),
    sourcemaps = require('gulp-sourcemaps'),
    cssComb = require('gulp-csscomb'),
    autoprefixer = require('gulp-autoprefixer'),
    stylestats = require('gulp-stylestats'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    favicons = require('favicons');

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
                .pipe(autoprefixer("last 2 version", "> 1%", "ie 8", "ie 7"))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('./assets/' + config.dest));

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

// CSS Task
//

var css = (function() {
    return {
        compile: function(config) {
            gulp.src('./assets/css/' + config.src + '.css')
                .pipe(cssComb())
                .pipe(rename(config.rename + '.css'))
                .pipe(gulp.dest('./assets/' + config.dest))
                .pipe(minifyCss({
                    compatibility: 'ie6'
                  }))
                .pipe(rename(config.rename + '.min.css'))
                .pipe(gulp.dest('./assets/' + config.dest));

            return this;
        }
    };
}());

gulp.task('css', ['sass'], function() {
    return css
            .compile({
                src: 'app',
                rename: 'main',
                dest: 'css/dist'
            });
});

// Style Stats Task
//

var stats = (function() {
    return {
        compile: function(config) {
          gulp.src('./assets/css/dist/' + config.src + '.css')
              .pipe(stylestats({
                  type: config.type,
                  outfile: true
            }))
            .pipe(gulp.dest(config.dest));

            return this;
        }
    };
}());

gulp.task('stylestats', ['css'], function() {
    return stats
        .compile({
            src: 'main',
            type: 'json',
            dest: 'stats'
        });
});

// JS Task
//

var js = (function() {
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

gulp.task('js', function() {
    return js
            .compile({
                src: 'app',
                rename: 'main',
                dest: 'js'
            });
});

// Bower Components Task
//

// var wiredep = require('wiredep').stream;
//
//
// var bower = (function() {
//     return {
//         compile: function(config) {
//             gulp.src('./assets/scripts/' + config.src + '.js')
//                 .pipe(jshint())
//                 .pipe(jshint.reporter('jshint-stylish'))
//                 .pipe(rename(config.rename + '.js'))
//                 .pipe(gulp.dest('./assets/' + config.dest));
//
//             return this;
//         }
//     };
// }());
//
// gulp.task('wiredep', function() {
//     return bower
//             .compile({
//                 src: 'jquery/dist/*.js',
//                 dest: 'js/vendors'
//             })
//             .compile({
//                 src: 'respond/dest/*.js',
//                 dest: 'js/vendors'
//             })
//             .compile({
//                 src: 'app',
//                 rename: 'main',
//                 dest: 'js'
//             });
// });
//
// gulp.task('bower', function () {
//   gulp.src('./src/footer.html')
//     .pipe(wiredep({
//       optional: 'configuration',
//       goes: 'here'
//     }))
//     .pipe(gulp.dest('./dest'));
// });

// Favicons Task
//

var icons = (function() {
    return {
        compile: function(config) {
            return favicons({
                files: {
                    src: './assets/' + config.src + 'favicon.src.png',
                    dest: './assets/' + config.dest,
                    html: config.html,
                    iconsPath: './assets/' + config.path,
                },
                icons: {
                    android: true,
                    appleIcon: true,
                    appleStartup: true,
                    coast: true,
                    favicons: true,
                    firefox: true,
                    opengraph: true,
                    windows: true,
                    yandex: true
                },
                  settings: {
                      background: config.bg,
                      logging: true
                  },
                favicon_generation: null,
            });

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
            bg: 'transparent'
        });
});

// TODO: Gulp Bower Injecting for Vendor Files
var vendors = (function() {
    return {
        compile: function(config) {
            gulp.src('bower_components/' + config.src)
                .pipe(gulp.dest('assets/' + config.dest));

            return this;
        }
    };
}());


// TODO: Gulp Bower Injecting for Vendor Files
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
                src: 'headroom.js/dist/*.js',
                dest: 'js/vendors'
            })
            .compile({
                src: 'wow/dist/*.js',
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
        .compile({
            src: 'animate.css/*.css',
            dest: 'css/vendors'
        });
});

gulp.task('watch', function() {
    gulp.watch(['assets/styles/**/*.scss'], ['css']);
    gulp.watch(['assets/scripts/**/*.js'], ['js']);
    gulp.watch(['assets/images/favicons/*.src.png'], ['icons']);
});

gulp.task('vendors', ['vendorScripts', 'vendorStyles', 'vendorFonts']);
gulp.task('default', ['stylestats', 'js', 'icons', 'watch']);
