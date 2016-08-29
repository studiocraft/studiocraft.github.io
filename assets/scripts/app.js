/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Script = {
    // All pages
    'common': {
      init: function() {
        // JavaScript to be fired on all pages

        // init Isotope
        var $grid = $('.grid').isotope({
          itemSelector: '.element-item',
          layoutMode: 'fitRows'
        });
        // filter functions
        var filterFns = {
          // show if number is greater than 50
          numberGreaterThan50: function() {
            var number = $(this).find('.number').text();
            return parseInt( number, 10 ) > 50;
          },
          // show if name ends with -ium
          ium: function() {
            var name = $(this).find('.name').text();
            return name.match( /ium$/ );
          }
        };
        // bind filter button click
        $('#filters').on( 'click', 'a', function() {
          var filterValue = $( this ).attr('data-filter');
          // use filterFn if matches value
          filterValue = filterFns[ filterValue ] || filterValue;
          $grid.isotope({ filter: filterValue });
        });
        // change is-checked class on buttons
        $('.button-group').each( function( i, buttonGroup ) {
          var $buttonGroup = $( buttonGroup );
          $buttonGroup.on( 'click', 'button', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $( this ).addClass('is-checked');
          });
        });

      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page

      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
        // $(document).ready(function() {
        //   var playlist = [
        //     {
        //       url : "assets/music/jupiter.mp3",
        //       title : "The Planets - Jupiter",
        //       author : "Gustav Holst",
        //     },
        //     {
        //       url : "assets/music/lakme.mp3",
        //       title : "Lakmé - Sous le Dôme Épais",
        //       author : "Léo Delibes",
        //     }];
        //
        //   var aud = $('#jukebox audio').get(0);
        //   aud.pos = -1;
        //
        //   $("a[data-control='play']").click(function() {
        //     if (aud.pos < 0) {
        //       $("a[data-control='next']").trigger('click');
        //     } else {
        //       aud.play();
        //     }
        //   });
        //
        //   $('a[data-control="pause"]').click(function() {
        //     aud.pause();
        //   });
        //
        //   $('input[data-control="mute"]').on('change', function() {
        //     if( $('#jukebox audio').prop('muted') )
        //     {
        //       $('#jukebox audio').prop('muted', false);
        //       $(this).find("i").toggleClass("fa-volume-off fa-volume-up");
        //     } else {
        //       $('#jukebox audio').prop('muted', true);
        //       $(this).find("i").toggleClass("fa-volume-off fa-volume-up");
        //     }
        //   });
        //
        //   $('#jukebox audio').on('play', function() {
        //     $('[data-control="volume"]').removeClass('hide').addClass('fade in');
        //   });
        //
        //   $('#jukebox audio').on('pause', function() {
        //     $('[data-control="volume"]').addClass('hide').removeClass('fade in');
        //   });
        //
        //   $('input[type="range"]').on('change', function() {
        //     var value = $(this).prop("value");
        //     $('#jukebox audio').volume = (value / 100);
        //   });
        //
        //   $('a[data-control="next"]').click(function() {
        //     aud.pause();
        //     aud.pos++;
        //     if (aud.pos == playlist.length) aud.pos = 0;
        //     aud.setAttribute('src', playlist[aud.pos].url);
        //
        //     $('[data-info="title"]').html(playlist[aud.pos].title);
        //     $('[data-info="author"]').html(playlist[aud.pos].author);
        //       aud.load();
        //   });
        //
        //   $('a[data-control="previous"]').click(function() {
        //     aud.pause();
        //     aud.pos--;
        //     if (aud.pos < 0) aud.pos = playlist.length - 1;
        //     aud.setAttribute('src', playlist[aud.pos].url);
        //     $('[data-info="title"]').html(playlist[aud.pos].title);
        //     $('[data-info="author"]').html(playlist[aud.pos].author);
        //       aud.load();
        //   });
        //
        //   aud.addEventListener('progress', function() {
        //     var percentLoaded = Math.round(parseInt(((aud.buffered.end(0) / aud.duration) * 100), 10));
        //     $('.load-progress').css('width', percentLoaded + '%');
        //   });
        //
        //   aud.addEventListener('timeupdate', function() {
        //     var percentPlayed = Math.round(aud.currentTime / aud.duration * 100);
        //     $('.play-progress').css('width', percentPlayed + '%');
        //   });
        //
        //   aud.addEventListener('canplay', function() {
        //     $('a[data-control="play"]').trigger('click');
        //   });
        //
        //   aud.addEventListener('ended', function() {
        //     $('a[data-control="next"]').trigger('click');
        //   });
        //
        //   $('[data-info="title"]').html(playlist[0].title);
        //
        //   $('[data-info="author"]').html(playlist[0].author);
        //
        //   aud.load();
        // });
      }
    },
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Script;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
