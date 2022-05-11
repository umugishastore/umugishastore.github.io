/*! Codazon Megamenu - v1.0.0 - 2019-02-19
* Copyright (c) 2019 Codazon; */
$(document).ready(function() {
	moveCdzMegaMenu();
	
});
$(document).on('shopify:section:load',function() {
	moveCdzMegaMenu();
});
$(document).on('shopify:section:select',function() {
	moveCdzMegaMenu();
});
$(document).on('shopify:block:select',function() {
	moveCdzMegaMenu();
});


/*----------------------Menu------------------*/
$.widget('codazon.buildCdzMegaMenu', {
	options: {
		type: 'horizontal',
		animation: 'fade',
		dropdownStyle: 'auto',
		identifier: null,
		breakpoint : 768,
		selector : {
			rtl : 'rtl-layout',
			fixtop : 'fixtop',
			stickyMenu: 'js-sticky-menu'
		},
		tabletMinWidth: 768,
		tabletMaxWidth: 1024,
		msg: 'OK',
	},
	_create: function() {
		var conf = this.options;
		var self = this;
		var $groupmenu = $('.groupmenu-drop', this.element);
		$groupmenu.hide();
		var winWidth = window.innerWidth;
		var mbMmEvent = 'cdzMmMobile', dtMmEvent = 'cdzMmDesktop';
		
		if(conf.dropdownStyle == 'full') {
			$('.cdz-menu', this.element).addClass('cdz-full-menu');
		}
		
		if(winWidth >= conf.breakpoint){
			$(this.element).children('.cdz-menu').addClass('cdz-desk-menu');
			if(conf.type != 'toggle') {
				$('.cdz-menu', this.element).removeClass('cdz-toggle-menu');
			} else {
				$('.cdz-menu', this.element).addClass('cdz-toggle-menu');
				this._toggleMegaMenu();
				
			}
			if(conf.type == 'horizontal') {
				$('.cdz-menu', this.element).addClass('cdz-horizontal-menu');
				if(conf.dropdownStyle == 'full') {
					this._hozDropFullWidth();	
				} else {
					this._hozDropAutoWidth();
				}
			} else if(conf.type == 'vertical') {
				$('.cdz-menu', this.element).addClass('cdz-vertical-menu');
				if(conf.dropdownStyle == 'full') {	
					this._verDropFullWidth();
				} else {
					this._verDropAutoWidth();
				}
			}
		} else {
			if (!self._isToggleMenu()){
				$(this.element).children('.cdz-menu').addClass('cdz-mobile-menu cdz-toggle-menu');
				$(this.element).children('.cdz-menu').removeClass('cdz-horizontal-menu cdz-vertical-menu');
				this._toggleMegaMenu();
			}
		}
		
		var isDtScreen = function(breakpoint) {
			if (typeof breakpoint === 'undefined') {
				breakpoint = conf.breakpoint;
			}
			if (breakpoint >= conf.breakpoint) {
				return true;
			}
		}
		
		var addTriggerMMenu = function(breakpoint){
			if (typeof breakpoint === 'undefined') {
				breakpoint = mBreakpoint;
			}
			if(isDtScreen(breakpoint)) {
				$window.trigger(dtMmEvent);
			}
			else{
				$window.trigger(mbMmEvent);
			}
		}
		$(window).on(mbMmEvent, function(){
			if (!self._isToggleMenu()){
				$(self.element).children('.cdz-menu').addClass('cdz-mobile-menu cdz-toggle-menu');
				$(self.element).children('.cdz-menu').removeClass('cdz-desk-menu cdz-horizontal-menu cdz-vertical-menu');
				self._toggleMegaMenu();
			}	
		}).on(dtMmEvent, function(){
			$('.cdz-menu', self.element).removeClass('cdz-mobile-menu');
			if (!$('.cdz-menu', self.element).hasClass('cdz-desk-menu')) $('.cdz-menu', self.element).addClass('cdz-desk-menu');
			if(conf.type != 'toggle') {
				$('.cdz-menu', self.element).removeClass('cdz-toggle-menu');
				$('.cdz-menu', self.element).find('.parent .dropdown-toggle').remove();
				$('.cdz-menu', self.element).find('.parent').removeClass('click');
				if( conf.animation != 'transform') {
					$('.cdz-menu', self.element).find('.groupmenu-drop').hide();
					$('.cdz-menu', self.element).find('.cat-tree .child').hide();
				}	
			}
			if (conf.type == 'horizontal') {
				$('.cdz-menu', self.element).addClass('cdz-horizontal-menu');
				if(conf.dropdownStyle == 'full') {
					self._hozDropFullWidth();	
				} else {
					self._hozDropAutoWidth();
				}
			} else if(conf.type == 'vertical') {
				$('.cdz-menu', self.element).addClass('cdz-vertical-menu');
				if(conf.dropdownStyle == 'full') {
					self._verDropFullWidth();
					
				} else { 
					self._verDropAutoWidth();
				}
			}
			
			
		});
		$window.resize(function() {
			var curWidth = window.innerWidth;

			if ((curWidth >= self.options.breakpoint && winWidth < self.options.breakpoint) || (curWidth < self.options.breakpoint && winWidth >= self.options.breakpoint) ){
				addTriggerMMenu(curWidth);
			}
			winWidth = curWidth;
		});
		this._addLinkTablet();
		this._toggleTabletData();
	},
	_isToggleMenu: function() {
        return $('.cdz-menu', this.element).hasClass('cdz-toggle-menu');
    },
    _toggleTabletData: function() {
        if (this._isTabletDevice()) {
            $('.cdz-menu', this.element).addClass('is-tablet');
        } else {
            $('.cdz-menu', this.element).removeClass('is-tablet');
        }
    },
    _isTabletDevice: function() {
        return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(navigator.userAgent.toLowerCase());
    },
    _isGeneralTablet: function() {
        return (this.options.tabletMinWidth <= window.innerWidth && window.innerWidth <= this.options.tabletMaxWidth) || this._isTabletDevice();
    },
	_addLinkTablet: function() {
		var conf = this.options;
		var self = this;
		var $groupmenu = $('.groupmenu', this.element);
		var $item = this.element.find('.groupmenu .level0');
		$.each($item, function(i, el) {
			var link = $(this).children('.menu-link');
			var itemLink = $(this).children('.menu-link').first().attr('href');
			var itemTitle = $(this).children('.menu-link').first().find('span').first().text();
			var $groupmenu = $(this).find('.groupmenu-drop');
			var prepareHtml = '<li class="item tablet-item visible-tablet"><a href="'+itemLink+'" class="menu-go-link"><span class="link-prefix">'+theme.strings.menuGoTo+'</span></a></li>';
			var newHtml = prepareHtml.replace('1%', '<span class=\"link-text\">'+itemTitle+'</span>');
			if (itemLink !== 'javascript:void(0)' && itemLink !== 'javascript:;' && itemLink !== '#' && $(this).hasClass('parent')) {
				if (!self._isToggleMenu()){
					$groupmenu.prepend(newHtml);
				}
				$(link).on('click', function(e) {
                    if (self._isGeneralTablet() && (!self._isToggleMenu())) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
			}
		});
		var $catTree = $('.cat-tree', this.element);
		var $itemCatTree = this.element.find('.cat-tree .item');
		$.each($itemCatTree, function(i, el) {
			var link = $(this).children('.menu-link');
			var itemLink = $(this).children('.menu-link').first().attr('href');
			var itemTitle = $(this).children('.menu-link').first().find('span').first().text();
			var $catTreeChild = $(this).children('.cat-tree').first();
			var prepareHtml = '<li class="item tablet-item visible-tablet"><a href="'+itemLink+'" class="menu-go-link"><span class="link-prefix">'+theme.strings.menuGoTo+'</span></a></li>';
			var newHtml = prepareHtml.replace('1%', '<span class=\"link-text\">'+itemTitle+'</span>');
			if (itemLink !== 'javascript:void(0)' && itemLink !== 'javascript:;' && itemLink !== '#' && $(this).hasClass('parent')) {
				if (!self._isToggleMenu()){
					$catTreeChild.prepend(newHtml);
				}
				$(link).on('click', function(e) {
                    if (self._isGeneralTablet() && (!self._isToggleMenu())) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
			}
		});
	},
	_hozDropAutoWidth: function() {
		var self = this;
		var $item = this.element.find('.cdz-desk-menu .level0');
		var $itemParent = this.element.find('.cdz-desk-menu .parent');
		var conf = this.options;
		
		$itemParent.on('mouseover', function(e) {
			var conf = self.options;
			$(this).addClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).find('.cat-tree').first();
			var itemOffset = $(this).offset();
			var hItem = $(this).innerHeight();
			var mainOffset = $('[data-megamenu=container-mmenu]').offset();
			var pdMain = ($('[data-megamenu=container-mmenu]').innerWidth() - $('[data-megamenu=container-mmenu]').width()) / 2;
			var itemOffsetRight = ($('[data-megamenu=container-mmenu]').width() + pdMain - (itemOffset.left - mainOffset.left));
			if ($groupmenu.innerWidth() > itemOffsetRight) {
				mx = ($groupmenu.innerWidth() - itemOffsetRight) * (-1);
			} else {
				mx = 0;
			}
			if ($('body').hasClass(conf.selector.rtl)) {
				if ($groupmenu.innerWidth() > (itemOffset.left - mainOffset.left + $(this).innerWidth())) {
					mx = (itemOffset.left - mainOffset.left) * (-1);
				} else {
					mx = ($groupmenu.innerWidth() - $(this).innerWidth()) * (-1);
				}
			}
			$groupmenu.css({left: mx, right: 'auto', top: hItem});
			if (conf.animation == 'fade'){
				$groupmenu.fadeIn('slow');
				$catetree.fadeIn('slow');
			} else if (conf.animation == 'slide') {
				$groupmenu.slideDown(500);
				$catetree.slideDown(500);
			} else if (conf.animation == 'normal') {
				$groupmenu.show();
				$catetree.show();
			}
		});
		$itemParent.on('mouseleave', function(e){
			$(this).removeClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).find('.cat-tree').first();
			if( conf.animation == 'fade') {
				$groupmenu.fadeOut('slow');
				$catetree.fadeOut('slow');
			} else if( conf.animation == 'slide') {
				$groupmenu.slideUp(500);
				$catetree.slideUp(500);
			} else if( conf.animation == 'normal') {
				$groupmenu.hide();
				$catetree.hide();
			}

		});
		if( conf.animation == 'transform'){
			$itemParent.trigger('mouseover');
			this.element.find('.groupmenu-drop').show();
			this.element.find('.cat-tree .child').show();
		}
	},
	_hozDropFullWidth: function(e) {
		var self = this;
		var $item = this.element.find('.cdz-desk-menu .level0');
		var $itemParent = this.element.find('.cdz-desk-menu .parent');
		var conf = this.options;

		$itemParent.on('mouseover', function(e) {
			var conf = self.options;
			$(this).addClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).parent('.cat-tree').find('.child').first();
			var itemOffset = $(this).offset();
			var parItemOffset = $(this).parent('.groupmenu').offset();
			var hItem = $(this).innerHeight();
			var mx =  itemOffset.left;
			if ($('body').hasClass(conf.selector.rtl)) {
				$groupmenu.css({right: 'auto'});
			}
			
			if ($groupmenu.hasClass('cat-tree') == false) {
				$groupmenu.css('width', $('body').innerWidth());
				$groupmenu.find('.groupmenu-drop-content').css({maxWidth: $('main[role=main]').width(), margin: '0 auto'});
				$groupmenu.css({left: -(mx), top: hItem});
			}
			if( conf.animation == 'fade'){
				$groupmenu.fadeIn('slow');
				$catetree.fadeIn('slow');
			} else if( conf.animation == 'slide') {
				$groupmenu.slideDown(500);
				$catetree.slideDown(500);
			} else if( conf.animation == 'normal') {
				$groupmenu.show();
				$catetree.show();
			}
		});
		$itemParent.on('mouseleave', function(e){
			$(this).removeClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).parent('.cat-tree').find('.child').first();
			if( conf.animation == 'fade') {
				$groupmenu.fadeOut('slow');
				$catetree.fadeOut('slow');
			} else if( conf.animation == 'slide') {
				$groupmenu.slideUp(500);
				$catetree.slideUp(500);
			} else if( conf.animation == 'normal') {
				$groupmenu.hide();
				$catetree.hide();
			}
		});
		if (conf.animation == 'transform') {
			$itemParent.trigger('mouseover');
			this.element.find('.groupmenu-drop').show();
			this.element.find('.cat-tree .child').show();
		}
	},
	
	_verDropAutoWidth: function() {
		var self = this;
		var $item = this.element.find('.cdz-desk-menu .level0');
		var $itemParent = this.element.find('.cdz-desk-menu .parent');
		var conf = this.options;
		var curWidth = window.innerWidth;
		var $verElement = this.element.find('.cdz-menu');

		var wDropDown = function(item){
			var $item = item;
			var conf = self.options;
			var itemOffset = $item.offset();
			if (itemOffset.left <= 0) {
				itemOffset = $('[data-title-megamenu='+conf.identifier +']').offset();
			}
			var mainOffset = $('[data-megamenu=container-mmenu]').offset();
			var itemOffsetRight = (($('[data-megamenu=container-mmenu]').outerWidth() - 20) - (itemOffset.left - mainOffset.left + $item.outerWidth()));
			var $groupmenu = $item.find('.groupmenu-drop');

			if ($('body').hasClass(conf.selector.rtl)) {
				if ($groupmenu.innerWidth() > (itemOffset.left - mainOffset.left) && curWidth > self.options.breakpoint) {
					$groupmenu.css('width', (itemOffset.left - mainOffset.left));
				}
			} else {
				if ($groupmenu.innerWidth() > itemOffsetRight && curWidth > self.options.breakpoint) {
					$groupmenu.css('width', itemOffsetRight);
				}
			}
		}
		$.each($itemParent, function(i, el) {
			/*wDropDown($(this));*/
		});

		$itemParent.on('mouseover', function(e) {
			var conf = self.options;
			/*wDropDown($(this));*/
			$(this).addClass('hover');
			var verWidth = $verElement.outerWidth();
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).parent('.cat-tree').find('.child').first();
			var parItemOffset = $verElement.offset();
			var itemOffset = $(this).offset();
			
			var hItem = $(this).outerHeight();
			
			var mx, my = 0;
			mx = $(this).outerWidth();
			if ($('body').hasClass(conf.selector.rtl)) {
				$groupmenu.css({right: 'auto'});
				
				mx = ($groupmenu.outerWidth() + ((verWidth - $(this).outerWidth()) / 2)) * (-1);
			}

			var heightSticky = $('.js-sticky-menu.active').outerHeight();
			if (curWidth > self.options.breakpoint) {
				if ($('.js-sticky-menu').hasClass('active')) {
					if ($groupmenu.outerHeight() > $(window).outerHeight()) {
						my = (itemOffset.top - parItemOffset.top) * -1;
					} else {
						var itemOffsetBottom = ($(window).outerHeight() - (itemOffset.top - parItemOffset.top) - heightSticky);
						if ($groupmenu.outerHeight() > itemOffsetBottom) {
							my = (itemOffset.top - parItemOffset.top) * -1
						} else {
							my = 0;
						}
					}
				} else {
					if ($groupmenu.outerHeight() > $(window).outerHeight()) {
						if (($groupmenu.outerHeight()/ 2) > parItemOffset.top) {
							my = (parItemOffset.top + hItem) * -1;
						} else {
							my = ($groupmenu.outerHeight()/ 2) * -1;
							/*my = (itemOffset.top - parItemOffset.top) * -1;*/
						}
					} else {
						var itemOffsetBottom = ($(window).outerHeight() - itemOffset.top);
						if ($groupmenu.outerHeight() > itemOffsetBottom) {
							if ($groupmenu.outerHeight() - itemOffsetBottom < itemOffset.top) {
								my = ($groupmenu.outerHeight() - itemOffsetBottom)*-1;
							} else {
								my = itemOffset.top * (-1);
							}
						}
					}
				}
			}
			
			if ($(this).hasClass(conf.selector.fixtop)) {
				my = parItemOffset.top - itemOffset.top;
			}
			wDropDown($(this));
			$groupmenu.css({left: mx, top: my});
			
			if (conf.animation == 'fade'){
				$groupmenu.fadeIn('slow');
				$catetree.fadeIn('slow');
			} else if (conf.animation == 'slide') {
				$groupmenu.slideDown(500);
				$catetree.slideDown(500);
			}
			else if (conf.animation == 'normal') {
				$groupmenu.show();
				$catetree.show();
			}
		});
		$itemParent.on('mouseleave', function(e) {
			$(this).removeClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).parent('.cat-tree').find('.child').first();
			if (conf.animation == 'fade') {
				$groupmenu.fadeOut('slow');
				$catetree.fadeOut('slow');
			} else if (conf.animation == 'slide') {
				$groupmenu.slideUp(500);
				$catetree.slideUp(500);
			} else if (conf.animation == 'normal') {
				$groupmenu.hide();
				$catetree.hide();
			}
		});
		if (conf.animation == 'transform') {
			this.element.find('.groupmenu-drop').css('display', '');
			this.element.find('.cat-tree .child').css('display', '');
		}
	},
	_verDropFullWidth: function() {
		var self = this;
		var $item = $(this.element).find('.cdz-desk-menu .level0');
		var $itemParent = $(this.element).find('.cdz-desk-menu .parent');
		var curWidth = window.innerWidth;
		var conf = this.options;
		if( conf.animation == 'transform'){
			this.element.find('.groupmenu-drop').css('display', '');
			this.element.find('.cat-tree .child').css('display', '');
		}

		var widthDropDown = function() {
			var $item = self.element.find('.cdz-desk-menu .level0');
			$.each($item, function(i, el) {
				var conf = self.options;
				var itemOffset = $(el).offset();
				var mainOffset = $('main[role=main]').offset();
				var itemOffsetRight = ($('main[role=main]').outerWidth() - (itemOffset.left - mainOffset.left + $(el).outerWidth()));
				var $groupmenu = $(el).find('.groupmenu-drop');
				if (curWidth > self.options.breakpoint) {
					if ($('body').hasClass(conf.selector.rtl)) {
						$groupmenu.css('width', (itemOffset.left - mainOffset.left));
					} else {
						$groupmenu.css('width', itemOffsetRight);
					}
				}
				
			});	
		}
		widthDropDown();
		
		$itemParent.on('mouseover', function(e) {
			widthDropDown();
			$(this).addClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).parent('.cat-tree').find('.child').first();
			var parItemOffset = $(this).parent('.groupmenu').offset();
			var itemOffset = $(this).offset();
			var hItem = $(this).innerHeight();
			
			var mainOffset = $('main[role=main]').offset();
			var itemOffsetRight = ($('main[role=main]').innerWidth() - (itemOffset.left - mainOffset.left + $(this).innerWidth()));
			
			var mx, my = 0;
			mx = $(this).innerWidth();
			if ($('body').hasClass(conf.selector.rtl)) {
				$groupmenu.css({right: 'auto'});
				mx = ($groupmenu.outerWidth()) * (-1);
			}
			/**/
			var heightSticky = $('.js-sticky-menu.active').outerHeight();
			if (curWidth > self.options.breakpoint) {
				if ($groupmenu.outerHeight() > $(window).outerHeight()) {
					if (($groupmenu.outerHeight()/ 2) > parItemOffset.top) {
						my = (parItemOffset.top + hItem) * -1;
					} else {
						my = ($groupmenu.outerHeight()/ 2) * -1;
					}
				} else {
					var itemOffsetBottom = ($(window).outerHeight() - itemOffset.top);
					if ($groupmenu.outerHeight() > itemOffsetBottom) {
						if ($groupmenu.outerHeight() - itemOffsetBottom < itemOffset.top) {
							my = ($groupmenu.outerHeight() - itemOffsetBottom)*-1;
						} else {
							my = itemOffset.top * (-1);
						}
					}
				}
				if ($('.js-sticky-menu').hasClass('active')) {
					if ($groupmenu.outerHeight() > $(window).outerHeight()) {
						my = (itemOffset.top - parItemOffset.top) * -1;
						
					} else {
						var itemOffsetBottom = ($(window).outerHeight() - (itemOffset.top - parItemOffset.top) - heightSticky);
						if ($groupmenu.outerHeight() > itemOffsetBottom) {
							my = (itemOffset.top - parItemOffset.top) * -1
						} else {
							my = 0;
						}
					}
				}
			}
			
			
			if ($(this).hasClass('fixtop')) {
				my = parItemOffset.top - itemOffset.top;

			}
			$groupmenu.css({left: mx, top: my});
			if( conf.animation == 'fade'){
				$groupmenu.fadeIn('slow');
				$catetree.fadeIn('slow');
			} else if( conf.animation == 'slide') {
				$groupmenu.slideDown(500);
				$catetree.slideDown(500);
			} else if( conf.animation == 'normal') {
				$groupmenu.show();
				$catetree.show();
			}
		});
		$itemParent.on('mouseleave', function(e) {
			$(this).removeClass('hover');
			var $groupmenu = $(this).find('.groupmenu-drop');
			var $catetree = $(this).parent('.cat-tree').find('.child').first();
			if( conf.animation == 'fade'){
				$groupmenu.fadeOut('slow');
				$catetree.fadeOut('slow');
			} else if( conf.animation == 'slide') {
				$groupmenu.slideUp(500);
				$catetree.slideUp(500);
			} else if( conf.animation == 'transform') {

			} else{
				$groupmenu.hide();
				$catetree.hide();
			}

		});
	},
	_toggleMegaMenu : function (){
		var self = this;
		var conf = this.options;
		if( conf.animation == 'transform'){
			this.element.find('.groupmenu-drop').hide();
			this.element.find('.groupmenu-drop .child').hide();
			this.element.find('.groupmenu-drop').css('display', '');
			this.element.find('.cat-tree .child').css('display', '');
		}
		this.element.find('.groupmenu-drop').hide();
		this.element.find('.groupmenu-drop .child').hide();
		
		var $item = this.element.find('.cdz-toggle-menu .item.parent');
		$item.off('mouseover mouseleave');
		var $itemParent = this.element.find('.cdz-toggle-menu .parent');
		var hItem = $item.find('.menu-link').innerHeight();
		if ($itemParent.has('.dropdown-toggle').length == 0) {
			$itemParent.children('.menu-link').after('<span class="dropdown-toggle" href="javascript:void(0)" style="line-height:'+hItem+'px; width:'+hItem+'px;"></span>');
		}
		var $dropdownToggle = $itemParent.children('.dropdown-toggle');
		$dropdownToggle.on('click', function() {
			var $itemParent = $(this).parent();
			var $groupmenu = $itemParent.find('.groupmenu-drop');
			var $catetree = $itemParent.find('.cat-tree').first();
			$itemParent.toggleClass('click');
			if($itemParent.hasClass('click')){
				if( conf.animation == 'fade'){
					$groupmenu.slideDown('slow');
					$catetree.slideDown('slow');
				}
				else if( conf.animation == 'slide'){
					$groupmenu.slideDown('slow');
					$catetree.slideDown('slow');
				}
				else if( conf.animation == 'transform') {
					$groupmenu.slideDown('slow');
					$catetree.slideDown('slow');
				}
				else{
					$groupmenu.show();
					$catetree.show();
				}
				
			}
			else{
				if( conf.animation == 'fade'){
					$groupmenu.slideUp('slow');
					$catetree.slideUp('slow');
				}
				else if( conf.animation == 'slide') {
					$groupmenu.slideUp('slow');
					$catetree.slideUp('slow');
				}
				else if( conf.animation == 'transform') {
					$groupmenu.slideUp('slow');
					$catetree.slideUp('slow');
				}
				else{
					$groupmenu.hide();
					$catetree.hide();
				}
			}
			
			
		});
	}
});

var moveCdzMegaMenu = function() {
	$('[data-move-megamenu]').each(function() {
		var $destWrap = $(this);
      	var menuId = $destWrap.data('move-megamenu');
      	var $menu = $('[data-mmenu-id='+menuId+']');
        if ($menu.length) {
			var $cloneMenu = $menu.clone().removeAttr('data-mmenu-id');
          	$cloneMenu.appendTo($destWrap);
          	$cloneMenu.attr('data-cdzwidget', $cloneMenu.attr('data-cdzprewidget'));
        }
        $destWrap.removeAttr('data-move-megamenu');
	});
  	$('body').trigger('contentUpdated');
}