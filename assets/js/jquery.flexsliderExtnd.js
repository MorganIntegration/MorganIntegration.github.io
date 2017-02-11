/*!
 * FLEXSLIDER CONVERTER
 * Copyright (c) 2013 Noah John Ucab
 */
(function($){
    $.fn.flexsliderExtnd = function() {
        if(this.length > 0) {
            var slider = this, sliderId = slider.attr('id'), itemClass = slider.data('item-class'), slideContainer = slider.data('slides-container'), sliderShowRows = slider.data('show-rows');

            if(slider.find('.flexslider').length <= 0) {
                slider.find('.'+slideContainer).append('<div id="'+sliderId+'-flexslider" class="flexslider controlnav-top"><div class="slides"></div></div>');

                slider.find('.'+itemClass).each(function(ind) {
                    $(this).clone().removeClass().addClass(itemClass+' clearfix notransition text-center').css({'width' : '100%'}).appendTo(slider.find('.slides'));
                });

                var itemCols = slider.find('.slides>div');

                itemCols.each(function(ind) {
                    if(ind % sliderShowRows === 0) {
                        var elementsToWrap = $(this).prevAll().not('.wrapCol');
                        var temp = [];
                        for(var j=0; j < elementsToWrap.size(); j++){
                            temp[(elementsToWrap.size()-1) - j] = elementsToWrap.eq(j)[0];
                        }
                        $(temp).wrapAll('<div class="wrapCol" />');
                    }
                });
                slider.find('.slides').children().not('.wrapCol').wrapAll('<div class="wrapCol" />');
                $('#'+sliderId+'-flexslider').flexslider({
                    selector: ".slides > div",
                    animation: "slide",
                    animationLoop: true,
                    slideshowSpeed: 60000,
                    itemWidth: 210,
                    itemMargin: 15,
                    minItems: 1,
                    maxItems: 1,
                    controlNav: true,
                    directionNav: false,
                    before: function(slider){
                        $('#'+sliderId+'-flexslider').resize();
                    }

                });
            }
            $(window).on('orientationchange', function() {
                // if((Modernizr.mq('(max-width: 479px) and (orientation: portrait)') || Modernizr.mq('(max-width: 769px) and (orientation: landscape)')) && Modernizr.touch) {
                if( Modernizr.mq('(max-width: 769px)') ) {
                    slider.find('.'+slideContainer+'>.row').css('display', 'none');
                    slider.find('.flexslider').css('display', 'block');
                } else {
                    slider.find('.'+slideContainer+'>.row').css('display', 'block');
                    slider.find('.flexslider').css('display', 'none');
                }

                setTimeout(function() {
                    $('#'+sliderId+'-flexslider').resize();
                },500);
            
            });
            $(window).trigger('orientationchange');
        }
    };
    
})( jQuery );