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
        new WOW().init();
      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
        function initMap() {
          var styles =[
            { "featureType":"water","elementType":"geometry","stylers":[{"color":"#222222"}]
            },
            { "featureType":"landscape","elementType":"geometry","stylers":[{"color":"#111111"}]
            },
            { "featureType":"road","elementType":"geometry","stylers":[{"color":"#111111"},{"lightness":-35}]
            },
            { "featureType":"poi","elementType":"geometry","stylers":[{"color":"#222222"},{"lightness":10}]
            },
            { "featureType":"transit","elementType":"geometry","stylers":[{"color":"#222222"},{"lightness":5}]
            },
            { "elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]
            },
            { "elementType":"labels.text.fill","stylers":[{"visibility":"simple"},{"color": "#111111"},{"lightness": 50}]
            },
            { "featureType":"administrative","elementType":"geometry","stylers":[{"color":"#222222"}]
            },
            { "elementType":"labels.icon","stylers":[{"visibility":"off"}]
            },
            { "featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#111111"},{"lightness":-10}]
          }];

          var myLatLng = { lat: 40.7714867, lng: -73.9623121};

          var styledMap = new google.maps.StyledMapType(styles, {name: "Studiocraft"});

          var mapOptions = {
            center: myLatLng,
            backgroundColor: 'transparent',
            disableDefaultUI: true,
            zoomControl: false,
            zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            zoom: 13,
            scrollwheel: false,
            draggable: true
          };

          var map = new google.maps.Map(document.getElementById('map'), mapOptions);

          map.mapTypes.set('map_style', styledMap);
          map.setMapTypeId('map_style');
          }

          google.maps.event.addDomListener(window, 'load', initMap);
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page

      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
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
