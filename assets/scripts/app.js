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
        // new WOW().init();

        $(document).ready(function(){
          var imgCycle = ['rndm1','rndm2'];
          var randomBg = Math.floor(Math.random() * imgCycle.length);
          var backgroundImg = imgCycle[randomBg];
          $('.bg').addClass(backgroundImg);
        });

        $(window).on('load resize', function (e) {
          e.preventDefault();
          var containerHeight = $('.banner').height();
          $('.banner').children().css({"min-height": containerHeight + "px"});

        });

      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
        var scrollTimeout;

        $('a[data-scroll="smooth"]').on('click touchend', function() {
          if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
              $('html,body').animate({
                scrollTop: target.offset().top
              }, 1000);
              return false;
            }
          }
        });

        $(window).on('scroll touchend', function () {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
                scrollTimeout = null;
            }
            scrollTimeout = setTimeout(scrollHandler, 20);
        });
        scrollHandler = function () {
          var opacityInit = 0.65;
          var opacityCalc = $(window).scrollTop() / 1000;
          var opacity = opacityInit + opacityCalc;
          var opacityMax = 1;

          if(opacity < opacityMax ) {
            $('.overlay').css({"opacity": opacity});
          } else {
            $('.overlay').css({"opacity": opacityMax});
          }
        };
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page
        $("#contactForm").submit( function(e) {
          e.preventDefault();
          $.ajax({
            url: "//formspree.io/hello@studiocraft.cc",
            method: "POST",
            data: $(this).serialize(),
            dataType: "json",
            beforeSend: function() {
              $('#formSubmit').text('Sending ... ').prop('disabled', true);
            },
            success: function(){
              $('#formSubmit').text('hello@studiocraft.cc').prop('disabled', false);
              $('#success').html('<div class="alert alert-success alert-dismissible fade in" role="alert">');
              $('#success > .alert-success').html('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><p>Your message was <strong>successfully sent</strong>.</p><p>Thank You!</p>').append('</div>');
              $('#contactForm').trigger("reset");
            },
            error: function(){
              $('#formSubmit').text('hello@studiocraft.cc').prop('disabled', false);
              $('#fail').html('<div class="alert alert-danger alert-dismissible fade in" role="alert">');
              $('#fail > .alert-danger').html('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><p>Your message <strong>failed to send</strong>.</p><p>Sorry about that, but please do try again.</p>').append('</div>');
              $('#contactForm').trigger("reset");
            }
          });
        });

      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
        $(document).ready(function() {
          var playlist = [
            {
              url : "assets/music/jupiter.mp3",
              title : "The Planets - Jupiter",
              author : "Gustav Holst",
            },
            {
              url : "assets/music/lakme.mp3",
              title : "Lakmé - Sous le Dôme Épais",
              author : "Léo Delibes",
            }];

          var aud = $('#jukebox audio').get(0);
          aud.pos = -1;

          $("a[data-control='play']").click(function() {
            if (aud.pos < 0) {
              $("a[data-control='next']").trigger('click');
            } else {
              aud.play();
            }
          });

          $('a[data-control="pause"]').click(function() {
            aud.pause();
          });

          $('input[data-control="mute"]').on('change', function() {
            if( $('#jukebox audio').prop('muted') )
            {
              $('#jukebox audio').prop('muted', false);
              $(this).find("i").toggleClass("fa-volume-off fa-volume-up");
            } else {
              $('#jukebox audio').prop('muted', true);
              $(this).find("i").toggleClass("fa-volume-off fa-volume-up");
            }
          });

          $('#jukebox audio').on('play', function() {
            $('[data-control="volume"]').removeClass('hide').addClass('fade in');
          });

          $('#jukebox audio').on('pause', function() {
            $('[data-control="volume"]').addClass('hide').removeClass('fade in');
          });

          $('input[type="range"]').on('change', function() {
            var value = $(this).prop("value");
            $('#jukebox audio').volume = (value / 100);
          });

          $('a[data-control="next"]').click(function() {
            aud.pause();
            aud.pos++;
            if (aud.pos == playlist.length) aud.pos = 0;
            aud.setAttribute('src', playlist[aud.pos].url);

            $('[data-info="title"]').html(playlist[aud.pos].title);
            $('[data-info="author"]').html(playlist[aud.pos].author);
              aud.load();
          });

          $('a[data-control="previous"]').click(function() {
            aud.pause();
            aud.pos--;
            if (aud.pos < 0) aud.pos = playlist.length - 1;
            aud.setAttribute('src', playlist[aud.pos].url);
            $('[data-info="title"]').html(playlist[aud.pos].title);
            $('[data-info="author"]').html(playlist[aud.pos].author);
              aud.load();
          });

          aud.addEventListener('progress', function() {
            var percentLoaded = Math.round(parseInt(((aud.buffered.end(0) / aud.duration) * 100), 10));
            $('.load-progress').css('width', percentLoaded + '%');
          });

          aud.addEventListener('timeupdate', function() {
            var percentPlayed = Math.round(aud.currentTime / aud.duration * 100);
            $('.play-progress').css('width', percentPlayed + '%');
          });

          aud.addEventListener('canplay', function() {
            $('a[data-control="play"]').trigger('click');
          });

          aud.addEventListener('ended', function() {
            $('a[data-control="next"]').trigger('click');
          });

          $('[data-info="title"]').html(playlist[0].title);

          $('[data-info="author"]').html(playlist[0].author);

          aud.load();
        });
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
