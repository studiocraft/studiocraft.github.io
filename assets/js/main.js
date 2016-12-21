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
        function smoothScroll(event) {
          event.preventDefault();
          if(location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
              $('html,body').animate({
                scrollTop: target.offset().top
              }, 1000);
              return false;
            }
          }
        }

        function scroller() {
          var targets = document.querySelectorAll('[data-scroll]');
          for (i = 0; i < targets.length; ++i) {
            targets[i].addEventListener("click", smoothScroll, false);
          }
        }

        window.onload = function(event) {
          event.preventDefault();
          var windowElement = $('html');
          var bodyElement = $('body');
          var loaderOverlay = document.getElementById('loaderOverlay');
          if (loaderOverlay && loaderOverlay.parentNode && loaderOverlay.parentNode.nodeType === 1) {
            setTimeout(function() {
              loaderOverlay.parentNode.removeChild(loaderOverlay);
              loaderOverlay = null;
              windowElement.removeClass('overflow-hidden');
              bodyElement.addClass('animated fadeInBig');
              scroller();
            }, 1500);
          }
        };

      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
        new WOW().init();
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page
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
            zoom: 12,
            scrollwheel: false,
            draggable: true
          };

          function setMarkers(map) {
            var marker = new google.maps.Marker({
              position: myLatLng,
              map: map,
              icon:  {
                path: google.maps.SymbolPath.CIRCLE,
                strokeWeight: 5,
                strokeColor: '#FFD700',
                scale: 7
              },
            });
          }

          var map = new google.maps.Map(document.getElementById('map'), mapOptions);

          map.mapTypes.set('map_style', styledMap);
          map.setMapTypeId('map_style');
          setMarkers(map);
          }

          google.maps.event.addDomListener(window, 'load', initMap);
      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
        $("#mc-embedded-subscribe-form").submit(function(e) {
          e.preventDefault();
          $.ajax({
            type: 'GET',
            url:  $(this).attr('action'),
            data: $(this).serialize(),
            cache: false,
            dataType: 'jsonp',
            jsonp: 'c',
            contentType: 'application/json; charset=utf-8',
            success: function(data){
              if (data.result != 'success') {
                $('#mc_response').addClass('animated fadeInUp').html('<p>' + data.msg + '</p>');
              } else {
                $('#mc_response').addClass('animated fadeInUp').html('<h1>Thank You.</h1><p>' + data.msg + '</p>');
              }
            },
            error: function(err){
              $('#mc_response').addClass('animated fadeInUp').html('<p>' + data.msg + '</p>');
            }
          });
        });
      }
    },
    // Strategy page
    'strategy': {
      init: function() {
        // JavaScript to be fired on the Strategy page
        // new Morris.Line({
        //   // ID of the element in which to draw the chart.
        //   element: 'lineGraph',
        //   // Chart data records -- each entry in this array corresponds to a point on
        //   // the chart.
        //   data: [
        //     { year: '2008', value: 20 },
        //     { year: '2009', value: 10 },
        //     { year: '2010', value: 5 },
        //     { year: '2011', value: 5 },
        //     { year: '2012', value: 20 }
        //   ],
        //   // The name of the data record attribute that contains x-values.
        //   xkey: 'year',
        //   // A list of names of data record attributes that contain y-values.
        //   ykeys: ['value'],
        //   // Labels for the ykeys -- will be displayed when you hover over the
        //   // chart.
        //   labels: ['Value']
        // });

        // new Morris.Line ({
        //   // ID of the element in which to draw the chart.
        //   element: 'lineAreaGraph',
        //   // Chart data records -- each entry in this array corresponds to a point on
        //   // the chart.
        //   data: [
        //     { y: '1979', a: 638, b: 875, c: 757 },
        //     { y: '1984', a: 570, b: 829, c: 701 },
        //     { y: '1989', a: 548, b: 834, c: 692 },
        //     { y: '1994', a: 485, b: 788, c: 665 },
        //     { y: '1999', a: 491, b: 824, c: 696 },
        //     { y: '2004', a: 503, b: 828, c: 719 },
        //     { y: '2009', a: 501, b: 801, c: 691 },
        //     { y: '2014', a: 488, b: 761, c: 668 }
        //   ],
        //   // The name of the data record attribute that contains x-values.
        //   xkey: 'y',
        //   // A list of names of data record attributes that contain y-values.
        //   ykeys: ['a', 'c', 'b'],
        //   // Labels for the ykeys -- will be displayed when you hover over the
        //   // chart.
        //   labels: ['Less than High school', 'High school graduate', 'Some college or associate degree'],
        // });

        new Morris.Bar ({
          element: 'wageGender',
          data: [
            { y: '16 - 24', a: 451, b: 493 },
            { y: '25 - 34', a: 679,  b: 755 },
            { y: '35 - 44', a: 781,  b: 964 },
            { y: '45 - 54', a: 780,  b: 1011 },
            { y: '55 - 64', a: 780,  b: 1021 },
            { y: '65 and older', a: 740,  b: 942 }
          ],
          xkey: 'y',
          ykeys: ['a', 'b'],
          labels: ['Women', 'Men'],
          hideHover: 'auto',
          barColors: ['#FF725C', '#357EDD'],
          grid: true,
          axes: true,
          gridTextColor: '#F4F4F4',
          resize: true
        });

        new Morris.Donut({
          element: 'internetPenetration_in',
          data: [
            {label: "Users", value: 462124989  },
            {label: "Non-Users", value: 864676587}
          ],
          colors: ['#001b44','#FF4136'],
          formatter: function (value, data) {
            return Math.round(value/1326801576*100) + '%';   },
          resize: true
        });

        new Morris.Donut({
          element: 'internetPenetration_cn',
          data: [
            {label: "Users", value: 721434547  },
            {label: "Non-Users", value: 660888785}
          ],
          colors: ['#001b44','#FF4136'],
          formatter: function (value, data) {
            return Math.round(value/1382323332*100) + '%';   },
          resize: true
        });

        new Morris.Donut({
          element: 'internetPenetration_rs',
          data: [
            {label: "Users", value: 102258256 },
            {label: "Non-Users", value: 41181576 }
          ],
          colors: ['#001b44','#FF4136'],
          formatter: function (value, data) {
            return Math.round(value/143439832*100) + '%'; },
          resize: true
        });

        new Morris.Donut({
          element: 'internetPenetration_us',
          data: [
            {label: "Users", value: 286942362    },
            {label: "Non-Users", value: 37176425  }
          ],
          colors: ['#001b44','#FF4136'],
          formatter: function (value, data) {
            return Math.round(value/324118787*100) + '%'; },
          resize: true
        });

        new Morris.Bar({
          element: 'appRevenue',
          data: [
            { y: '2011', a: 5, b: 7, c: 88 },
            { y: '2012', a: 6, b: 10, c: 84 },
            { y: '2013', a: 8,  b: 15, c: 77 },
            { y: '2014', a: 9,  b: 22, c: 69 },
            { y: '2015', a: 11,  b: 25, c: 64 },
            { y: '2016', a: 12,  b: 40, c: 48 },
            { y: '2017 (Projected)', a: 15, b: 48, c: 37 }
          ],
          xkey: 'y',
          ykeys: ['a', 'b', 'c'],
          stacked: true,
          hideHover: true,
          labels: ['Advertising', 'In-app purchases', 'Paid-for'],
          postUnits: '%',
          gridTextColor: '#F4F4F4',
          barColors: ['#357edd','#001b44','#333333'],
          resize: true
        });

      },
      finalize: function() {
        // JavaScript to be fired on the Strategy page, after the init JS
      }
    },
    'design': {
      init: function() {
        // JavaScript to be fired on the Design page
      },
      finalize: function() {
        // JavaScript to be fired on the Design page, after the init JS

        setInterval(function() {
          function r(el, deg) {
            el.setAttribute('transform', 'rotate('+ deg +' 50 50)');
          }
          var d = new Date();
          r(sec, 6*d.getSeconds());
          r(min, 6*d.getMinutes());
          r(hour, 30*(d.getHours()%12) + d.getMinutes()/2);
        }, 1000);

        $(window).on("load", function() {
          var media = $('#autoplay > video');
          media.get(0).play();
        });

        $(window).on("load", function() {
          particlesJS("particles-js", {
            "particles": {
              "number": {
                "value": 320,
                "density": {
                  "enable": true,
                  "value_area": 800
                }
              },
              "color": {
                "value": "#FF725C"
              },
              "shape": {
                "type": "circle",
                "stroke": {
                  "width": 0,
                  "color": "#ffffff"
                },
                "polygon": {
                  "nb_sides": 5
                },
                "image": {
                  "src": "",
                  "width": 100,
                  "height": 100
                }
              },
              "opacity": {
                "value": 0.6,
                "random": false,
                "anim": {
                  "enable": false,
                  "speed": 1,
                  "opacity_min": 0.1,
                  "sync": false
                }
              },
              "size": {
                "value": 3,
                "random": true,
                "anim": {
                  "enable": false,
                  "speed": 40,
                  "size_min": 0.1,
                  "sync": false
                }
              },
              "line_linked": {
                "enable": false,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
              },
              "move": {
                "enable": true,
                "speed": 1,
                "direction": "left",
                "random": true,
                "straight": true,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                  "enable": false,
                  "rotateX": 600,
                  "rotateY": 1200
                }
              }
            },
            "interactivity": {
              "detect_on": "canvas",
              "events": {
                "onhover": {
                  "enable": false,
                  "mode": "grab"
                },
                "onclick": {
                  "enable": true,
                  "mode": "repulse"
                },
                "resize": true
              },
              "modes": {
                "grab": {
                  "distance": 140,
                  "line_linked": {
                    "opacity": 1
                  }
                },
                "bubble": {
                  "distance": 400,
                  "size": 40,
                  "duration": 2,
                  "opacity": 8,
                  "speed": 3
                },
                "repulse": {
                  "distance": 200,
                  "duration": 0.4
                },
                "push": {
                  "particles_nb": 4
                },
                "remove": {
                  "particles_nb": 2
                }
              }
            },
            "retina_detect": true
          });
        });
      }
    }
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
