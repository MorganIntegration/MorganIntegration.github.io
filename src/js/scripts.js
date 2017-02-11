/*--------------------------------------*/
/* BONITO
/*--------------------------------------*/
/* global jQuery: false, Chart: false, Modernizr: false, google: false */
var bonito = false, bonito_single = false;
jQuery(function($) {
	/*"use strict";*/
	var map;
	var bounds;
	var geocoder;
	var latlng, geocodeRes;
	var address = "Los Angeles, California";

	bonito_single = function() {
		return {
			init: function() {

				// SHARRRE
				// -----------
				$('.total-shares').sharrre({
					share: {
						googlePlus: true,
						facebook: true,
						twitter: true
					},
					enableHover:false,
					template: '<div class="box"><div class="count">{total} <i class="fa fa-share-square"></i></div></div>',
					enableTracking: true,
				});
				$('.twitter').sharrre({
					share: {
						twitter: true
					},
					template: '<a class="box" href="#"><div class="count" href="#">{total}</div><div class="share"><i class="fa fa-twitter-square"></div></a>',
					enableHover: false,
					enableTracking: true,
					buttons: {
						twitter: {
							via: '_JulienH'
						}
					},
					click: function (api) {
						api.simulateClick();
						api.openPopup('twitter');
					}
				});
				$('.facebook').sharrre({
					share: {
						facebook: true
					},
					template: '<a class="box" href="#"><div class="count" href="#">{total}</div><div class="share"><i class="fa fa-facebook-square"></i></div></a>',
					enableHover: false,
					enableTracking: true,
					click: function (api) {
						api.simulateClick();
						api.openPopup('facebook');
					}
				});
				$('.googleplus').sharrre({
					share: {
						googlePlus: true
					},
					template: '<a class="box" href="#"><div class="count" href="#">{total}</div><div class="share"><i class="fa fa-google-plus-square"></div></a>',
					enableHover: false,
					enableTracking: true,
					click: function (api) {
						api.simulateClick();
						api.openPopup('googlePlus');
					}
				});
				$('.linkedin').sharrre({
					share: {
						linkedin: true
					},
					template: '<a class="box" href="#"><div class="count" href="#">{total}</div><div class="share"><i class="fa fa-linkedin-square"></div></a>',
					enableHover: false,
					enableTracking: true,
					click: function (api) {
						api.simulateClick();
						api.openPopup('linkedin');
					}
				});
			}
		};
	}();

	bonito = function() {
		return {
			navbar: $('#navigation'),
			header: $('header'),
			csstransitions: Modernizr.csstransitions,
			isTouchDevice: Modernizr.touch,
			durationAnim: 200,
			anchoring: false,
			debug: true,
			el: {},
			homeRevoSlider: null,
			defaultLayout: 'wide',
			homeUrl : window.location.protocol + "//" + window.location.host + window.location.pathname,
			mapSettings : {
				latLng : "37.322998,-122.032182",
				mapAddress: "Cupertino, Ca. 95014 United States"
			},
			mq: { 
				phoneWidth : '799px', 
				tabletWidth : '800px',
				mediumWidth: '992px',
				largeWidth: '1200px',
				screen_xs_max : '768px',
				screen_xs_min : '480px',
				screen_sm_max : '991px',
				screen_sm_min : '769px',
				screen_md_max : '1199px',
				screen_md_min : '992px',
				screen_lg_min : '1200px'
			},
			log: function(msg) {
				if (bonito.debug) {
					return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
				}
			},
			isEmpty: function(value) {
				return (typeof value === "undefined" || value === null);
			},
			jsTrans:{
				navSmall: function(){
					bonito.el.logo.animate({ width: 84 }, { queue: false, duration: bonito.durationAnim });
					bonito.el.menu.animate({ paddingTop: bonito.el.defMenuPTop - 24, paddingBottom: bonito.el.defMenuBottom - 24 }, { queue: false, duration: bonito.durationAnim });
					bonito.el.navbarBrandLink.animate({ paddingTop: bonito.el.navbarBrandLinkPTop - 19, paddingBottom: bonito.el.navbarBrandLinkPBottom - 19 }, { queue: false, duration: bonito.durationAnim });
					bonito.el.navbarNav.animate({ paddingTop: bonito.el.navbarNavPTop, paddingBottom: bonito.el.navbarNavPBottom }, { queue: false, duration: bonito.durationAnim });
					bonito.el.body.animate({ paddingTop: bonito.el.bodyPTop }, { queue: false, duration: bonito.durationAnim });
				},
				navLarge: function(){
					bonito.el.logo.animate({ width: '100%' }, { queue: false, duration: bonito.durationAnim });
					bonito.el.menu.animate({ paddingTop: bonito.el.defMenuPTop, paddingBottom: bonito.el.defMenuBottom }, { queue: false, duration: bonito.durationAnim });
					bonito.el.navbarBrand.animate({ 'font-size': bonito.el.navbarBrandFontSize }, { queue: false, duration: bonito.durationAnim });
					bonito.el.navbarBrandLink.animate({ paddingTop: bonito.el.navbarBrandLinkPTop, paddingBottom: bonito.el.navbarBrandLinkPBottom }, { queue: false, duration: bonito.durationAnim });
					bonito.el.navbarNav.animate({ paddingTop: bonito.el.navbarNavPTop, paddingBottom: bonito.el.navbarNavPBottom }, { queue: false, duration: bonito.durationAnim });
					bonito.el.body.animate({ paddingTop: bonito.el.bodyPTop }, { queue: false,	duration: bonito.durationAnim });
					bonito.navbar.animate({ 'min-height: ': bonito.el.headerDefault }, { queue: false, duration: bonito.durationAnim });
				}
			},
			mapInitialize: function(){
				latlng = new google.maps.LatLng(34.052234,-118.243685);
				var mapOptions = {
					navigationControl: false,
					streetViewControl: false,
					mapTypeControl: true,
					panControl: false,
					zoomControl: false,
					scrollwheel: false,
					zoom: 14,
					center: latlng,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				map = new google.maps.Map(document.getElementById("contact-googlemap"),
					mapOptions);
				geocoder = new google.maps.Geocoder();
				bounds = new google.maps.LatLngBounds();

				google.maps.Map.prototype.panToWithOffset = function(latlng, offsetX, offsetY) {
					map = this;
					var ov = new google.maps.OverlayView();
					ov.onAdd = function() {
						var proj = this.getProjection();
						var aPoint = proj.fromLatLngToContainerPixel(latlng);
						aPoint.x = aPoint.x+offsetX;
						aPoint.y = aPoint.y+offsetY;
						map.panTo(proj.fromContainerPixelToLatLng(aPoint));
					};
					ov.draw = function() {};
					ov.setMap(this);
				};
			},
			mapAddMarkerToMap: function (location){
				geocodeRes = location;
				new google.maps.Marker({
					map: map,
					position: location,
					icon: 'src/img/map-marker.png'
				});
				map.panToWithOffset(latlng, 250, 0);
			},
			scrollPositionActions: function(){
				//Show/Hide scrollTop button
				if ( $(window).scrollTop() < 20 ) {
					$('.gototop').fadeOut(300);
				} else {
					$('.gototop').fadeIn(300);
				}
				// No need to animate navigation on small viewports or touch devices
				if(bonito.isTouchDevice || Modernizr.mq('only all and (max-width: '+bonito.mq.mediumWidth+')'))
					return false;
				// Nav large/small switcher
				if($(window).scrollTop() > 80 ) {
					$('body').addClass('scrl_gt_60');
				}else{
					$('body').removeClass('scrl_gt_60');
				}
			},
			inject: function(src, cb, target){
				target = target || document.body;
				//remove the old script if exists
				$('script').each(function() {
					if (this.src.substring(0, 31) === src) {
						$(this).remove();
					}
				});
				
				var s = document.createElement('SCRIPT');
				s.charset = 'UTF-8';
				if(typeof cb === 'function'){
					s.onload = function(){
						cb(s);
					};
					s.onreadystatechange = function () {
						return (/loaded|complete/).test(s.readyState) && cb(s);
					};
				}
				s.src = src;
				target.appendChild(s);
				return s;
			},
			init: function(options) {

				var settings;
				settings = {
					complete: null
				};
				settings = $.extend(settings, options);

				// NAVIGATION 
				// ------------------------------------
				$('header > div').onePageNav({
					easing: 'easeInOutExpo',
					currentClass: 'current',
					changeHash: false,
					scrollSpeed: 1200,
					scrollOffset: 70,
					scrollThreshold: 1,
					filter: ':not(.external)',
					begin: function(){
						bonito.anchoring = true;
						this.scrollOffset = parseInt($('body').css('padding-top'),10);
					},
					end: function() {
						bonito.scrollPositionActions();
						bonito.anchoring = false;
					},
					scrollChange: function($currentListItem) {
						if(!(bonito.isTouchDevice || Modernizr.mq('only all and (max-width: '+bonito.mq.mediumWidth+')'))){						
							setTimeout(function(){
								bonito.scrollPositionActions();
							}, 1000);
							bonito.scrollPositionActions();
						}
					}
				});
				
				// RESPONSIVE VIDEO
				// ---------------------------------
				$('.post-type-video').fitVids();
				$('.video-wrapper').fitVids();

				// disable style background image selector and layout style
				if(bonito.isTouchDevice) {
					$('#layout-style-selector').css({'display' : 'none'});
					$('#bg-img-selector').css({'display' : 'none'});
					/**
					 * Positioning and virtual keyboard
					 * Fixed positioned elements are displaced when the virtual keyboard appears
					 */
						$("body").mobileFix({ // Pass parent to apply to
							inputElements: "input,textarea,select", // Pass activation child elements
							addClass: "fixfixed" // Pass class name
						});
				}

				// fix for scroll throttling - waypoint
				$.waypoints.settings.scrollThrottle = 500;

				// ANIMATION WHEN SECTION COME INTO VIEW
				// ------------------------------------
				$('.wpb_animate_when_almost_visible').waypoint({
					handler: function(direction) {
						if(direction == 'down') {
							$(this).removeClass('wpb_animate_when_almost_visible').addClass('wpb_start_animation');
						}
					},
					offset: function() {
						return $(window).height() - 100;
					}
				});

				// NAVBAR SHRINK TO SMALL WHEN SCROLLING DOWN
				// ------------------------------------------
				this.el.headerDefault          = parseInt(this.header.css('height'),10);
				this.el.menu                   = $('nav .flexnav > li > a');
				this.el.defMenuPTop            = parseInt(this.el.menu.css('padding-top'),10);
				this.el.defMenuBottom          = parseInt(this.el.menu.css('padding-bottom'),10);
				this.el.body                   = $('body');
				this.el.bodyPTop               = parseInt(this.el.body.css('padding-top'),10);
				this.el.navbarNav              = $('#navigation ul.navbar-nav > li > ul a');
				this.el.navbarNavPTop          = this.el.navbarNav.css('padding-top');
				this.el.navbarNavPBottom       = this.el.navbarNav.css('padding-bottom');
				this.el.navbarBrand            = bonito.navbar.find('.navbar-brand');
				this.el.navbarBrandFontSize    = parseInt(this.el.navbarBrand.css('font-size'),10);
				this.el.navbarBrandLink        = $('#navbar .navbar-brand');
				this.el.navbarBrandLinkPTop    = parseInt(this.el.navbarBrandLink.css('padding-top'),10);
				this.el.navbarBrandLinkPBottom = parseInt(this.el.navbarBrandLink.css('padding-bottom'),10);
				this.el.logo                   = $('#navbar .navbar-brand img');

				// INITIALIAZE PLUGINS
				// ------------------------------------
				this.loadPlugins();
				this.loadWidget();
				
				// NAVIGATE TO TOP
				// ------------------------------------
				$('.gototop').on('click', function(e) {
					e.preventDefault();
					var targetOffset = bonito.el.headerDefault;
					$('html, body').stop().animate(
						{scrollTop: -targetOffset},
						{duration: 1200, easing: 'easeInOutExpo'}
					);
				});

				// TRANSFORM FEATURE ITEMS TO SLIDER
				// ---------------------------------
				$('#features .features').flexsliderExtnd();
				$('#services .services').flexsliderExtnd();


				if ($.isFunction(settings.complete)) {
					settings.complete.call(this);
				}
			},
			initIgnoreAJAX: function(){
				// FLEXNAV
				// ------------------
				bonito.navbar.find('.flexnav').flexNav({
					hoverIntent: 'no'
				});
				
				$('.menu-button').on('click' , function() {
					if ( $('.flexnav').hasClass('sm-screen') )
						if(!$('html').hasClass('flexnav-show')){
							$('html').addClass('flexnav-show');
							$('#navigation').addClass('scrollable');
						}else{
							$('html').removeClass('flexnav-show');
							$('#navigation').removeClass('scrollable');
						}
				});

				var selScrollable = '.scrollable';
				// Uses document because document will be topmost level in bubbling
				$(document).on('touchmove',function(e){
						if($('html').hasClass('flexnav-show'))
							e.preventDefault();
				});
				// Uses body because jQuery on events are called off of the element they are
				// added to, so bubbling would not work if we used document instead.
				$('body').on('touchstart', selScrollable, function(e) {
					if($('html').hasClass('flexnav-show')){					
						if (e.currentTarget.scrollTop === 0) {
							e.currentTarget.scrollTop = 1;
						} else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
							e.currentTarget.scrollTop -= 1;
						}
					}
				});
				// Stops preventDefault from being called on document if it sees a scrollable div
				$('body').on('touchmove', selScrollable, function(e) {
					if($('html').hasClass('flexnav-show'))
						e.stopPropagation();
				});
				// STYLE SWITCHER
				// ---------------------------------
				var isEmpty = function(value) {
					return (typeof value === "undefined" || value === null);
				};

				$('#theme-options-wrapper').append('<link type="text/css" rel="stylesheet" id="colors" href="#" media="all" />');
				$('.style-switcher-toggle').click(function(e) {
					e.preventDefault();
					var style_switcher_wrapper = $("#style-switcher");
					if(style_switcher_wrapper.hasClass('collapsed')) {
						style_switcher_wrapper.animate({ right: "-158px" });
						style_switcher_wrapper.removeClass('collapsed');
					} else {
						style_switcher_wrapper.animate({ right: "0px" });
						style_switcher_wrapper.addClass('collapsed');
					}
				});
				$('#style-switcher .colors li').on('click', 'a', function(e) {
					e.preventDefault();
					var selectedColor = $(this).data('color'), themeColorUrl = window.location.protocol + "//" + window.location.host +"/src/css/colors/" + selectedColor + ".css";
					if(!isEmpty(selectedColor)) {
						$('body,#page,.navbar-header,#navigation>ul>li>a,.navbar-brand').addClass('notransition');
						$("#colors").attr("href", themeColorUrl );
						setTimeout(function(){
							$('body,#page,.navbar-header,#navigation>ul>li>a,.navbar-brand').removeClass('notransition');	
						},2000);
					}					
				});
				$('#layout-style').on('change', function() {
					if($(this).val() === 'boxed' ) {
						$('body').addClass('boxed');
					} else {
						$('body').removeClass('boxed');
						$('body').css({ 'background-image' : '' });
					}
					$('body').addClass('notransition');
					$(window).trigger('resize');
					$('body').removeClass('notransition');
				});
				$('#style-switcher .backgrounds li').on('click', 'a', function(e) {
					e.preventDefault();
					var $this = $(this);
					if($('#layout-style').val() !== 'boxed' ) {
						alert('Please select boxed layout.');
						return;
					} else {
						var dataBg = $this.attr('data-bonitoBg');
						$('body').addClass('custom-bg');
						var bgUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + 'src/img/backgrounds/' + dataBg;
						$('body').addClass('notransition');
						$('html,body').css( { 'background-image' : 'url("'+bgUrl+'")' });
						$('html,body').removeClass('notransition');
					}
				});

				// AJAX PAGE LOAD
				// --------------------------------
				$('header a').ajaxPageLoad({
					anchorsWrapper: 'nav',
					target: '#page',
					activeNavItem: $('nav .active a'),
					animationOverride: function(){
						return !(bonito.isTouchDevice || Modernizr.mq('only all and (max-width: '+bonito.mq.screen_xs_max+')'));
					},
					click: function(){
						bonito.navbar.find('.flexnav ul').removeClass('flexnav-show').stop(true, true).animate({
							height: ["hide", "swing"]
						}, bonito.durationAnim);
						$('html').removeClass('flexnav-show');
						$('ul').removeClass('flexnav-show');
					},
					printOverride: function(navItem,$card,data){
						return false;
					},
					complete: function(navItem,$card,data){
						//Due an empty print override is called
						//now we set opacity to 0 and then show the contents
						$card.append($(data).find('#content-wrapper').css('opacity',0).parent().html()).show();
						bonito.init();
						var $flexslider = $('.flexslider');
						if(navItem.hash){
							$(window).trigger('resize');
							setTimeout(function() {
								// Do something after 3 seconds
								$card.removeClass('loading').removeAttr('style');
								$card.find('.loader').remove();
								//Resize flexslider so it's centered on the screen
								if($flexslider.length)$flexslider.each(function(){$(this).resize();});
								bonito.scrollPositionActions();
								$('#content-wrapper').hide().removeAttr('style').fadeIn(1000);
								var offsetTop = $('#'+navItem.hash).offset().top;
								$(window).scrollTop(offsetTop-parseInt($('body').css('padding-top'),10));
							}, 3300);
						}else{
							$card.removeClass('loading').removeAttr('style');
							$('#content-wrapper').removeAttr('style');
							$card.find('.loader').remove();
							$(window).trigger('resize');
							bonito.scrollPositionActions();
						}
						//Reload neccessary scripts
						bonito.inject('assets/js/modalEffects.min.js');
						$('#page').removeClass('noTransition');
					}
				});

				
			},

			// LOAD PLUGINS
			loadPlugins: function() {

				// LIGHTBOX IMAGES
				// ------------------------------------
				$('.gallery-works').magnificPopup({
					delegate: 'a',
					tLoading: 'Loading image #%curr%...',
					type:'image',
					removalDelay: 200,
					image: {
						verticalFit: true,
						markup: '<div class="mfp-figure">'+
									''+
										'<div class="button-close-wrapper clearfix"><div class="mfp-close"></div></div>'+
										'<div class="popup-image-wrapper"><div class="mfp-img"></div></div>'+
										'<div class="mfp-bottom-bar clearfix">'+
											'<div class="mfp-title"></div>'+
											'<div class="mfp-counter"></div>'+
										'</div>'+
									''+
								'</div>',
						cursor: null,
						titleSrc: 'title',
						tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
					},
					gallery: {
						enabled: true,
						preload: [0,1],
						navigateByImgClick: true,
						tCounter: 'Image %curr% of %total%'
					},
					fixedBgPos: true,
					overflowY: 'scroll',
					closeBtnInside: true,
					fixedContentPos:true,
					preloader: false,
					midClick: true,
					closeOnContentClick: true,
					callbacks: {
						beforeOpen: function() {
							if(!bonito.isTouchDevice) {
								// just a hack that adds mfp-anim class to markup 
								this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
								this.st.mainClass = this.st.el.attr('data-effect');
							}							
						}
					},
					retina: {
						ratio: 1, // Increase this number to enable retina image support.
						// Image in popup will be scaled down by this number.
						// Option can also be a function which should return a number (in case you support multiple ratios). For example:
						// ratio: function() { return window.devicePixelRatio === 1.5 ? 1.5 : 2  }
						replaceSrc: function(item) {
							return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
						}
					}
				});

				// TOOLTIP
				// ------------------------------------				
				$("[data-toggle='tooltip']").tooltip();

				// FLEXSLIDER 
				// ------------------------------------		
				$('.post-gallery-slider').flexslider({
					selector: ".post-gallery-slides > li",
					animation: "fade",
					easing: "swing",
					useCSS: false,
					animationLoop: false,
					slideshowSpeed: 5000,
					animationSpeed: 600,
					slideshow: true,
					prevText: "",
					nextText: "",
					directionNav: true,
					controlNav: false,
					controlsContainer: $('.post-gallery-slider')
				});

				// ALERTS
				// ------------------
				$('.alert').on('close.bs.alert', function(e) {
					e.preventDefault();
					$(this).fadeOut('slow');
				});

				// TABS 
				// ---------------------
				$('.tab-wrapper .nav-tabs a').on('click', function(e) {
					e.preventDefault();
					$(this).tab("show");
					var anim = $(this).data('animation'), contentWrapper = $(this).closest('.tab-wrapper').find('.tab-content');
					contentWrapper.find('.tab-pane').removeClass('animated '+anim);
					if(anim.length > 0) {
						contentWrapper.find("div.active").addClass("animated " + anim);
					}
				});

				// SINGLE POST
				// -------------------------------
				if($('#single-post').length)
					bonito_single.init();

				// CHARTS AND GRAPHS - animate where it comes to viewport
				// -------------------------------
				if($('#element-charts').length > 0) {
					// CHARTS
					$('#element-charts').waypoint({
						handler: function(direction) {
							if(direction == 'down') {

								// PIE CHART -------
								if($("#pie-chart").length > 0) {
									var ctxPieChart = $("#pie-chart").get(0).getContext("2d"), pieChart = new Chart(ctxPieChart);
									var dataPieChart = [
										{ value: 30, color:"#F38630"},
										{ value : 50, color : "#E0E4CC" },
										{ value : 100, color : "#69D2E7" }
									], optionsPieChart = {
										animation : !bonito.isTouchDevice,
										animationEasing: 'easeInOutExpo'
									};
									pieChart.Pie(dataPieChart,optionsPieChart);
								}

								// DOUGHNUT CHART -------
								if($("#donut-chart").length > 0) {
									var ctxDonutChart = $("#donut-chart").get(0).getContext("2d"), donutChart = new Chart(ctxDonutChart);
									var dataDonutChart = [
										{ value: 30, color:"#F7464A" },
										{ value : 50, color : "#E2EAE9" },
										{ value : 100, color : "#D4CCC5" },
										{ value : 40, color : "#949FB1" },
										{ value : 120, color : "#4D5360" }
									], optionsDonutChart = {
										animation : !bonito.isTouchDevice,
										animationEasing: 'easeInOutExpo'
									};
									donutChart.Doughnut(dataDonutChart,optionsDonutChart);
								}

								// POLAR CHART -------
								if($("#polar-chart").length > 0) {
									var ctxPolarChart = $("#polar-chart").get(0).getContext("2d"), polarChart = new Chart(ctxPolarChart);
									var dataPolarChart = [
										{ value : 30, color: "#D97041" },
										{ value : 90, color: "#C7604C" },
										{ value : 24, color: "#21323D" },
										{ value : 58, color: "#9D9B7F" },
										{ value : 82, color: "#7D4F6D" },
										{ value : 8, color: "#584A5E" }
									], optionsPolarChart = {
										animation : !bonito.isTouchDevice,
										animationEasing: 'easeInOutExpo'
									};
									polarChart.PolarArea(dataPolarChart,optionsPolarChart);
								}
							}
						},
						triggerOnce: true,
						offset: function() {
							return $(window).height();
						}
					});
				}
				if($('#element-graphs').length > 0) {
					// GRAPHS
					$('#element-graphs').waypoint({
						handler: function(direction) {
							if(direction == 'down') {

								// BAR GRAPH -------
								if($("#bar-graph").length > 0) {
									var ctxBarGraph = $("#bar-graph").get(0).getContext("2d"), barGraph = new Chart(ctxBarGraph);
									var dataBarGraph = {
										labels : ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
										datasets : [
											{ fillColor : "rgba(220,220,220,0.5)", strokeColor : "rgba(220,220,220,1)", data : [65,59,90,81,56,55,40]
											}, { fillColor : "rgba(151,187,205,0.5)", strokeColor : "rgba(151,187,205,1)", data : [28,48,40,19,96,27,100] }
										]
									}, optionsBarGraph = {
										animation : !bonito.isTouchDevice,
										animationEasing: 'easeInOutExpo'
									};
									barGraph.Bar(dataBarGraph,optionsBarGraph);
								}

								// RADAR GRAPH -------
								if($("#radar-graph").length > 0) {
									var ctxRadarGraph = $("#radar-graph").get(0).getContext("2d"), radarGraph = new Chart(ctxRadarGraph);
									var dataRadarGraph = {
										labels : ["Eating","Drinking","Sleeping","Designing","Coding","Partying","Running"],
										datasets : [
											{ fillColor : "rgba(220,220,220,0.5)", strokeColor : "rgba(220,220,220,1)", pointColor : "rgba(220,220,220,1)", pointStrokeColor : "#fff", data : [65,59,90,81,56,55,40] },
											{ fillColor : "rgba(151,187,205,0.5)", strokeColor : "rgba(151,187,205,1)", pointColor : "rgba(151,187,205,1)",pointStrokeColor : "#fff", data : [28,48,40,19,96,27,100] }
										]
									}, optionsRadarGraph = {
										animation : !bonito.isTouchDevice,
										animationEasing: 'easeInOutExpo'
									};
									radarGraph.Radar(dataRadarGraph,optionsRadarGraph);
								}

								// LINE GRAPH -------
								if($("#line-graph").length > 0) {
									var ctxLineGraph = $("#line-graph").get(0).getContext("2d"), lineGraph = new Chart(ctxLineGraph);
									var dataLineGraph = {
										labels : ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
										datasets : [
											{ fillColor : "rgba(220,220,220,0.5)", strokeColor : "rgba(220,220,220,1)", pointColor : "rgba(220,220,220,1)",pointStrokeColor : "#fff", data : [65,59,90,81,56,55,40] },
											{ fillColor : "rgba(151,187,205,0.5)", strokeColor : "rgba(151,187,205,1)", pointColor : "rgba(151,187,205,1)",pointStrokeColor : "#fff", data : [28,48,40,19,96,27,100] }
										]
									}, optionsLineGraph = {
										animation : !bonito.isTouchDevice,
										animationEasing: 'easeInOutExpo'
									};
									lineGraph.Line(dataLineGraph,optionsLineGraph);
								}
							}
						},
						triggerOnce: true,
						offset: function() {
							return $(window).height();
						}
					});
				}

				// CONTACT GOOGGLE MAP
				//  --------------------------------
				if($('#contact-googlemap').length){
					if( (!Modernizr.touch) ){
						// DYNAMIC MAP
						// --------------------------------
						bonito.mapInitialize();
						geocoder.geocode({address: address }, function(results, status){
							if(status == google.maps.GeocoderStatus.OK){
								geocodeRes = results[0].geometry.location;
								bonito.mapAddMarkerToMap(results[0].geometry.location);
							}
						});
						$(window).resize(function(){
							if(bonito.isEmpty()) {
								map.panToWithOffset(latlng, 250, 0);
							}
						});
					} else {
						// STATIC MAP FOR MOBILE
						// ---------------------------------
						var mapUrl, mapAddress;
						if(bonito.debug) {
							mapUrl = bonito.homeUrl + 'img/static-map-los-angeles.png';
						} else {
							mapAddress = bonito.mapSettings.mapAddress;
							mapUrl = "http://maps.googleapis.com/maps/api/staticmap?center="+mapAddress.replace(' ', '+')+"&zoom=15&scale=2&size=1024x260&markers=color:red%7Clabel:A%7C37.322998,-122.032182&sensor=false";
							bonito.log(mapUrl);
						}
						$('#address-map').html('<img height="260" src="'+mapUrl+'" alt="Cupertino, CA" class="img-responsive" />');
					}
				}

				// REVOLUTION SLIDER
				// --------------------------------
				$('.fullwidthbanner > ul').css({ 'opacity' : '1' });
				if($.fn.cssOriginal !== undefined) $.fn.css = $.fn.cssOriginal;
				bonito.homeRevoSlider = $('.fullwidthbanner').revolution({
					delay:9000,
					startwidth:1170,
					startheight:600,

					onHoverStop:"on",						// Stop Banner Timet at Hover on Slide on/off

					thumbWidth:100,							// Thumb With and Height and Amount (only if navigation Tyope set to thumb !)
					thumbHeight:50,
					thumbAmount:3,

					hideThumbs:0,
					navigationType:"bullet",				// bullet, thumb, none
					navigationArrows:"solo",				// nexttobullets, solo (old name verticalcentered), none

					navigationStyle:"round",				// round,square,navbar,round-old,square-old,navbar-old, or any from the list in the docu (choose between 50+ different item), custom


					navigationHAlign:"center",				// Vertical Align top,center,bottom
					navigationVAlign:"bottom",					// Horizontal Align left,center,right
					navigationHOffset:0,
					navigationVOffset:20,

					soloArrowLeftHalign:"left",
					soloArrowLeftValign:"center",
					soloArrowLeftHOffset:20,
					soloArrowLeftVOffset:0,

					soloArrowRightHalign:"right",
					soloArrowRightValign:"center",
					soloArrowRightHOffset:20,
					soloArrowRightVOffset:0,

					touchenabled:"on",						// Enable Swipe Function : on/off

					stopAtSlide:-1,							// Stop Timer if Slide "x" has been Reached. If stopAfterLoops set to 0, then it stops already in the first Loop at slide X which defined. -1 means do not stop at any slide. stopAfterLoops has no sinn in this case.
					stopAfterLoops:-1,						// Stop Timer if All slides has been played "x" times. IT will stop at THe slide which is defined via stopAtSlide:x, if set to -1 slide never stop automatic

					hideCaptionAtLimit:0,					// It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
					hideAllCaptionAtLilmit:0,				// Hide all The Captions if Width of Browser is less then this value
					hideSliderAtLimit:0,					// Hide the whole slider, and stop also functions if Width of Browser is less than this value

					fullWidth:"on",

					shadow:0								//0 = no Shadow, 1,2,3 = 3 Different Art of Shadows -  (No Shadow in Fullwidth Version !)
				});

				
				// TEAMS - MODAL POPUP
				// --------------------------------
				$('.md-trigger').on('click', function() {
					var currModalId = $(this).data('modal'), currModal = $('#'+currModalId), navPrev = currModal.find('.nav-links .prev'), navNext = currModal.find('.nav-links .next');
					if($('.members-list>.'+currModalId).nextAll(':not(.isotope-hidden)').length > 0) navNext.addClass('active');
					else navNext.removeClass('active');
					if($('.members-list>.'+currModalId).prevAll(':not(.isotope-hidden)').length > 0) navPrev.addClass('active');
					else navPrev.removeClass('active');
				});

				$('.modal-teams .nav-links')
				.on('click', 'a.next', function(e) {
					e.preventDefault();
					if(!$(this).hasClass('active')) return;

					var currModal = $(this).closest('.md-modal'), currModalId = currModal.attr('id'), nextModalElem = $('.members-list>.'+currModalId).nextAll(':not(.isotope-hidden)').eq(0), nextModalId = nextModalElem.find('.md-trigger').data('modal'), nextModal = $('#'+nextModalId), overlayBg = $('.md-overlay');
					currModal.removeClass('md-show');
					nextModal.addClass('md-show');

					overlayBg.on('click', function() {
						nextModal.removeClass('md-show');
					});

					if($('.members-list>.'+currModalId).nextAll(':not(.isotope-hidden)').length < 2) {
						nextModal.find('.nav-links a.prev').addClass('active');
						nextModal.find('.nav-links a.next').removeClass('active');
					} else {
						nextModal.find('.nav-links a.prev').addClass('active');
						nextModal.find('.nav-links a.next').addClass('active');
					}
				})
				.on('click', 'a.prev', function(e) {
					e.preventDefault();
					if(!$(this).hasClass('active')) return;

					var currModal = $(this).closest('.md-modal'), currModalId = currModal.attr('id'), prevModalElem = $('.members-list>.'+currModalId).prevAll(':not(.isotope-hidden)').eq(0), prevModalId = prevModalElem.find('.md-trigger').data('modal'), prevModal = $('#'+prevModalId), overlayBg = $('.md-overlay');
					currModal.removeClass('md-show');
					prevModal.addClass('md-show');

					overlayBg.on('click', function() {
						prevModal.removeClass('md-show');
					});
					
					if($('.members-list>.'+currModalId).prevAll(':not(.isotope-hidden)').length < 2) {
						prevModal.find('.nav-links a.prev').removeClass('active');
						prevModal.find('.nav-links a.next').addClass('active');
					} else {
						prevModal.find('.nav-links a.prev').addClass('active');
						prevModal.find('.nav-links a.next').addClass('active');
					}
				});

				// SHARRRE - BLOG POST
				// ---------------------------------

				$('.share-post-box').sharrre({
					className: 'share-post',
					share:{
						googlePlus: true,
						facebook: true,
						twitter: true
					},
					buttons: {
						googlePlus:{
							size: 'medium',
							annotation: 'bubble'
						},
						facebook: {
							layout: 'button_count'
						},
						twitter: {
							count: 'horizontal',
							via: '_JulienH'
						}
					},
					hover: function (api) {
						$(api.element).find('.buttons').addClass('slide-share-buttons');			
					},
					hide: function (api) {
						$(api.element).find('.buttons').removeClass('slide-share-buttons');
					},
					enableHover: !bonito.isTouchDevice,
					enableCounter: !bonito.isTouchDevice,
					enableTracking: true
				});

				// FLEXSLIDER 
				// ------------------------------------		
				$('.company-banner-slider').flexslider({
					selector: ".company-banner-slides > li",
					animation: "fade",
					easing: "swing",
					useCSS: false,
					animationLoop: false,
					slideshowSpeed: 5000,
					animationSpeed: 600,
					slideshow: false,
					prevText: "",
					nextText: "",
					directionNav: true,
					controlNav: false
				});

				// ISOTOPE ELEMENTS
				// ------------------------------------
				// + VARIABLES
				var members_wrapper = $('#members-wrapper .members-list'),works_wrapper = $('#works-wrapper .works-list');

				// + MEMBERS ISOTOPE
				members_wrapper.imagesLoaded(function() {
					var $imgs = members_wrapper.find('img');
					$(this).isotope({
						isResizable: false,
						isFitWidth: true,
						itemSelector : '.member',
						layoutMode : 'sloppyMasonry',
						animationEngine : "best-available"
					});
					$imgs.load(function () {
						members_wrapper.isotope('reLayout');
					});
				});
				$('#team-filter').on('click', 'a', function(e){
					e.preventDefault();
					var selector = $(this).attr('data-filter');
					members_wrapper.isotope({ filter: selector });
					$(this).closest('ul').find('li a').removeClass('selected');
					$(this).addClass('selected');
					members_wrapper.isotope('reLayout');
				});

				// + WORKS ISOTOPE
				works_wrapper.imagesLoaded( function(){
					var $imgs = works_wrapper.find('img');
					$(this).isotope({
						itemSelector : '.isotope-item',
                        layoutMode   : 'masonry'
					});
					$imgs.load(function() {
						works_wrapper.isotope('reLayout');
					}); 
				});
				$('#works-filter').on('click', 'a', function(e){
					e.preventDefault();
					var selector = $(this).attr('data-filter');
					works_wrapper.isotope({ filter: selector });
					$(this).closest('ul').find('li a').removeClass('selected');
					$(this).addClass('selected');
					works_wrapper.isotope('reLayout');
				});

				var eventTriggers = bonito.isTouchDevice ? 'orientationchange' : 'resize';

				$(window).on(eventTriggers, function() {
					works_wrapper.isotope('reLayout');
					members_wrapper.isotope('reLayout');
					works_wrapper.find('img').removeAttr('width').removeAttr('height');
					members_wrapper.find('img').removeAttr('width').removeAttr('height');
				});

				// ISOTOPE FIX FOR ADDING GUTTERWIDTH FOR ISOTOPE.JS
				// Modified Isotope methods for gutters in masonry
				// ------------------------------------------------
				$.Isotope.prototype._getMasonryGutterColumns = function() {
					var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0,
					containerWidth = this.element.width();
					this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth ||
					// Or use the size of the first item
					this.$filteredAtoms.outerWidth(true) ||
					// If there's no items, use size of container
					containerWidth;				 
					this.masonry.columnWidth += gutter;
					this.masonry.cols = Math.floor((containerWidth + gutter) / this.masonry.columnWidth);
					this.masonry.cols = Math.max(this.masonry.cols, 1);
				};
				$.Isotope.prototype._masonryReset = function() {
					// Layout-specific props
					this.masonry = {};
					// FIXME shouldn't have to call this again
					this._getMasonryGutterColumns();
					var i = this.masonry.cols;
					this.masonry.colYs = [];
					while (i--) {
						this.masonry.colYs.push(0);
					}
				};
				$.Isotope.prototype._masonryResizeChanged = function() {
					var prevSegments = this.masonry.cols;
					// Update cols/rows
					this._getMasonryGutterColumns();
					// Return if updated cols/rows is not equal to previous
					return (this.masonry.cols !== prevSegments);
				};

				$.extend( $.easing, {
					easeIn: function (x, t, b, c, d) { return $.easing.easeInQuad(x, t, b, c, d); },
					easeOut: function (x, t, b, c, d) { return $.easing.easeOutQuad(x, t, b, c, d); },
					easeInOut: function (x, t, b, c, d) { return $.easing.easeInOutQuad(x, t, b, c, d); },
					expoin: function(x, t, b, c, d) { return $.easing.easeInExpo(x, t, b, c, d); },
					expoout: function(x, t, b, c, d) { return $.easing.easeOutExpo(x, t, b, c, d); },
					expoinout: function(x, t, b, c, d) { return $.easing.easeInOutExpo(x, t, b, c, d); },
					bouncein: function(x, t, b, c, d) { return $.easing.easeInBounce(x, t, b, c, d); },
					bounceout: function(x, t, b, c, d) { return $.easing.easeOutBounce(x, t, b, c, d); },
					bounceinout: function(x, t, b, c, d) { return $.easing.easeInOutBounce(x, t, b, c, d); },
					elasin: function(x, t, b, c, d) { return $.easing.easeInElastic(x, t, b, c, d); },
					elasout: function(x, t, b, c, d) { return $.easing.easeOutElastic(x, t, b, c, d); },
					elasinout: function(x, t, b, c, d) { return $.easing.easeInOutElastic(x, t, b, c, d); },
					backin: function(x, t, b, c, d) { return $.easing.easeInBack(x, t, b, c, d); },
					backout: function(x, t, b, c, d) { return $.easing.easeOutBack(x, t, b, c, d); },
					backinout: function(x, t, b, c, d) { return $.easing.easeInOutBack(x, t, b, c, d); }
				});
			},

			// LOAD WIDGETS
			loadWidget: function() {
				// FLICKR
				// ------------------------------------
				$('#flickr-feeds').jflickrfeed({
					limit: 10,
					qstrings: { id:'39638504@N07' },
					itemTemplate:
						'<li>' +
							'<a data-effect="mfp-zoom-in" class="mfp-image image-link" href="{{image}}" title="{{title}}">' +
								'<img width="56" height="56" class="img-responsive" src="{{image_s}}" alt="{{title}}" />' +
							'</a>' +
						'</li>'
				});
				$('#flickr-feeds').magnificPopup({
					delegate: 'a',
					tLoading: 'Loading image #%curr%...',
					type:'image',
					removalDelay: 200,
					image: {
						verticalFit: true,
						markup: '<div class="mfp-figure">'+
									''+
										'<div class="button-close-wrapper clearfix"><div class="mfp-close"></div></div>'+
										'<div class="popup-image-wrapper"><div class="mfp-img"></div></div>'+
										'<div class="mfp-bottom-bar clearfix">'+
											'<div class="mfp-title"></div>'+
											'<div class="mfp-counter"></div>'+
										'</div>'+
									''+
								'</div>',
						cursor: null,
						titleSrc: 'title',
						tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
					},
					gallery: {
						enabled: true,
						preload: [0,1],
						navigateByImgClick: true,
						tCounter: 'Image %curr% of %total%'
					},
					fixedBgPos: true,
					overflowY: 'scroll',
					closeBtnInside: true,
					fixedContentPos:true,
					preloader: false,
					midClick: true,
					closeOnContentClick: true,
					callbacks: {
						beforeOpen: function() {
							// just a hack that adds mfp-anim class to markup 
							this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
							this.st.mainClass = this.st.el.attr('data-effect');
						}
					},
					retina: {
						ratio: 1, // Increase this number to enable retina image support.
						// Image in popup will be scaled down by this number.
						// Option can also be a function which should return a number (in case you support multiple ratios). For example:
						// ratio: function() { return window.devicePixelRatio === 1.5 ? 1.5 : 2  }
						replaceSrc: function(item) {
							return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
						}
					}
				});
			},
		};
	}();
	bonito.initIgnoreAJAX();
	bonito.init();
});
(function($) {
	$(window).on('load', function(){
		$(window).trigger('resize');
	});
	$(window).on('orientationchange', function() {

	});
	

	// AJAX CONTACT FORM 
	// ---------------------------------
	
	$(function() {
		// Get the form.
		var form = $('#form-contact-us');
		// Get the messages div.
		var formMessages = $('#contact-form-result');
		// Set up an event listener for the contact form.
		$(form).submit(function(e) {
			// Stop the browser from submitting the form.
			e.preventDefault();
			// Serialize the form data.
			var formData = $(form).serialize();
			// Submit the form using AJAX.
			$.ajax({
				type: 'POST',
				url: $(form).attr('action'),
				data: formData
			})
			.done(function(response) {
				// Make sure that the formMessages div has the 'success' class.
				$(formMessages).removeClass('label label-danger');
				$(formMessages).addClass('label label-success');
				// Set the message text.
				$(formMessages).text(response);
				// Clear the form.
				$('#name').val('');
				$('#email').val('');
				$('#phone').val('');
				$('#subject').val('');
				$('#message').val('');
			})
			.fail(function(data) {
				// Make sure that the formMessages div has the 'error' class.
				$(formMessages).removeClass('label label-success');
				$(formMessages).addClass('label label-danger');
				// Set the message text.
				if (data.responseText !== '') {
					$(formMessages).text(data.responseText);
				} else {
					$(formMessages).text('Oops! An error occured and your message could not be sent.');
				}
			});
		});
	});
	
})(jQuery);