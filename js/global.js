$(function(){

    function footerSetup() {
        setTimeout(function(){
			$('#nav-footer > li > a').each(function() {
				var h = $(this).html();
				var href = $(this).attr('href');
				$(this).replaceWith('<h6><a href="' +href+ '">' + h + '</a></h6>');
			});

			$('#nav-footer .col .sub-menu').removeClass('sub-menu');
			$('#nav-footer .col > a').remove();
			$('#nav-footer .sub-menu li ul').unwrap();
			$('#nav-footer .sub-menu ul').unwrap();
			$('#nav-footer > li').addClass('foot_links');
			$('#nav-footer > li.menu-item').each(function() {
				var i = $(this).index() + 1;
				if (i % 3 == 0) {
					$(this).addClass('foot_links_last');
				};
			});

			var counter = 0
			$('#nav-footer > li.menu-item').each(function() {
				counter++;
				if (counter == 2) {
					$('.footer .utility').append(
						$('<ul class="nav-footer"></ul>')
							.append($('#nav-footer > li.menu-item:nth-child(' + (counter) + ')'))
							.append($('#nav-footer > li.menu-item:nth-child(' + (counter-1) + ')'))
					);
					counter = 0;
				}
			});

			$('#nav-footer').remove();
		},5000);
    }

    function topNavigationClickListener() {
        $('#nav-header .menu-item-has-children>a').bind('click', function(e){
            if(!$(this).parent().hasClass('current')) {
                e.preventDefault();
            }
        });
    }

    function topNavigationDropdowns() {

        topNavigationClickListener();

        var config = {
            sensitivity: 20,
            interval: 50
        };
        $('body').hoverIntent({
            over: function() {
                $(this).find('.sub-menu').show();
                $(this).addClass('current');
            },
            out: function() {
                $(this).find('.sub-menu').hide();
                $(this).removeClass('current');
            }, 
			selector: '.menu-item-has-children'

		});
    }

    function destroyTopNavigationDropdowns() {
        $('#nav-header .menu-item-has-children').unbind();
    }

    function showShareMenu() {
        $('.header .social .social-item.share .social-menu').show();
        $('.header .social .social-item.share .social-link').addClass('current');
        $('#nav-header').addClass('faded');
    }

    function hideShareMenu() {
        $('.header .social .social-item.share .social-menu').hide();
        $('.header .social .social-item.share .social-link').removeClass('current');
        $('#nav-header').removeClass('faded');
    }

    function showSearchMenu() {
        $('.header .social .social-item.search .search-form-container').show();
        $('.header .social .social-item.search .social-link').addClass('current');
        $('#nav-header').addClass('faded');
    }

    function hideSearchMenu() {
        $('.header .social .social-item.search .search-form-container').hide();
        $('.header .social .social-item.search .social-link').removeClass('current');
        $('#nav-header').removeClass('faded');
    }

    function socialDropdowns() {
       	$(document).on('click', function() {
			hideShareMenu();
            hideSearchMenu();
        });
        $(document).on('click', '.search-form-container, .social-menu',function(e) {
            e.stopPropagation();
        });

        $(document).on('click','.social-item.share',
            function(e) {
			    var dimensions = getViewportDimensions();
                if($(this).hasClass('current')) {
                    hideShareMenu();
                    if(dimensions['w'] <= 1160 && dimensions['w'] > 1080 ) {
                        destroyTopNavigationDropdowns();
                        topNavigationDropdowns();
                    }
                } else {
                    hideSearchMenu();
                    showShareMenu();
                    if(dimensions['w'] <= 1160 && dimensions['w'] > 1080 ) {
                        destroyTopNavigationDropdowns();
                    }
                }
                e.stopPropagation();
            }
        );

        $(document).on('click', '.header .social .social-item.search .social-link', 
            function(e) {
                if($(this).hasClass('current')) {
                    hideSearchMenu();
                } else {
                    hideShareMenu();
                    showSearchMenu();
                }
                e.stopPropagation();
            }
        );
    }

    function openMobileNav() {
        $('.navigation-button-link').removeClass('closed');
        $('.navigation-button-link').addClass('open');
        $('body').css('overflow-x', 'hidden').css('left', '270px');
        $('.mobile-navigation').animate({
            left: '0',
            opacity: 1
        }, 400);
        $('.navigation-shade-container').show().animate({
            opacity: '.2'
        }, 200);
    }

    function closeMobileNav() {
        $('.navigation-button-link').removeClass('open');
        $('.navigation-button-link').addClass('closed');
        $('body').css('overflow-x', 'auto').css('left', '0');
        $('.mobile-navigation').css('left','-30px').css('opacity','0');
        $('.mobile-navigation .secondary-navigation-container').css('left', '270px');
        $('.mobile-navigation .core-navigation').css('opacity','1');
        $('.navigation-shade-container').show().animate({
            opacity: '0'
        }, 200, function() {
            $(this).hide();
        });
        closeAndDestoryMobileSubnav();
    }

    function createAndOpenMobileSubnav($this) {
        var clone = $this.parent('.menu-item-has-children').clone();
        $('.secondary-navigation').show();
        $('.secondary-navigation').append(clone);
        $('.mobile-navigation .core-navigation').animate({
            opacity: '0',
            left: '-240px'
        }, 200);
        $('.mobile-navigation .demographics-container').animate({
            opacity: '0',
            left: '-240px'
        }, 200);
        $('.mobile-navigation .join-container').animate({
            opacity: '0',
            left: '-240px'
        }, 200);
        $('.mobile-navigation .social-container').animate({
            opacity: '0',
            left: '-240px'
        }, 200);
        $('.mobile-navigation .secondary-navigation-container').animate({
            left: '0'
        }, 200);
    }

    function closeAndDestoryMobileSubnav() {
        $('.mobile-navigation .core-navigation').animate({
            opacity: '1',
            left: '0'
        }, 200);
        $('.mobile-navigation .demographics-container').animate({
            opacity: '1',
            left: '0'
        }, 200);
        $('.mobile-navigation .join-container').animate({
            opacity: '1',
            left: '0'
        }, 200);
        $('.mobile-navigation .social-container').animate({
            opacity: '1',
            left: '0'
        }, 200);
        $('.mobile-navigation .secondary-navigation-container').animate({
            left: '240px'
        }, 200, function(){
            $('.secondary-navigation li').remove();
            $('.secondary-navigation').hide();
        });
    }
    
    function mobileNavSetup() {
        //Opening and Closing the Nav
        $('.navigation-button-link').on('click', function(e){
            if($(this).hasClass('open')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
            e.preventDefault();
        });

        $('.navigation-shade-container').on('click', function(){
            closeMobileNav();
        });

        //Creating and opening subnav
        $('.mobile-navigation .core-navigation #nav-header-mobile .menu-item-has-children>a').on('click', function(e) {
            createAndOpenMobileSubnav($(this));
            e.preventDefault();
        });

        //Closing and destroying subnav
        $('.mobile-navigation .secondary-navigation .back-navigation-link').on('click', function(e) {
            closeAndDestoryMobileSubnav();
            e.preventDefault();
        });
    }


    /****PAGE LOAD ACTIONS****/
    footerSetup();
    topNavigationDropdowns();
    socialDropdowns();
    mobileNavSetup();

    /****RESIZE ACTIONS****/
    $(window).resize(function() {});
});
