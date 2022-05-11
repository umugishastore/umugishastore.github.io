// Put your applicaiton javascript here
var runWidget = function(context)
{
	$('[data-cdzwidget]', context).each(function () {
		var $element = $(this);
		var widgets = $element.data('cdzwidget');
		
		$.each(widgets, function(name, widget) {
			var options = widget;
			var widget = name.split('.');
			if (widget.length > 1) {
				if (typeof $[widget[0]][widget[1]] === 'function') {
					$[widget[0]][widget[1]](options, $element);
				}
			}
		});
		$element.removeAttr('data-cdzwidget');
	});
}

var mHeaderBreakpoint = theme.variables.mediaQueryHeader;
var mBreakpoint = 768;
var tabBreakpoint = 980;
var $window = $(window), winWidth = window.innerWidth;
var deskPrefix = 'desk_', mobiPrefix = 'mobi_';
var mbEvent = 'cdzMobile', dtEvent = 'cdzDesktop', tabEvent = 'cdzTablet';
var mbHeEvent = 'cdzHeMobile', dtHeEvent = 'cdzHeDesktop';

$(document).ready(function() {
	addTriggerScreen(winWidth);
	addTriggerHeScreen(winWidth);
	$window.resize(function() {
		var curWidth = window.innerWidth;
		if ((curWidth >= mBreakpoint && winWidth < mBreakpoint) || (curWidth < mBreakpoint && winWidth >= mBreakpoint)){
			addTriggerScreen(curWidth);
		}
		if ((curWidth >= mHeaderBreakpoint && winWidth < mHeaderBreakpoint) || (curWidth < mHeaderBreakpoint && winWidth >= mHeaderBreakpoint)){
			addTriggerHeScreen(curWidth);
		}
		winWidth = curWidth;
	});
	
	$window.on(dtHeEvent, onDesktop).on(mbHeEvent, onMobile);
	if (isDtHeScreen(winWidth)) {
		onDesktop();
	} else {
		onMobile();
	}
	cdzAddToWishlist();
  	initLayerderEvent();
  	qtyControl();
  	backToTop();
  	mbToolbar();
  	cdzAddToCompare();
	
	cdzCurrencies();
	addScriptTwitter();
	addScriptFacebook();
	openReview();
	mbContentToggle();
	collapseDesc();
	
	runWidget('body');
	$('body').on('contentUpdated', function() {
      runWidget('body');
    });	
  	replaceColorSwatch();
    $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
    });
    makeSameHeight();
	$window.resize(function() {
		makeSameHeight();
	});
    
});

      
var isDtScreen = function(breakpoint) {
	if (typeof breakpoint === 'undefined'){
		breakpoint = mBreakpoint;
	}
	if (breakpoint >= mBreakpoint){
		return true;
	}
	else{
		return false;
	}
}

var addTriggerScreen = function(breakpoint){
	if (typeof breakpoint === 'undefined'){
		breakpoint = mBreakpoint;
	}
	if(isDtScreen(breakpoint)){
		$window.trigger(dtEvent);
	}
	else{
		$window.trigger(mbEvent);
	}
}  

//Move header element when have setting in admin panel    
var isDtHeScreen = function(breakpoint) {
	if (typeof breakpoint === 'undefined'){
		breakpoint = mHeaderBreakpoint;
	}
	if (breakpoint >= mHeaderBreakpoint){
		return true;
	}
	else{
		return false;
	}
}

var addTriggerHeScreen = function(breakpoint){
	if (typeof breakpoint === 'undefined'){
		breakpoint = mHeaderBreakpoint;
	}
	if(isDtHeScreen(breakpoint)){
		$window.trigger(dtHeEvent);
	}
	else{
		$window.trigger(mbHeEvent);
	}
}

var moveToNewArea = function(fromA, toB) {
	$('[id^="' + fromA + '"]').each(function() {
		var $element = $(this);
		var $child = $element.children(); // lay phan tu con cua fromA
		var fromId = $element.attr('id'); // lay ID cua fromA
		var strA = fromId.substr(fromA.length); // cat chuoi tu iD vua lay, ki tu cat bat dau tu chieu dai cua fromA
		var toId = toB + strA;
		$child.appendTo('#' +toId);
	});
};

var onMobile = function() {
	moveToNewArea(deskPrefix, mobiPrefix);
};
var onDesktop = function() {
	moveToNewArea(mobiPrefix, deskPrefix);
};



$.widget('codazon.sideBar',{
	options:{
		side: 'right',
		section: '',
	},
	_create: function() {
		this._bindEvents();
      	this._moveSideBar();
		this._closeSideBar();
	},
  	_bindEvents: function() {
      	var self = this;
		var id = this.element.attr('id');
      	$('body').off('click.cdz_sidebar_' + id);
        $('body').on('click.cdz_sidebar_' + id, '[data-sidebar="' + id + '"]', function() {
              self._openSideBar();
        });
	 },
	_openSideBar: function() {      
      	var config = this.options;
		$('#utilies-' + config.section).show().siblings().hide();
		$('body').removeClass('cdz-panel-open cdz-panel-open-left cdz-panel-open-right')
                 .addClass('cdz-panel-open cdz-panel-open-' + config.side);

	},
 	_moveSideBar: function(){
		var self = this;
		var config = this.options;
      	var checkIdItem = self.element.attr('id');
		$('[data-sidebarid=' + config.side + '] [data-role=utilies-sections]').each(function() {
			var $element = $(this);
          	var $cond = $element.children().is('[id=' + checkIdItem + ']');
			if ($cond){
              	$('[data-sidebarid=' + config.side + '] [data-role=utilies-sections] [id=' + checkIdItem + ']').remove();
				self.element.appendTo('[data-sidebarid=' + config.side + '] [data-role=utilies-sections]').hide();
			} else {
				self.element.appendTo('[data-sidebarid=' + config.side + '] [data-role=utilies-sections]').hide();
			}
		});
	},
	_closeSideBar: function() {
		$('body').on('click', '[data-role=cdz-close-sidebar]', function() { 
			$('body').removeClass('cdz-panel-open cdz-panel-open-left cdz-panel-open-right');
			$('[data-role=utilies-section]').hide();
		});
	}
});


$.widget('codazon.dropDown',{
	options:{
		show: 'no',
      	btnTrigger: '[data-role=cdz-dd-trigger], [data-action=cdz-action-minicart], [data-action=cdz-wishlist-trigger]'
	},
	_create: function() {
		this._showDropDown();
		this._closeDropDown();
	},
	_showDropDown: function() {
		var self = this;
		var config = this.options;
		$(config.btnTrigger,self.element).on('click', function(){
			$trigger = $('[data-role=cdz-dd-trigger]',self.element);
			$show = $('[data-role=cdz-dd-content]',self.element);
			var ddLeft = $trigger.offset().left;			
			var ddRight = window.innerWidth - ddLeft;
			var innerWidthDD = $show.outerWidth();
			var delta = 0;
			if (innerWidthDD > ddRight){
				delta = innerWidthDD - ddRight + 20;
			}
			if ($show.hasClass('active'))
				$show.removeClass('active');
			else
				$show.addClass('active').css({left: -delta});
			
		});
	},
	_closeDropDown: function() {
		var self = this;
		$('body').on('click', function(e){
			var $target = $(e.target);
			$ddtrigger = $('[data-role=cdz-dd-trigger]', self.element);
			$ddshow = $('[data-role=cdz-dd-content]', self.element);
			$close = $('[data-action=cdz-dd-close]', self.element);
			var cond1 = $target.is($ddshow), 
                cond2 = ($ddshow.has($target).length > 0), 
                cond3 = $target.is($ddtrigger), 
                cond4 = $target.is($close),
                cond5 = ($ddtrigger.has($target).length > 0);
			if (!(cond1 || cond2 || cond3 || cond5) || cond4){
				$ddshow.removeClass('active');
			}
		});
		
	}
});


var cdzSetCookie = function(cname, cvalue, exMins) {
    var d = new Date();
    d.setTime(d.getTime() + (exMins*60*1000));
    var expires = "expires="+d.toUTCString();  
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$.widget('codazon.newsletterPopup', {
	_create: function() {
		var self = this, config = this.options;
		$(window).load(function() {
			var cookieName = config.cookieName;
			var checkCookie = $.cookie(cookieName);
			if (!checkCookie) {
				cdzSetCookie(cookieName, '1', config.frequency);
				setTimeout(function() {
                  var $popup = $('#popup-newsletter');
                  var popupData = $popup.data('codazon-cdzPopUp');
                  popupData._openPopup();
				}, config.delay * 1000);
			}
		});
	}
});

$.widget('codazon.cdzPopUp',{
	options:{
		overrideOthers: 'false',
		section: '',
	},
	_create: function() {
	  this._bindEvents();
      this._movePopUp();
	  this._closePopUp();
	},       
	_openPopup: function() {
      	var config = this.options;
		if (($('body').hasClass('cdz-popup-opened')) && (config.overrideOthers == 'false' )) {
			$('body').removeClass('cdz-popup-opened');
			$('[data-role=cdz-popup-section]').hide();
			$('body').addClass('cdz-popup-opened');
			$('#popup-' + config.section).show();
		} else if (($('body').hasClass('cdz-popup-opened')) && (config.overrideOthers == 'true' )){
			if ($('.cdz-popup').hasClass('cdz-popup-override')) {
				$('[data-item=' + config.section + ']').remove();
				$('<div class="cdz-backface" data-role="cdz-close-cdzpopup" data-item="' + config.section + '">').prependTo('#popup-' + config.section);
				$('#popup-' + config.section).appendTo('#cdz-popup-area-inner');
				$('#popup-' + config.section).addClass("cdz-popup-override").show();
				
			} else {
				$('<div class="cdz-backface" data-role="cdz-close-cdzpopup" data-item="' + config.section + '">').prependTo('#popup-' + config.section);
				$('#popup-' + config.section).addClass("cdz-popup-override");
				$('#popup-' + config.section).show(); 
				
			}
		} else {
			// show popup first time
			$('[data-item=cdz-close-cdzpopup][data-item = all]').siblings().hide();
			$('#popup-' + config.section).show();
			$('body').addClass('cdz-popup-opened');
		}
	  },
	_bindEvents: function() {
      	var self = this;
		var id = this.element.attr('id');
        $('body').off('click.cdz_popup_' + id);
        $('body').on('click.cdz_popup_' + id, '[data-popup="' + id + '"]', function() {
              self._openPopup();
        });
	 },
  	_movePopUp: function(){
		var self = this;
		var config = this.options;
      	var checkIdItem = self.element.attr('id');
      
      $('.cdz-popup-area .cdz-popup-area-inner [id="'+ checkIdItem + '"]').remove();
      self.element.appendTo('#cdz-popup-area #cdz-popup-area-inner').hide();
	},
	_closePopUp: function() {
		var self = this;
		$('body').on('click', '[data-role=cdz-close-cdzpopup]', function() {
			var $element = $(this);
			var ppItem = $element.attr('data-item'); // lay data-item cua the div close
			//alert(ppItem);
			if (ppItem.length == 0) {
				$('body').removeClass('cdz-popup-opened');
				$('[data-role=cdz-popup-section]').hide().removeClass('cdz-popup-override');
				$('[data-role=cdz-popup-section]').children('.cdz-backface').remove();
			} else {
				if (ppItem != "all") {
					$('#popup-' + ppItem).hide();
					$('#popup-' + ppItem).removeClass('cdz-popup-override');
					$('[data-item=' + ppItem + ']').remove();
				} else {
					$('body').removeClass('cdz-popup-opened');
					$('[data-role=cdz-popup-section]').hide().removeClass('cdz-popup-override');
				}
			}
		});
	}
});

/*============= Ajax Mini Cart ================*/
$.widget('codazon.cdzMiniCart',{
	_create: function() {
		this._miniCart();
	},
	_showAjaxLoading: function() {
		$('#popup-addMiniCart').addClass('ajaxcart-loading');
	},
	_hideAjaxLoading: function() {
		$('#popup-addMiniCart').removeClass('ajaxcart-loading');
	},
	_miniCart: function(){
		var self = this, config = self.options;
		var formMessages = $('#cdz-messages');
		var form = this.element.parents('.product-item').first().find('form[data-form=cdz-mini-cart]');
		$(this.element).on('click', function() {
            var btn = $(this);
          	if(btn.hasClass('select-option')) {
              	var urlProduct = btn.attr('data-url');
				if ( urlProduct.includes("?") ) {
					urlProduct = urlProduct + '&view=option-addcart';
				} else {
					urlProduct = urlProduct + '?view=option-addcart';
				}
              // alert(urlProduct);
            	$.ajax({type: "GET",
                      url: urlProduct,
                      dataType: null,
                      success: function(e) {
                        $('#popup-optionAddCart').html(e);   
                        $('body').trigger('contentUpdated');
                        cdzCurrencies();
                        replaceColorSwatch();
                        // call popup when have option
                        var $popup = $('#popup-optionAddCart'); 
                        var popupData = $popup.data('codazon-cdzPopUp'); 
                        popupData._openPopup();
                        //self._updatePrice();
                        
                        
                        
                      }
                    });
              return false;
            } else {
              var data = form.serializeArray();
			  var addToCartBtn = theme.strings.addToCartBtn;
              // add cart
              $.ajax({type: "POST",
                url: '/cart/add.js',
                dataType: "json",
                data: data,
				beforeSend: function( xhr ) {
					btn.html(btn.html().replace(addToCartBtn,'Adding...'));
				},
				complete: function (data) {
					btn.html(btn.html().replace('Adding...',addToCartBtn));
				},
                success: function(data) {
					var typeAjaxCart = theme.variables.variant_type_ajaxCart;
                  
                  //update header minicart
				  $.ajax({type: "GET",
                      url: '/?view=header-minicart',
                      dataType: null,
                      success: function(e) {
                        $('#header-cart-content').html(e);
                        $('body').trigger('contentUpdated');
						cdzCurrencies();
                      }
                    });
            
				 //update footer sticky minicart
					 $.ajax({type: "GET",
					  url: '/?view=mb-bottom-cart',
					  dataType: null,
					  success: function(e) {
						$('#mb-bottom-toolbar-cart').html(e);
						$('body').trigger('contentUpdated');
						cdzCurrencies();
					  }
					});
                  if (typeAjaxCart == '01') {
					  $.ajax({type: "GET",
						  url: '/?view=footer-cart',
						  dataType: null,
						  success: function(e) {
							$('#footer-minicart-wrapper').html(e);
												 
							var $checkPanel = $('#cdz-footer-minicart').hasClass('.opened');
							
							var $footerCart = $('#cdz-footerCart-trigger');							
							$.codazon.flyingCart({productBtn: btn}, $footerCart);
							var popupData = $footerCart.data('codazon-flyingCart');
							if (!$checkPanel){
							  popupData._openFooterCart();
							}
							popupData._flyingImage();
							
							$('body').trigger('contentUpdated');   
							
							if ($('body').hasClass('cdz-popup-opened')){
							  $('body').removeClass('cdz-popup-opened');
							  $('[data-role=cdz-popup-section]').hide()
							};
							
						  }
						});
				  } else if (typeAjaxCart == '02') {
					$.ajax({type: "GET",
					  url: '/?view=popup-addMiniCart',
					  dataType: null,
					  success: function(e) {
						$.ajax({
							type: 'GET',
							url: '/products/' + config.handle + '.js',
							dataType: 'json',
							
							beforeSend: function( xhr ) {
							  self._showAjaxLoading();
							},
							complete: function (data) {
							  self._hideAjaxLoading();
							},
							success: function(product){
							  var urlResize = cdzResizeImage(product.featured_image, '150x');
							  var item = {
								//availableVariant : product.variants[0].available,
								title: product.title,
								featured_image: urlResize,
								options: product.options,
								variants: product.variants,
								images: product.images,
								currentVariant: product.variants[0],
								vendor: product.vendor,
								href: '/products/' + config.handle,
								handle: config.handle,
								qtyInPut: 1
							  };
							  var myLatestUpdate = mageTemplate('[data-id=latest-update-itemCart]');
							  var html = myLatestUpdate({
								  itemLaUpdate: item
							  });
							  $('#latest-update-itemCart').html(html);
							 }
						  });
						
						$('#popup-addMiniCart').html(e);
						$('body').trigger('contentUpdated');   
						cdzCurrencies();
						replaceColorSwatch();
						reloadAppReview();
						// call popup addMiniCart
						var $popup = $('#popup-addMiniCart');
						var popupData = $popup.data('codazon-cdzPopUp'); 
						popupData._openPopup();
					  }
					});
					  
				  } else {
					  $.ajax({type: "GET",
						  url: '/?view=sidebar-addMiniCart',
						  dataType: null,
						  success: function(e) {
							$('#utilies-addMiniCart').html(e);											 
							var $checkPanel = $('#utilies-addMiniCart').css('display');
							var $sidebarCart = $('#utilies-addMiniCart');
							$.codazon.flyingCart({productBtn: btn, destination: "[data-role=headSide-flying-destination]"}, $sidebarCart);
							var sidebarData = $sidebarCart.data('codazon-flyingCart');
							
							$.when(sidebarData._flyingImage(), $sidebarCart.delay( 1400 )).then(function( $opSidebar, opSidebarData ) {
							  $opSidebar = $('#utilies-addMiniCart');
								opSidebarData = $opSidebar.data('codazon-sideBar');
								opSidebarData._openSideBar();	
							});							
							
							/*var aManualDeferred = $.Deferred();
							var secondManualDeferred = aManualDeferred.then(function () {
								sidebarData._flyingImage();
								return wait(3500);
							})
							.done(function () {
								var $opSidebar = $('#utilies-addMiniCart');
								var opSidebarData = $opSidebar.data('codazon-sideBar');
								opSidebarData._openSideBar();
							});
							aManualDeferred.resolve();*/
							
							$('body').trigger('contentUpdated');   
							cdzCurrencies();
							if ($('body').hasClass('cdz-popup-opened')){
							  $('body').removeClass('cdz-popup-opened');
							  $('[data-role=cdz-popup-section]').hide()
							};
							
						  }
						});
				  }
                  $('body').trigger('cardAddedSuccess', {cartData: data});
                },
                error: function(data) {
                  
                  var $_messages = $('<span class="error clearfix"></span>');
                  $(formMessages).show().css("z-index","10000");  
                  // Set the message text.
                  if (data.responseJSON !== '') {
                   	  $_messages.appendTo('#cdz-messages').text(data.responseJSON.description).slideDown('slow').delay( 1000 );
                  	  $_messages.slideUp(1500 ,function() {
                        $_messages.remove();
                        $(formMessages).hide().removeAttr("style");
                  	});
                  } else {
                     $_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be added.').slideDown('slow').delay( 1000 );
                  	  $_messages.slideUp(1500 ,function() {
                        $_messages.remove();
                        $(formMessages).hide().removeAttr("style");
                  	});
                  } 
                }
              });
			
               return false;
            }
	    });
	}
});

//Ajax Mini Cart in Product Page
$.widget('codazon.cdzMiniCartProductPage',{
	_create: function() {
		this._miniCart();
	},
	_showAjaxLoading: function() {
		$('#popup-addMiniCart').addClass('ajaxcart-loading');
	},
	_hideAjaxLoading: function() {
		$('#popup-addMiniCart').removeClass('ajaxcart-loading');
	},
	_actionMiniCart: function(newArray, dataMainProduct, handleProduct) {
		var self = this;
		var formMessages = $('#cdz-messages');
			Shopify.queue = [];
	  for (var i = 0; i < newArray.length; i++) {
	    product = newArray[i]
	    Shopify.queue.push({
	      variantId: product,
	    });
          }
	  Shopify.moveAlong = function() {
	  // If we still have requests in the queue, let's process the next one.
	  if (Shopify.queue.length) {
	    var request = Shopify.queue.shift();
	    var data = 'id='+ request.variantId + '&quantity=1'
	    $.ajax({
	      type: 'POST',
              url: '/cart/add.js',
	      dataType: 'json',
	      data: data,
		  beforeSend: function( xhr ) {
			$('.product-info-main .actions-primary .btn-cart span').html("Adding...");
		  },
	      success: function(res){
	        Shopify.moveAlong();
		  //quantity += 1;
	     },
             error: function(){
	     // if it's not last one Move Along else update the cart number with the current quantity
		  if (Shopify.queue.length){
		    Shopify.moveAlong()
		  } else {
		    
		  }
	      }
           });
        }
	 // If the queue is empty, we add 1 to cart
	else {
		var addToCartBtn = theme.strings.addToCartBtn; 
	  // add cart
		  $.ajax({type: "POST",
			url: '/cart/add.js',
			dataType: "json",
			data: dataMainProduct,
			beforeSend: function( xhr ) {
			  $('.product-info-main .actions-primary .btn-cart span').html("Adding...");
			},
			complete: function (data) {
			 $('.product-info-main .actions-primary .btn-cart span').html(addToCartBtn);
			},
			success: function(data) {
				var typeAjaxCart = theme.variables.variant_type_ajaxCart;
			  
			  //update header minicart
			  $.ajax({type: "GET",
				  url: '/?view=header-minicart',
				  dataType: null,
				  success: function(e) {
					$('#header-cart-content').html(e);
					$('body').trigger('contentUpdated');
					cdzCurrencies();
				  }
				});
		
			 //update footer sticky minicart
				 $.ajax({type: "GET",
				  url: '/?view=mb-bottom-cart',
				  dataType: null,
				  success: function(e) {
					$('#mb-bottom-toolbar-cart').html(e);
					$('body').trigger('contentUpdated');
					cdzCurrencies();
				  }
				});
			  if (typeAjaxCart == '01') {
				  $.ajax({type: "GET",
					  url: '/?view=footer-cart',
					  dataType: null,
					  success: function(e) {
						$('#footer-minicart-wrapper').html(e);
											 
						var $checkPanel = $('#cdz-footer-minicart').hasClass('.opened');
						
						var $footerCart = $('#cdz-footerCart-trigger');							
						$.codazon.flyingCart({productBtn: $(self.element)}, $footerCart);
						var popupData = $footerCart.data('codazon-flyingCart');
						if (!$checkPanel){
						  popupData._openFooterCart();
						}
						popupData._flyingImage();
						
						$('body').trigger('contentUpdated');   
						
						if ($('body').hasClass('cdz-popup-opened')){
						  $('body').removeClass('cdz-popup-opened');
						  $('[data-role=cdz-popup-section]').hide()
						};
						
					  }
					});
			  } else if (typeAjaxCart == '02') {
				$.ajax({type: "GET",
				  url: '/?view=popup-addMiniCart',
				  dataType: null,
				  success: function(e) {
					$.ajax({
						type: 'GET',
						url: '/products/' + handleProduct + '.js',
						dataType: 'json',
						
						beforeSend: function( xhr ) {
						  self._showAjaxLoading();
						},
						complete: function (data) {
						  self._hideAjaxLoading();
						},
						success: function(product){
						  var urlResize = cdzResizeImage(product.featured_image, '150x');
						  var item = {
							//availableVariant : product.variants[0].available,
							title: product.title,
							featured_image: urlResize,
							options: product.options,
							variants: product.variants,
							images: product.images,
							currentVariant: product.variants[0],
							compare_at_price_max: product.compare_at_price_max,
							vendor: product.vendor,
							href: '/products/' + handleProduct,
							handle: handleProduct,
							qtyInPut: 1
						  };
						  var myLatestUpdate = mageTemplate('[data-id=latest-update-itemCart]');
						  var html = myLatestUpdate({
							  itemLaUpdate: item
						  });
						  $('#latest-update-itemCart').html(html);
						 }
					  });
					
					$('#popup-addMiniCart').html(e);
					$('body').trigger('contentUpdated');   
					cdzCurrencies();
					replaceColorSwatch();
					reloadAppReview();
					// call popup addMiniCart
					var $popup = $('#popup-addMiniCart');
					var popupData = $popup.data('codazon-cdzPopUp'); 
					popupData._openPopup();
				  }
				});
				  
			  } else {
				  $.ajax({type: "GET",
					  url: '/?view=sidebar-addMiniCart',
					  dataType: null,
					  success: function(e) {
						$('#utilies-addMiniCart').html(e);											 
						var $checkPanel = $('#utilies-addMiniCart').css('display');
						var $sidebarCart = $('#utilies-addMiniCart');
						$.codazon.flyingCart({productBtn: $(self.element), destination: "[data-role=headSide-flying-destination]"}, $sidebarCart);
						var sidebarData = $sidebarCart.data('codazon-flyingCart');
						
						$.when(sidebarData._flyingImage(), $sidebarCart.delay( 1400 )).then(function( $opSidebar, opSidebarData ) {
						  $opSidebar = $('#utilies-addMiniCart');
							opSidebarData = $opSidebar.data('codazon-sideBar');
							opSidebarData._openSideBar();	
						});							
						
						$('body').trigger('contentUpdated');   
						cdzCurrencies();
						if ($('body').hasClass('cdz-popup-opened')){
						  $('body').removeClass('cdz-popup-opened');
						  $('[data-role=cdz-popup-section]').hide()
						};
						
					  }
					});
			  }
			  $('body').trigger('cardAddedSuccess', {cartData: data});
			},
			error: function(data) {
			  
			  var $_messages = $('<span class="error clearfix"></span>');
			  $(formMessages).show().css("z-index","10000");  
			  // Set the message text.
			  if (data.responseJSON !== '') {
				  $_messages.appendTo('#cdz-messages').text(data.responseJSON.description).slideDown('slow').delay( 1000 );
				  $_messages.slideUp(1500 ,function() {
					$_messages.remove();
					$(formMessages).hide().removeAttr("style");
				});
			  } else {
				 $_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be added.').slideDown('slow').delay( 1000 );
				  $_messages.slideUp(1500 ,function() {
					$_messages.remove();
					$(formMessages).hide().removeAttr("style");
				});
			  } 
			}
		  });
		
		   return false;	
	 }
       };
    Shopify.moveAlong();
	},
	_miniCart: function(){
		var self = this, config = self.options;
		var formMessages = $('#cdz-messages');
		var form = this.element.parents('form').first();
		$(this.element).on('click', function() {
            var btn = $(this);
			var reForm = [];
			$('.active[data-related]').each(function(){
				var attrId = $(this).find('form[data-form=cdz-mini-cart] input[name=id], form[data-form=cdz-mini-cart] select[name=id] option', self.element).attr('value');
				reForm.push(attrId);
				
			});
			var data = form.serializeArray();
			self._actionMiniCart(reForm, data, config.handle);
	    });
	}
});

$.widget('codazon.cdzRelatedProduct',{
	_create: function() {
		this._relatedProduct();
		this._bindEvents();
	},
	_bindEvents: function() {
		var self = this;
		this.element.on('click', '[role=select-all-related]', function() {
			$('[data-related]').addClass('active');
			$('[data-action=relatedProduct]').addClass('active');
			$(this).attr('role', 'unselect-all-related').text(theme.strings.relatedUnSelectAll);
		});
		this.element.on('click', '[role=unselect-all-related]', function() {
			$('[data-related]').removeClass('active');
			$('[data-action=relatedProduct]').removeClass('active'); 
			$(this).attr('role', 'select-all-related').text(theme.strings.relatedSelectAll);
		});
	},
	_relatedProduct: function(){
		var self = this, config = self.options;
		$('[data-action=relatedProduct]',self.element).click(function() {
			var itemRelated = $(this).parents('[data-related]').first();
			if (itemRelated.hasClass('active')) {
				itemRelated.removeClass('active');
				$(this).removeClass('active'); 
			} else {
				itemRelated.addClass('active');
				$(this).addClass('active');
			}
		});
	}
});


$.widget('codazon.cdzItemMiniCart',{
	options: {
      	itemQty: '[data-role="item-quantity"]',
      	updateQtyBtn: '[data-action="update-item-minicart"]',
      	removeItemBtn: '[data-action="remove-item-minicart"]'
	},
	_create: function () {
		this._initCart();        
	},
  	_actionUpdateQty: function () {
		var self = this, config = self.options;
      	$(config.itemQty,self.element).click(function() {
          	var $element = $(this);
			var btnUpdate = $element.siblings(config.updateQtyBtn).first();
          	$(btnUpdate).addClass('active-update');
		});
      	
	},
  	_ajaxUpdateCart: function () {
      	var self = this;
		$.ajax({type: "GET",
				  url: '/?view=header-minicart',
				  dataType: null,
				  success: function(e) {
					$('#header-cart-content').html(e);
					$('body').trigger('contentUpdated');
					cdzCurrencies();
					if(self.options.sections != "addMiniCart"){
						$('[data-action=cdz-action-minicart]').trigger( "click" );	
					}
				  }
              	});
        $.ajax({type: "GET",
                url: '/?view=footer-cart',
                dataType: null,
                success: function(e) {
                  
                  $('#footer-minicart-wrapper').html(e);
                  $('body').trigger('contentUpdated');
                }
               });
		//update footer sticky minicart
		$.ajax({type: "GET",
				  url: '/?view=mb-bottom-cart',
				  dataType: null,
				  success: function(e) {
					$('#mb-bottom-toolbar-cart').html(e);
					$('body').trigger('contentUpdated');
					cdzCurrencies();
					if(theme.variables.variant_type_ajaxCart != '03' && self.options.sections == "addMiniCart"){
						$('[data-action=cdz-addMiniCart-trigger]').trigger( "click" );
					}
				  }
				});
		if (theme.variables.variant_type_ajaxCart == '03') {
			 $.ajax({type: "GET",
					  url: '/?view=sidebar-addMiniCart',
					  dataType: null,
					  success: function(e) {
						$('#utilies-addMiniCart').html(e);
						$('body').trigger('contentUpdated');
						cdzCurrencies();					
						if(self.options.sections == "addMiniCart"){
							$('[data-action=cdz-addMiniCart-trigger]').trigger( "click" );
						}						
					  }
					});
		}
	},
  	_updateCart: function () {
		var self = this, config = self.options;
      	this._actionUpdateQty();
      	var formMessages = $('#cdz-messages');
      	self.$_updateQtyBtn.on('click',function () {
          	var form = $(this).parents('form').first();
          	var data = form.serializeArray();
            var quantity = data[0].value;
          	callRequestAjax('/cart/change.js', 'POST', {line: config.line, quantity: quantity}, 'json', function(response) {
              self._ajaxUpdateCart();
              
            }, function(error){
              	var $_messages = $('<span class="error clearfix"></span>');
                 $(formMessages).show()
            	$_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be updated.').slideDown('slow').delay( 1000 );
                $_messages.slideUp(1500 ,function() {
                  $_messages.remove();
                  $(formMessages).hide();
                });
            });
          return false;
		});
      	
	},
    _removeItemCart: function () {
      var self = this;
		var config = this.options;
		self.$_removeItemBtn.on('click',function () {
          	callRequestAjax('/cart/change.js', 'POST', {line: config.line, quantity: 0}, 'json', function(response) {
              	self._ajaxUpdateCart();
            }, function(error){
            	var $_messages = $('<span class="error clearfix"></span>');
                 $(formMessages).show()
            	$_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be removed.').slideDown('slow').delay( 1000 );
                $_messages.slideUp(1500 ,function() {
                  $_messages.remove();
                  $(formMessages).hide();
                });
            });

			 return false;
        });
    },	
	_initCart: function () {
		var self = this, config = self.options;
      	self.$_updateQtyBtn = $(config.updateQtyBtn,self.element);
      	self.$_removeItemBtn = $(config.removeItemBtn,self.element);
      	self._updateCart();
      	self._removeItemCart();
	}
});


$.widget('codazon.cdzFooterCart',{
	_create: function() {
	  this._bindEvents();
	  this._closeFooterCart();
	},       
	_openFooterCart: function() {
		var $footerCart = $('#cdz-footer-minicart');
		var $cartContent = $('[data-role=cdz-footerCart-content]', $footerCart).first();
		$cartContent.slideToggle(300, 'linear', function() {
			$footerCart.toggleClass('opened');
		});
	 },
	_bindEvents: function() {
		var self = this;
		this.element.on('click', '[data-role=cdz-footerCart-trigger]', function() {
			self._openFooterCart();
		});
	 },
	_closeFooterCart: function() {
		
	}
});

/*Flying cart*/
var callRequestAjax = function (url, type, data, dataType, funcSuccess, funcError) {
  return $.ajax({
    type: type,
    url: url,
    data: data,
    dataType: dataType,
    success: function(response){
      funcSuccess(response);
    },
    error: function(response) {
      funcError(response);
    }
  });

}


$.widget('codazon.flyingCart',{
	options: {
		items: '[data-role="detail-item"]',
		trigger: '[data-role="detail-trigger"]',
		target: '[data-role="detail-target"]',
		cartInner: '[data-role="cart-inner"]',
		destination: '[data-role=flying-destination]',
		cartTrigger: '[data-role="cdz-footerCart-trigger"]',
		cartContent: '[data-role="cdz-footerCart-content"]',
		productBtn: '[data-button-action="add-to-cart"], .btn-cart',
      	itemQty: '[data-role="item-quantity"]',
      	updateQtyBtn: '[data-role="btn-update-item"]',
      	removeItemBtn: '[data-role="btn-remove-item"]',
		productImg: '.product-item-photo',
		productItem: '.product-item, .product-main'
	},
	_create: function () {
		this._initCart();        
	},
	_openFooterCart: function() {
		var $footerCart = $('#cdz-footer-minicart');
      	$footerCart.toggleClass('opened');
	},
	_togglePanelCart: function() {
		var self = this;
		self.$_panelTrigger.on('click',function () {
			self._openFooterCart();
		});
	 },
	_flyingImage: function () {
		var self = this, config = self.options;
		var $container = $(config.productBtn).parents(config.productItem).first();
		if (($container.length) && ($container.hasClass('product-item'))) {
			var $img = $(config.productImg,$container).find('img.product-image-photo').first();
        } else if (($container.length) && ($container.hasClass('product-main'))) {
			/* Product option addcart */
			var $img = $(config.productImg,$container).find('.js-showImg').first();
		} else {
			/* Product image */
			var $img = $('.product-main-image .owl-item.active .main-link img').first();
		}
		if ($img.length == 0) {
			return false;
		}
		var $_effectImg = $('<img id="dynamic-ajaxCart">');
		var src = $img.first().attr('src');
		if($(window).innerWidth() < 768){
			var $destination = $('[data-role=mb-flying-destination]');	
		} else {
			var $destination = $(config.destination);	
		}
		//var $destination = $(config.destination);
		$_effectImg.attr('src', src).appendTo('body').css({
			"position": "absolute", 
			"z-index": "10000", 
			"left": $img.offset().left, 
			"top": $img.offset().top, 
			"width": $img.width(), 
			"height": $img.height()
			});
			
		$_effectImg.animate({
		  width: "0%",
		  height: "0%",
		  top: $destination.offset().top,
		  left: $destination.offset().left,
		}, 1500 ,function() {
			$_effectImg.remove();
		});
	},
	_itemDetail: function () {
		var self = this, config = self.options;
      	var _itemTrigger = config.trigger;
      var _itemDetail = config.items;
      var _itemTarget = config.target;
      	this.element.on('click', _itemTrigger, function() {          
          	var $element = $(this);
			var cond = $element.parents(config.items);
			$(cond).toggleClass('active');
         
		});
      	
	},
  	_actionUpdateQty: function () {
		var self = this, config = self.options;
      	$(config.itemQty,self.element).click(function() {
          	var $element = $(this);
			var btnUpdate = $element.parents('[data-role=qty-update]').first();
          	$(btnUpdate).addClass('active-update');
		});
      	
	},
  	_ajaxUpdateCart: function () {
      	var self = this;
		$.ajax({type: "GET",
				  url: '/?view=header-minicart',
				  dataType: null,
				  success: function(e) {
					$('#header-cart-content').html(e);
					$('body').trigger('contentUpdated');
					cdzCurrencies();
				  }
              	});
        $.ajax({type: "GET",
                url: '/?view=footer-cart',
                dataType: null,
                success: function(e) {
                  
                  $('#footer-minicart-wrapper').html(e);
                  self._openFooterCart();
                  $('body').trigger('contentUpdated');
                }
               })
		//update footer sticky minicart
		$.ajax({type: "GET",
				  url: '/?view=mb-bottom-cart',
				  dataType: null,
				  success: function(e) {
					$('#mb-bottom-toolbar-cart').html(e);
					$('body').trigger('contentUpdated');
					cdzCurrencies();
				  }
				});
	},
  	_updateCart: function () {
		var self = this, config = self.options;
      	this._actionUpdateQty();
      	var formMessages = $('#cdz-messages');
      	self.$_updateQtyBtn.on('click',function () {
          	var form = $(this).parents('form').first();
          	var data = form.serializeArray();
            var quantity = data[0].value;
          	var line = $(this).siblings('input').attr('line');
          	callRequestAjax('/cart/change.js', 'POST', {line: line, quantity: quantity}, 'json', function(response) {
              self._ajaxUpdateCart();
              
            }, function(error){
            	
              var $_messages = $('<span class="error clearfix"></span>');
                 $(formMessages).show()
            	$_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be updated.').slideDown('slow').delay( 1000 );
                $_messages.slideUp(1500 ,function() {
                  $_messages.remove();
                  $(formMessages).hide();
                });
            });
          return false;
		});
      	
	},
    _removeItemCart: function () {
      var self = this;
		var config = this.options;
		self.$_removeItemBtn.on('click',function () {
          	var line = $(this).attr("line");
          	callRequestAjax('/cart/change.js', 'POST', {line: line, quantity: 0}, 'json', function(response) {
              	self._ajaxUpdateCart();
            }, function(error){
            	 var $_messages = $('<span class="error clearfix"></span>');
                 $(formMessages).show()
            	$_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be removed.').slideDown('slow').delay( 1000 );
                $_messages.slideUp(1500 ,function() {
                  $_messages.remove();
                  $(formMessages).hide();
                }); 
            });

			 return false;
        });
    },	
	_initCart: function () {
		var self = this, config = self.options;
		self.$_panelTrigger = $(config.cartTrigger,self.element);
      	self.$_updateQtyBtn = $(config.updateQtyBtn,self.element);
      	self.$_removeItemBtn = $(config.removeItemBtn,self.element);
		self._togglePanelCart();
     	self._itemDetail();
      	self._updateCart();
      	self._removeItemCart();
	}
});

/*Toogle Title*/
$.widget('codazon.cdzToggleTitle',{
	_create: function() {
      this._toggleOption();
	},
  	_toggleOption: function() {
		var self = this;
		$('[data-action=toggle]',self.element).on('click', function(){
          	$(this).parents('.parent').first().toggleClass('opened');
          	$(this).siblings('ul.groupmenu-drop').first().toggleClass('opened').slideToggle();
		});
	 }
});

$.widget('codazon.cdzToggleMenuLeftTitleMb',{
	_create: function() {
		var self = this;
		var $fTitle = $('[data-action=toggleMenuLeft]');
		var $fContent = $('[data-action=toggleMenuContent]');
		var is_mobile = false;
		
		$fTitle.on('click', function() {
			if (is_mobile){
				$(this).toggleClass('active');
				$(this).next('.groupmenu-drop').toggle('slow');
			}
		});
		if ($(window).innerWidth() < mHeaderBreakpoint){
			is_mobile = true;
			$fContent.hide();
		}
		
		$(window).on(dtHeEvent, function(){
			$fTitle.removeClass('active');
			$fContent.show();
			is_mobile = false;
		}).on(mbHeEvent, function(){
			is_mobile = true;
			$fContent.hide();
		});
	},
});


/*Filter by category*/
$.widget('codazon.cdzToogleCate',{
	_create: function() {
      this._toggleOption();
	},
  	_toggleOption: function() {
		var self = this;
		$('.dropdown-toggle',self.element).on('click', function(){
          	$(this).parents('.parent').first().toggleClass('opened');
          	$(this).siblings('ul.groupmenu-drop').first().toggleClass('opened').slideToggle();
		});
	 }
});


/*Toogle Filter Collection*/
$.widget('codazon.cdzToogleLeft',{
	_create: function() {
		var self = this;
		this._togOption();
		this._closeToog();
		//this._mobOption();
		if($(window).innerWidth() < 768){
			this._mobOption();
		}
		$(window).on(mbEvent, function(){
			self._mobOption();
		}).on(dtEvent, function(){
			self._desOption();
		});
		
		$('[data-toggle="tooltip"]').tooltip({
			trigger : 'hover'
		})
	},
  	_mobOption: function() {
		var self = this;
		var hClass = $(self.element).hasClass('sidebarFilter');
        if(hClass){						
			$(self.element).removeClass('sidebar').addClass("filter-1col toogle-wrapper-ltr").attr("data-role","toogleWrapper");
			$(self.element).wrapInner("<div class='block-filter-inner scrollbar'></div>").prepend('<a class="closeFilter btn-close" data-action="cdz-toogle-close"></a>').wrapInner("<div class='block-filter-wrapper toogle-content-ltr' data-role='toogleContent'></div>");
			$(self.element).prepend('<button type="button" class="btn btn-filter toggle-btn-ltr" data-action="toogleClick"><i class="fa fa-filter" aria-hidden="true"></i>Filter</button>');
			self._togOption();
			self._closeToog();
		}
	},
  	_desOption: function() {
		var self = this;
		var hClass = $(self.element).hasClass('sidebarFilter');
        if(hClass){						
			$(self.element).removeClass('filter-1col toogle-wrapper-ltr').addClass("sidebar").removeAttr("data-role");
			$('button.toggle-btn-ltr', self.element).remove();
			$(self.element).find(".block-filter-wrapper").contents().unwrap();
			$('.closeFilter', self.element).remove();
			$(self.element).find(".block-filter-inner").contents().unwrap();
		}
	},
  	_togOption: function() {
		var self = this;
		$('[data-action=toogleClick]',self.element).on('click', function(){
          	$(this).parents('[data-role=toogleWrapper]').first().toggleClass('parent-toogle-opened');
          	$(this).siblings('[data-role=toogleContent]').first().toggleClass('opened');
		});
	},
	_closeToog: function() {
		$('body').on('click', function(e){
			var $target = $(e.target);
			$toogWrapper = $('[data-role=toogleWrapper]', self.element);
			$toogTrigger = $('[data-action=toogleClick]', self.element);
			$toogShow = $('[data-role=toogleContent]', self.element);
			$toogClose = $('[data-action=cdz-toogle-close]', self.element);
			var cond1 = $target.is($toogShow), 
                cond2 = ($toogShow.has($target).length > 0), 
                cond3 = $target.is($toogTrigger), 
                cond4 = $target.is($toogClose),
                cond5 = ($toogTrigger.has($target).length > 0);
			if (!(cond1 || cond2 || cond3 || cond5) || cond4){
				$toogShow.removeClass('opened');
				$toogWrapper.removeClass('parent-toogle-opened');
			}
		});
	}
	
});


/*add cart have option*/
$.widget('codazon.cdzCartOption',{
	_create: function() {
      this._createVariantType();
      this._toggleOption();
      $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
      })
	},
  	_createVariantType: function() {
    	var self = this, config = self.options;       	
      	var variant = theme.variables.variant_type_mapping;
        var variant_type = variant.split(",");
      	var valueVariant = [];
        $('.product-option-wrapper', self.element).each(function(){
          	var variantName = $(this).children('.variant-type-image').attr('value');
      		var variantIndex = $(this).children('.variant-type-image').attr('index');
          	$('.variant-type-image[index=' + variantIndex + '] label', self.element).each(function(){
              var value = $(this).attr("value");
              var url = $(this).attr("data-url");
              var valueUrl = {
                value : value,
                url : url
              };
              valueVariant.push(valueUrl);
            });          
          $.each(variant_type, function(key, value) {
              var name =  value.split(":");
              if (name[0] == variantName.replace(" ", "")){
                var myVariantType = mageTemplate('[data-id=content-option-' + variantIndex + ']');
                var html = myVariantType({
                  typeVariant: name[1],
                  nameVariant: variantName,
                  valueVariant: valueVariant,
                  option_index: variantIndex
                });
                $('[data-id=product-option-' + variantIndex + ']', self.element).html(html);
              }
           });
          valueVariant = [];  
        });
    },
  	_toggleOption: function() {
		var self = this, config = self.options; 
		var productData = 'undefined';
		var item = [];
		$('.single-option-selector', self.element).on('change', function(){
			var sel = this;
			if (productData == 'undefined'){
          		productData = $.ajax({
				  type: 'GET',
				  url: '/products/' + config.handle + '.js',
				  dataType: 'json',
				  success: function(product){
					item = {
					  availableVariant : product.variants[0].available,
					  title: product.title,
					  compare_at_price: product.compare_at_price,
					  featured_image: product.featured_image,
					  options: product.options,
					  variants: product.variants,
					  images: product.images,
					  currentVariant: product.variants[0],
					  vendor: product.vendor,
					  href: '/products/' + config.handle,
					  handle: config.handle,
					  qtyInPut: 1
					}; 
				  }
				}).done(function(){
					var value = $(sel).val();
					$(sel).siblings('input').first().attr("value", value);
					$(sel).parents('.product-option').first().find('span.label-value').text(value);
					self._changeOption(item);
				});
          	} else {
				var value = $(this).val();
				$(this).siblings('input').first().attr("value", value);
				$(this).parents('.product-option').first().find('span.label-value').text(value);
				self._changeOption(item);
			}
          	
		});
      	$('.swatch-element', self.element).on('click', function(){
			var sel = this;
			if (productData == 'undefined'){
          		productData = $.ajax({
				  type: 'GET',
				  url: '/products/' + config.handle + '.js',
				  dataType: 'json',
				  success: function(product){
					item = {
					  availableVariant : product.variants[0].available,
					  title: product.title,
					  compare_at_price: product.compare_at_price,
					  featured_image: product.featured_image,
					  options: product.options,
					  variants: product.variants,
					  images: product.images,
					  currentVariant: product.variants[0],
					  vendor: product.vendor,
					  href: '/products/' + config.handle,
					  handle: config.handle,
					  qtyInPut: 1
					}; 
				  }
				}).done(function(){
					if ( $(sel).hasClass('disable') ){
						$(sel).children("input").attr('disabled');
					} else if ( $(sel).hasClass('selected') ){
						$(sel).removeClass('selected');
						$(sel).children("input").removeClass('checked');
						$(sel).parents('.product-option-wrapper').siblings('.product-option-wrapper').find('.swatch-element').removeClass('disable').children("input").removeAttr('disabled');
					}else{						
						var value = $(sel).attr('value');	
						$(sel).parents('.product-option').first().find('span.label-value').text(value);
						var name = $(sel).attr('name');
						self._changeVariation(value, name, item);
						$(sel).addClass('selected').children("input").addClass('checked').removeAttr('disabled');
						$(sel).siblings().removeClass('selected').children("input").removeClass('checked');
						self._changeOption(item);
						
					}
				});
          	} else {
				if ( $(this).hasClass('disable') ){
					$(this).children("input").attr('disabled');
				} else if ( $(this).hasClass('selected') ){
					$(this).removeClass('selected');
					$(this).children("input").removeClass('checked');
					$(this).parents('.product-option-wrapper').siblings('.product-option-wrapper').find('.swatch-element').removeClass('disable').children("input").removeAttr('disabled');
				}else{
					$(this).addClass('selected').children("input").addClass('checked').removeAttr('disabled');
					$(this).siblings().removeClass('selected').children("input").removeClass('checked');
					self._changeOption(item);
					var value = $(this).attr('value');
					$(this).parents('.product-option').first().find('span.label-value').text(value);
					var name = $(this).attr('name');
					self._changeVariation(value, name, item);
				}
			}
		});
      	
	 },
	_changeVariation: function(value, name, item) {
		var self = this, config = self.options;
		var currentValue = [];
		var currentName = [];
      	var availValue = [];
		var disableValue = [];
		var arrayValue = [];
		$.each(item.variants, function(variantId, variant) {
			var n = variant.options.includes(value);
			$.each(variant.options, function(key, values) {
				if (key != name)
					arrayValue.push(values);
			});
			if (n){
				$.each(variant.options, function(key, values) {
					  if (key != name){
						  availValue.push(values);
					  }
				});
			}				
		});
		var arrayValueUnique = arrayValue.filter(function(item, index){
			return arrayValue.indexOf(item) >= index;
		});
		var availValueUnique = availValue.filter(function(item, index){
			return availValue.indexOf(item) >= index;
		});
		jQuery.grep(arrayValueUnique, function(i) {
			if (jQuery.inArray(i, availValueUnique) == -1)
			{
				disableValue.push(i);
			}
		});
		$.each(disableValue, function(key, val) {	
			$('.swatch .swatch-element', self.element).each(function(){
				var valueElement = $(this).attr('value');
				if (val == valueElement){
					$(this).removeClass('enable').removeClass('selected').addClass('disable').children("input").removeClass('checked');
				}
			});
			
		});
		$.each(availValueUnique, function(key, valu) {
			$('.swatch .swatch-element', self.element).each(function(){
				var valueElement = $(this).attr('value');
				if (valu == valueElement){
					$(this).removeClass('disable').addClass('enable');
				}
			});
		});
		availValue = [];
		arrayValue = [];
		disableValue = [];
		arrayValueUnique = [];
		availValueUnique = [];	
	},
    _changeOption: function(item) {
      	var self = this, config = self.options;
      	function findVarianWhenOptionChanges(){
			var currentSelect = [];
			var finalVariants = item.variants;

			$('.single-option-selector, .swatch .swatch-element .checked', self.element).each(function(){
				var value = $(this).val();
				currentSelect.push(value);
			});

			var optionSize = currentSelect.length,
			newVariant,
			newVariant1,
			newVariant2,
			newVariant3,
			availableOption2 = [],
			availableOption3 = [];
			$.each(item.variants, function(variantId, variant) {
			  if(variant.options[0] == currentSelect[0]) {
				newVariant1 = variant;
				if(optionSize > 1 && availableOption2.indexOf(variant.options[1]) == -1) {
				  availableOption2.push(variant.options[1]);
				}
			  }
			  if(optionSize > 1
				  && variant.options[0] == currentSelect[0] 
				  && variant.options[1] == currentSelect[1]) {
				if(newVariant2 == undefined) {
				  newVariant2 = variant;
				}
				if(optionSize > 2 && availableOption3.indexOf(variant.options[2]) == -1) {
				  availableOption3.push(variant.options[2]);
				}
			  }
			  if(optionSize > 2 && newVariant3 == undefined
				  && variant.options[0] == currentSelect[0] 
				  && variant.options[1] == currentSelect[1]
				  && variant.options[2] == currentSelect[2]) {
				newVariant3 = variant;
			  }

			});

			if(true) {
			  if(optionSize == 3) {
				  return newVariant3;
			  } else if(optionSize == 2) {
				  return newVariant2;
			  } else {
				  return newVariant1; 
			  }
			} else {
			  if(newVariant3 != undefined) {
				  newVariant = newVariant3;
				} else if (newVariant2 != undefined) {
				  newVariant = newVariant2;
				} else {
				  newVariant = newVariant1;
				}
				return newVariant;	
			};
		  };
		
		var currentVariant = findVarianWhenOptionChanges();
		if(currentVariant == undefined) {
		  item.availableVariant = false;
		  $('button.btn-cart', self.element).removeClass('enable').addClass('disable').attr('disabled','disabled');
		} else {              
			item.availableVariant = currentVariant.available;
			item.currentVariant = currentVariant;
		  $('button.btn-cart', self.element).removeClass('disable').addClass('enable').removeAttr('disabled','disabled');
		  
		  // Change price
		  var currentPrice = Shopify.formatMoney(currentVariant.price);
		  var comparePrice = item.compare_at_price;
		  if (item.compare_at_price <= currentVariant.price){
			$('.product-single__sale-price', self.element).addClass('hide');
		  } else {
			 $('.product-single__sale-price', self.element).removeClass('hide');
		  }
		  //$('.price-box .money', self.element).text(currentPrice);
		  $.when($('.price-box', self.element).children('.money').remove()).then($('.price-box', self.element).append('<span class=\'money\'>'+currentPrice+'</span>'));
		  cdzCurrencies();

		  // Change value option
		  var value = currentVariant.id;
		  $('input[name=id]', self.element).attr('value', value);
		  
		  //Change img
		  if (currentVariant.featured_image != null){
			var imgID = currentVariant.featured_image.id;
			$('.product-image-wrapper img.main-img', self.element).each(function(){
			  var checkImg = $(this).attr('data-image-id');
			  if (checkImg == imgID){
				  $(this).removeClass("hide").addClass("js-showImg");

			  } else {
				  $(this).addClass("hide").removeClass("js-showImg");

			  }
			});
			var newImg = currentVariant.featured_image;
			var activeOwlItem = $('.product-photo').find('[data-image-id='+newImg.id+']').data('item');
			$(".product-photo").trigger("to.owl.carousel", [activeOwlItem - 1, 500]);
		  }
		
		  //change ID product option
		  
		}
	  
    }
});


//Column layout in collection page
$.widget('codazon.cdzCollectionLayout',{
	_create: function() {
      var self = this, config = self.options;     
	  /*this._changeLayout(config.column_pc);*/
      var column_mb = config.column_mb , column_tablet = config.column_tablet, column_pc = config.column_pc;
	  var mbLayoutEvent = 'cdzLoMobile', tabLayoutEvent = 'cdzLoTablet', dtLayoutEvent = 'cdzLoDesktop';
	  var isTabScreen = function(breakpoint) {
			if (typeof breakpoint === 'undefined'){
				breakpoint = mBreakpoint;
			}
			if ( breakpoint < tabBreakpoint){
				return true;
			}
			else{
				return false;
			}
		}

		var isMbScreen = function(breakpoint) {
			if (typeof breakpoint === 'undefined'){
				breakpoint = mBreakpoint;
			}
			if (breakpoint < mBreakpoint){
				return true;
			}
			else{
				return false;
			}
		}

		var addTriggerScreenMoTaDe = function(breakpoint){
			if (typeof breakpoint === 'undefined'){
				breakpoint = mBreakpoint;
			}
			if (isMbScreen(breakpoint)){
				$window.trigger(mbLayoutEvent);
			}			
			else if(isTabScreen(breakpoint)){
				$window.trigger(tabLayoutEvent);
			}
			else{
				$window.trigger(dtLayoutEvent);
			}
		}
	  $(window).on(mbLayoutEvent, function(){
			$('#collection-filter .collection-layout-button').each(function(){        
				var value = $(this).attr('data-collection-layout');
				if (column_mb == value)  
				  $(this).addClass('active').siblings().removeClass('active');
			});
      		$('#collection-filter .product-items').attr("data-column", column_mb);
		}).on(tabLayoutEvent, function(){
			$('#collection-filter .collection-layout-button').each(function(){        
				var value = $(this).attr('data-collection-layout');
				if (column_tablet == value)  
				  $(this).addClass('active').siblings().removeClass('active');
			});
			$('#collection-filter .product-items').attr("data-column", column_tablet);
		}).on(dtLayoutEvent, function(){
			$('#collection-filter .collection-layout-button').each(function(){        
				var value = $(this).attr('data-collection-layout');
				if (column_pc == value)  
				  $(this).addClass('active').siblings().removeClass('active');
			});
			$('#collection-filter .product-items').attr("data-column", column_pc);
		});
		var windowWidth = window.innerWidth;
		addTriggerScreenMoTaDe(windowWidth);
		$window.resize(function() {
			var currentWidth = window.innerWidth;
			if ((currentWidth >= mBreakpoint && windowWidth < mBreakpoint) || (currentWidth < mBreakpoint && windowWidth >= mBreakpoint) || (currentWidth >= tabBreakpoint && windowWidth < tabBreakpoint) || (currentWidth < tabBreakpoint && windowWidth >= tabBreakpoint)){
				addTriggerScreenMoTaDe(currentWidth);
			}
			windowWidth = currentWidth;
		});
      this._toggleOption();
	},
    _changeLayout: function(breakpoints){
		var checkCookie = $.cookie('collectionLayout');
      $('#collection-filter .collection-layout-button').each(function(){        
        var value = $(this).attr('data-collection-layout');
		if (!checkCookie) {
			if (breakpoints == value)  
			  $(this).addClass('active').siblings().removeClass('active');
		} else {
			if (getCookie('collectionLayout') == value)  
			  $(this).addClass('active').siblings().removeClass('active');
		}
      });
	  if (!checkCookie){
		$('#collection-filter .product-items').attr("data-column", breakpoints);
	  }
	  else{
		 $('#collection-filter .product-items').attr("data-column", getCookie('collectionLayout')); 
	  }
    },
  	_toggleOption: function() {
      	var self = this, config = self.options;
       $('.collection-layout-button', self.element).on('click', function(){
			$(this).addClass('active').siblings().removeClass('active');
          	var value = $(this).attr('data-collection-layout');
          	$(this).parents('#collection-filter').first().children('.product-items').attr("data-column", value);
			//setCookie('collectionLayout' ,value , null);
		});
    }
});

/*Add to Wishlist*/
function getCookie(name) {
  try {
    return $.cookie(name);
  } catch(e) {
  }
}

function setCookie(name, value, expire) {
  try {
    var params = {path: '/'};
    if(expire) {
      params.expires = expire;
    }
    $.cookie(name, value, params);
  } catch(e) {
  }
}


var wishlistItems = [], wishlistCookie = 'wishlistItems';

var addProductHandleToWishlistCookie= function(handle) {
  	  var json = getCookie(this.wishlistCookie), data = [];
      if(json != undefined) {
        data = $.parseJSON(json);
      }
      data.push(handle);
      setCookie(this.wishlistCookie, JSON.stringify(data), null);
}

var cdzAddToWishlist = function() {
  	var self = this;
  	var formMessages = $('#cdz-messages');
  	var textMessError = theme.strings.wishlist_mess_error;
  	$('body').on('click', '#top-wishlist', function() {
      	appendStyle(theme.libs.wishlist.css);
    });
    $('body').on('click', '[data-action=add-to-wishlist]', function() {
      var $checkClass = $(this).hasClass('is-actived');
      var productHanle = $(this).attr('data-post');
      var productTitle = $(this).attr('data-title');
      appendStyle(theme.libs.wishlist.css);
      if ($checkClass){
        var $_messages = $('<span class="error clearfix"></span>');
        //$(formMessages).show();
        $_messages.appendTo('#cdz-messages').text('Oops! ' + productTitle + ' ' + textMessError).slideDown('slow');        
        setTimeout(function() {
          $_messages.slideUp(500 ,function() {
            $_messages.remove();
          });
        }, 1500);
      
      } else {
        prepareWishlistItem(productHanle, false);
        
        }
    });
  	if(getCookie(this.wishlistCookie) != undefined) {
        var dataHrefs = $.parseJSON(getCookie(this.wishlistCookie));
        $.each(dataHrefs, function(index, value) {
          prepareWishlistItem(value, true);
        });
    };
    $('body').on('click', '[data-action=show-wl]', function() {
      	formMessages.slideUp(500 ,function() {
            formMessages.empty();
          });
	  if($(window).innerWidth() < 768){
			$('#mb-wishlist-trigger').trigger( "click" );
	  } else {
		$('#top-wishlist').trigger( "click" ); 	
	  }
    });
    $('body').on('click', '[data-action=close-mess-wl]', function() {
      var parent = $(this).parents('.mess-wl').first();
      $(this).parents('.mess-wl').first().slideUp(1000 ,function() {
        parent.empty();
      });
    });
  	$('body').on('click', '[data-action=remove-wl]', function() {
       var index = $(this).attr('data-index');
      	removeItemWishlist(index);
    });
  
  	$('body').on('click', '[data-action=addcart-wl]', function() {
       var formData = $(this).attr('data-form');
      	addCartFromWishlist(formData);
    });
  
  	$('body').on('click', '[data-action=add-allcart-wl]', function() {
		var formData = [];
		$('.wishlist-option-item').each(function(){
          var formDataID = $(this).find('.product-options form input[name=id]').attr('value');
			formData.push(formDataID);
		});
		
		addAllCartFromWishlist(formData);
     	
    });
  
  	$('body').on('change', '[data-role=productSelectOptionWl]', function() {
    });
  	$('body').on('click', '#wishlist-wrapper [data-role=change_cart_qty]', function() {
		var $btn = $(this);
		var qty = $btn.data('qty'),
		$pr = $btn.parents('.cart-qty').first(),
		$qtyInput = $('input.qty',$pr),
		curQty = $qtyInput.val()?parseInt($qtyInput.val()):0;
		curQty += qty;
		if (curQty < 1) {
			curQty = 1;
		}
		var input = $(this).parents('.qty-ctl').first().siblings('[data-action=quantity-wl]');
		var index = input.attr('data-index');
		$('#wishlist-form-' + index + ' input[name=quantity]').attr('value', curQty);
		
    });
};

var prepareWishlistItem = function(handle, silent) {
  	var formMessages = $('#cdz-messages');
	$.ajax({
        type: 'GET',
        url: '/products/' + handle + '.js',
        dataType: 'json',
        success: function(product){
          var urlResize = cdzResizeImage(product.featured_image, '200x');
		  var item = {
            availableVariant : product.variants[0].available,
            title: product.title,
            featured_image: urlResize,
            options: product.options,
            variants: product.variants,
            images: product.images,
            currentVariant: product.variants[0],
			compare_at_price_max: product.compare_at_price_max,
            vendor: product.vendor,
            href: '/products/' + handle,
            handle: handle,
            qtyInPut: 1
          };
          wishlistItems.push(item);
          $('[data-action="add-to-wishlist"][data-post="' + handle + '"]').addClass('is-actived');
          var myWishlist = mageTemplate('#content-wl');
          var html = myWishlist({
              wishlistItem: wishlistItems,
              remove: theme.strings.remove,
              addToCart: theme.strings.addToCart,
            wishlist_title: theme.strings.wishlist_title,
            addAllToCart: theme.strings.addAllToCart
          });
          $('#wishlist-wrapper').html(html);
          //update wishlist
          $.ajax({type: "GET",
                  url: '/?view=wishlist',
                  dataType: null,
                  success: function(e) {
                    //$('#popup-wishlist').html(e);
                    $('body').trigger('contentUpdated');
					cdzCurrencies();
                  }
           })
  		  if(silent == false) {
            addProductHandleToWishlistCookie(handle);
			var btnGoWl = theme.strings.wishlist_goAll;
            var $_messages = $('<div class="success clearfix mess-wl"><div class="row"><div class="all-wl col-12" data-action="wishlist-trigger"><a class="show-wl" data-action="show-wl">' + btnGoWl + '</a><a class="close-mess fa fa-window-close" data-action="close-mess-wl"></a></div><div class="wl-left col-3"><img class="product-image-photo img-responsive" src="' + item.featured_image + '"/></div><div class="wl-left col-9"><div class="product-name"><a href="' + item.href + '" class="product-item-link">' + item.title + '</a></div><div class="product-price">' + Shopify.formatMoney(item.currentVariant.price) + '</div></div></div></div>');
            $(formMessages).show().slideDown('slow');
            $_messages.appendTo('#cdz-messages').slideDown('slow');            
            var timeoutID = setTimeout(function() {
               $_messages.slideUp(1000 ,function() {
                	$_messages.remove();
              });
            }, 5000);
            
          }
         },
      });
};

var removeItemWishlist = function(index){
  var item = this.wishlistItems[index];
  var formMessages = $('#cdz-messages');
  this.wishlistItems.splice(index, 1);
  var cookieData = $.parseJSON(getCookie(this.wishlistCookie));
  cookieData.splice(index, 1);
  setCookie(this.wishlistCookie, JSON.stringify(cookieData), null);
  $('[data-action="add-to-wishlist"][data-post="' + item.handle + '"]').removeClass('is-actived');

  var $_messages = $('<span class="success clearfix"></span>');
  var textMessRemove = theme.strings.wishlist_mess_remove;
  $(formMessages).css("z-index","9999");
  $_messages.appendTo('#cdz-messages').text(item.title + ' ' + textMessRemove).slideDown('slow').delay( 1000 );
  $_messages.slideUp(1500 ,function() {
    $_messages.remove();
    $(formMessages).removeAttr("style");
  });

  //build wishlist again after remove
  if(cookieData != '') {
       var myWishlist = mageTemplate('#content-wl');
        var html = myWishlist({
         	wishlistItem: wishlistItems,
            remove: theme.strings.remove,
            addToCart: theme.strings.addToCart,
            wishlist_title: theme.strings.wishlist_title,
            addAllToCart: theme.strings.addAllToCart
        });  
    $('#wishlist-wrapper').html(html);
    
    $.ajax({type: "GET",
                url: '/?view=wishlist',
                dataType: null,
                success: function(e) {
                  //$('#popup-wishlist').html(e);
                  $('body').trigger('contentUpdated');
				  cdzCurrencies();
				  if($(window).innerWidth() < 768){
						$('#mb-wishlist-trigger').trigger( "click" );
				  } else {
					$('#top-wishlist').trigger( "click" ); 	
				  }
                }
        })
  } else {
    $.ajax({type: "GET",
                url: '/?view=wishlist',
                dataType: null,
                success: function(e) {
                  $('#wishlist-wrapper').html(e);
                  $('body').trigger('contentUpdated');
				  cdzCurrencies();
				  if($(window).innerWidth() < 768){
						$('#mb-wishlist-trigger').trigger( "click" );
				  } else {
					$('#top-wishlist').trigger( "click" ); 	
				  }
                }
        })
  };
};

var addCartFromWishlist = function(formData){
  var form = $('#'+ formData);
  var data = form.serializeArray();
  var formMessages = $('#cdz-messages');           
  // add cart
  $.ajax({type: "POST",
          url: '/cart/add.js',
          dataType: "json",
          data: data,
          success: function(data) {
            
            var $_messages = $('<span class="success clearfix"></span>');
            $(formMessages).show();
            $_messages.appendTo('#cdz-messages').text(data.product_title + ' has been added in your cart').slideDown('slow').delay( 1000 );
            $_messages.slideUp(1500 ,function() {
                $_messages.remove();
              	$(formMessages).hide();
              	var index = formData.substr(14);
      			removeItemWishlist(index);
            });
            
             //update header minicart
				 $.ajax({type: "GET",
				  url: '/?view=header-minicart',
				  dataType: null,
				  success: function(e) {
					  $('#header-cart-content').html(e);
					  $('body').trigger('contentUpdated');
					  cdzCurrencies();
				  }
				});
            
             //update footer sticky minicart
				 $.ajax({type: "GET",
				  url: '/?view=mb-bottom-cart',
				  dataType: null,
				  success: function(e) {
					$('#mb-bottom-toolbar-cart').html(e);
					$('body').trigger('contentUpdated');
					cdzCurrencies();
				  }
				});
                
                //update footer cart
                  $.ajax({type: "GET",
                  url: '/?view=footer-cart',
                  dataType: null,
                  success: function(e) {
                    $('#footer-minicart-wrapper').html(e);
                    $('body').trigger('contentUpdated');
                  }
                 })
            $('body').trigger('cardAddedSuccess', {cartData: data});
          },
          error: function(data) {
            
            var $_messages = $('<span class="error clearfix"></span>');
            $(formMessages).show().css("z-index","10000");
            // Set the message text.
            if (data.responseJSON !== '') {
              $_messages.appendTo('#cdz-messages').text(data.responseJSON.description).slideDown('slow').delay( 1000 );
              $_messages.slideUp(1500 ,function() {
                $_messages.remove();
              	$(formMessages).hide().removeAttr("style");
            });

            } else {
              $_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be added').slideDown('slow').delay( 1000 );
              $_messages.slideUp(1500 ,function() {
                $_messages.remove();
              	$(formMessages).hide().removeAttr("style");
            });
            } 
          }
         });

  return false;
}


var addAllCartFromWishlist = function(formData){
	var formMessages = $('#cdz-messages');    
	Shopify.queue = [];
	  for (var i = 0; i < formData.length; i++) {
	    product = formData[i]
	    Shopify.queue.push({
	      variantId: product,
	    });
          }
	  Shopify.moveAlong = function() {
	  // If we still have requests in the queue, let's process the next one.
	  if (Shopify.queue.length) {
	    var request = Shopify.queue.shift();
	    var data = 'id='+ request.variantId + '&quantity=1'
	    $.ajax({
	      type: 'POST',
              url: '/cart/add.js',
	      dataType: 'json',
	      data: data,
	      success: function(res){
	        Shopify.moveAlong();
		  //quantity += 1;
	     },
             error: function(){
	     // if it's not last one Move Along else update the cart number with the current quantity
		  if (Shopify.queue.length){
		    Shopify.moveAlong()
		  } else {
		    
		  }
	      }
           });
        }
	 // If the queue is empty, we add 1 to cart
	else {
	 $.removeCookie('wishlistItems', { path: '/' });
	  wishlistItems = [];
	  $.ajax({type: "GET",
				url: '/?view=wishlist',
				dataType: null,
				success: function(e) {
				  $('#wishlist-wrapper').html(e);
				  $('body').trigger('contentUpdated');
				  if($(window).innerWidth() < 768){
						$('#mb-wishlist-trigger').trigger( "click" );
				  } else {
					$('#top-wishlist').trigger( "click" ); 	
				  }
				}
		})
		var $_messages = $('<span class="success clearfix"></span>');
		$(formMessages).show();
		$_messages.appendTo('#cdz-messages').text('All products has been added in your cart').slideDown('slow').delay( 1000 );
		$_messages.slideUp(1500 ,function() {
			$_messages.remove();
			$(formMessages).hide();
		});
		
		 //update header minicart
			 $.ajax({type: "GET",
			  url: '/?view=header-minicart',
			  dataType: null,
			  success: function(e) {
				  $('#header-cart-content').html(e);
				  $('body').trigger('contentUpdated');
				  cdzCurrencies();
			  }
			});
		
		 //update footer sticky minicart
			 $.ajax({type: "GET",
			  url: '/?view=mb-bottom-cart',
			  dataType: null,
			  success: function(e) {
				$('#mb-bottom-toolbar-cart').html(e);
				$('body').trigger('contentUpdated');
				cdzCurrencies();
			  }
			});
			
			//update footer cart
			  $.ajax({type: "GET",
			  url: '/?view=footer-cart',
			  dataType: null,
			  success: function(e) {
				$('#footer-minicart-wrapper').html(e);
				$('body').trigger('contentUpdated');
			  }
			 })
		$('body').trigger('cardAddedSuccess', {cartData: data});
	 }
       };
    Shopify.moveAlong();
}


/*Change option product*/
function findVarianWhenOptionChange(variants, optionSelectorClass, wrap, exactly) {
	var selector = wrap + ' ' + optionSelectorClass;
	var currentSelect = [];
	var finalVariants = variants;
	
	$(selector).each(function(){
		var value = $(this).val();
		currentSelect.push(value);
	});

	var optionSize = currentSelect.length,
    newVariant,
    newVariant1,
    newVariant2,
    newVariant3,
    availableOption2 = [],
    availableOption3 = [];
  $.each(variants, function(variantId, variant) {
  	if(variant.options[0] == currentSelect[0]) {
      newVariant1 = variant;
      if(optionSize > 1 && availableOption2.indexOf(variant.options[1]) == -1) {
        availableOption2.push(variant.options[1]);
      }
    }
    if(optionSize > 1
        && variant.options[0] == currentSelect[0] 
        && variant.options[1] == currentSelect[1]) {
      if(newVariant2 == undefined) {
        newVariant2 = variant;
      }
      if(optionSize > 2 && availableOption3.indexOf(variant.options[2]) == -1) {
        availableOption3.push(variant.options[2]);
      }
    }
    if(optionSize > 2 && newVariant3 == undefined
        && variant.options[0] == currentSelect[0] 
        && variant.options[1] == currentSelect[1]
        && variant.options[2] == currentSelect[2]) {
      newVariant3 = variant;
    }
  });
  if(exactly) {
  	if(optionSize == 3) {
  		return newVariant3;
  	} else if(optionSize == 2) {
  		return newVariant2;
  	} else {
  		return newVariant1; 
  	}
  } else {
  	if(newVariant3 != undefined) {
	    newVariant = newVariant3;
	  } else if (newVariant2 != undefined) {
	    newVariant = newVariant2;
	  } else {
	    newVariant = newVariant1;
	  }
	  return newVariant;	
  }
};

/*add cart have option Wishlist*/
$.widget('codazon.cdzWlOption',{
	_create: function() {
      this._createVariantType();
      this._toggleOption();
      $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
      })
	},
  	_createVariantType: function() {
    	var self = this, config = self.options;       	
      	var variant = theme.variables.variant_type_mapping;
        var variant_type = variant.split(",");
      	var valueVariant = [];
        $(config.wrap + ' .product-option-wrapper').each(function(){
          	var variantName = $(this).children('.variant-type-image').attr('value').toLowerCase();
      		var variantIndex = $(this).children('.variant-type-image').attr('index');
          
          	$(config.wrap + ' .variant-type-image[index=' + variantIndex + '] label').each(function(){
              var value = $(this).attr("value");
              var url = $(this).attr("data-url");
			  var urlResize = cdzResizeImage(url, '130x');
              var valueUrl = {
                value : value,
				url: urlResize
              };
              valueVariant.push(valueUrl);
            });
            $.each(variant_type, function(key, value) {
              var name =  value.split(":");
              if (name[0] == variantName.replace(" ", "")){
                var myVariantType = mageTemplate('[data-id=content-option-wl]');
                var html = myVariantType({
                  typeVariant: name[1],
                  nameVariant: variantName,
                  valueVariant: valueVariant,
                  option_index: variantIndex
                });
                $(config.wrap + ' [data-id=product-option-' + variantIndex + ']').html(html);
                
              }
           });
          valueVariant = [];
          replaceColorSwatch();
        });
    },
  	_toggleOption: function() {
		var self = this, config = self.options; 
		$(config.wrap + ' .single-option-selector').on('change', function(){
          	var value = $(this).val();
          	$(this).siblings('input').first().attr("value", value);
          	$(this).parents('.product-option').first().find('span.label-value').text(value);
          	var index = $(this).parents('form').first().attr('data-item-index');
      		changeOptionWishlist(index);
		});
      	$(config.wrap + ' .swatch-element').on('click', function(){
			if ( $(this).hasClass('disable') ){
				$(this).children("input").attr('disabled');
			} else if ( $(this).hasClass('selected') ){
				$(this).removeClass('selected');
				$(this).children("input").removeClass('checked');
				$(this).parents('.product-option-wrapper').siblings('.product-option-wrapper').find('.swatch-element').removeClass('disable').children("input").removeAttr('disabled');
			}else{
				$(this).addClass('selected').children("input").addClass('checked').removeAttr('disabled');
				$(this).siblings().removeClass('selected').children("input").removeClass('checked');
				var index = $(this).parents('form').first().attr('data-item-index');
				changeOptionWishlist(index);
				var value = $(this).attr('value');
				var name = $(this).attr('name');
				$(this).parents('.product-option').first().find('span.label-value').text(value);
				self._changeVariation(value, name, index);
			}
		});
      	
	 },
	 _changeVariation: function(value, name, index) {
		var self = this, config = self.options;
		var item = wishlistItems[index];
		var currentValue = [];
		var currentName = [];
      	var availValue = [];
		var disableValue = [];
		var arrayValue = [];
		$.each(item.variants, function(variantId, variant) {
			var n = variant.options.includes(value);
			$.each(variant.options, function(key, values) {
				if (key != name)
					arrayValue.push(values);
			});
			if (n){
				$.each(variant.options, function(key, values) {
					  if (key != name){
						  availValue.push(values);
					  }
				});
			}				
		});
		var arrayValueUnique = arrayValue.filter(function(item, index){
			return arrayValue.indexOf(item) >= index;
		});
		var availValueUnique = availValue.filter(function(item, index){
			return availValue.indexOf(item) >= index;
		});
		jQuery.grep(arrayValueUnique, function(i) {
			if (jQuery.inArray(i, availValueUnique) == -1)
			{
				disableValue.push(i);
			}
		});
		$.each(disableValue, function(key, val) {	
			$('.swatch .swatch-element', self.element).each(function(){
				var valueElement = $(this).attr('value');
				if (val == valueElement){
					$(this).removeClass('enable').removeClass('selected').addClass('disable').children("input").removeClass('checked');
				}
			});
			
		});
		$.each(availValueUnique, function(key, valu) {
			$('.swatch .swatch-element', self.element).each(function(){
				var valueElement = $(this).attr('value');
				if (valu == valueElement){
					$(this).removeClass('disable').addClass('enable');
				}
			});
		});
		availValue = [];
		arrayValue = [];
		disableValue = [];
		arrayValueUnique = [];
		availValueUnique = [];	
	}
});

var changeOptionWishlist = function(index) {
      //var index = $(e.target).attr('data-item-index');
      var product = this.wishlistItems[index];
      var currentVariant = this.findVarianWhenOptionChange(product.variants, '.single-option-selector, .wishlist-option-item-' + index + ' .swatch .swatch-element .checked', '.wishlist-option-item-' + index, true);  
  	if(currentVariant == undefined) {
        product.availableVariant = false;
      	$('.wishlist-option-item-' + index + ' .add-to-cart').removeClass('enable').addClass('disable');
      	$('.wishlist-option-item-' + index + ' .add-to-cart button').attr('disabled','disabled');
      } else {
        product.availableVariant = currentVariant.available;
        product.currentVariant = currentVariant;
        
        $('.wishlist-option-item-' + index + ' .add-to-cart').removeClass('disable').addClass('enable');
		$('.wishlist-option-item-' + index + ' .add-to-cart button').removeAttr('disabled','disabled');
        // Change price
        var currentPrice = Shopify.formatMoney(product.currentVariant.price);
        //$('.wishlist-option-item-' + index + ' .product-price .money').text(currentPrice);
		$.when($('.wishlist-option-item-' + index + ' .price-box', self.element).children('.money').remove()).then($('.wishlist-option-item-' + index + ' .price-box', self.element).append('<span class=\'money\'>'+currentPrice+'</span>'));
	    cdzCurrencies();
		if ( product.currentVariant.price > product.currentVariant.compare_at_price) {
			$('.compare-option-item-' + index + ' .product-single__sale-price').addClass('hide');
		} else {
			$('.compare-option-item-' + index + ' .product-single__sale-price').removeClass('hide');
		}
       
        // Change current image
        if(currentVariant.featured_image != null) {
          var img = currentVariant.featured_image.src.replace('https:','');
          $('.wishlist-option-item-' + index + ' .product-image img').attr('src', img);
        }
        
        // Change value option
        var value = product.currentVariant.id;
        $('.wishlist-option-item-' + index + ' input[name=id]').attr('value', value);
      }
      this.wishlistItems[index] = product;
}

/*add cart have option Compare*/
$.widget('codazon.cdzCompareOption',{
	_create: function() {
      this._createVariantType();
      this._toggleOption();
      $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
      })
	},
  	_createVariantType: function() {
    	var self = this, config = self.options;       	
      	var variant = theme.variables.variant_type_mapping;
        var variant_type = variant.split(",");
      	var valueVariant = [];
        $(config.wrap + ' .product-option-wrapper').each(function(){
          	var variantName = $(this).children('.variant-type-image').attr('value').toLowerCase();
      		var variantIndex = $(this).children('.variant-type-image').attr('index');
          
          	$(config.wrap + ' .variant-type-image[index=' + variantIndex + '] label').each(function(){
              var value = $(this).attr("value");
              var url = $(this).attr("data-url");
			  var urlResize = cdzResizeImage(url, '130x');
              var valueUrl = {
                value : value,
				url: urlResize
              };
              valueVariant.push(valueUrl);
            });
            $.each(variant_type, function(key, value) {
              var name =  value.split(":");
              if (name[0] == variantName.replace(" ", "")){
                var myVariantType = mageTemplate('[data-id=content-option-cp]');
                var html = myVariantType({
                  typeVariant: name[1],
                  nameVariant: variantName,
                  valueVariant: valueVariant,
                  option_index: variantIndex
                });
                $(config.wrap + ' [data-id=product-option-' + variantIndex + ']').html(html);
                
              }
           });
          valueVariant = [];
          replaceColorSwatch();
        });
    },
  	_toggleOption: function() {
		var self = this, config = self.options; 
		$(config.wrap + ' .single-option-selector').on('change', function(){
          	var value = $(this).val();
          	$(this).siblings('input').first().attr("value", value);
          	$(this).parents('.product-option').first().find('span.label-value').text(value);
          	var index = $(this).parents('form').first().attr('data-item-index');
      		changeOptionCompare(index);
		});
      	$(config.wrap + ' .swatch-element').on('click', function(){
			if ( $(this).hasClass('disable') ){
				$(this).children("input").attr('disabled');
			} else if ( $(this).hasClass('selected') ){
				$(this).removeClass('selected');
				$(this).children("input").removeClass('checked');
				$(this).parents('.product-option-wrapper').siblings('.product-option-wrapper').find('.swatch-element').removeClass('disable').children("input").removeAttr('disabled');
			}else{
				$(this).addClass('selected').children("input").addClass('checked').removeAttr('disabled');
				$(this).siblings().removeClass('selected').children("input").removeClass('checked');
				var index = $(this).parents('form').first().attr('data-item-index');
				changeOptionCompare(index);
				var value = $(this).attr('value');
				var name = $(this).attr('name');
				$(this).parents('.product-option').first().find('span.label-value').text(value);
				self._changeVariation(value, name, index);
			}
		});
      	
	 },
	 _changeVariation: function(value, name, index) {
		var self = this, config = self.options;
		var item = compareItems[index];
		var currentValue = [];
		var currentName = [];
      	var availValue = [];
		var disableValue = [];
		var arrayValue = [];
		$.each(item.variants, function(variantId, variant) {
			var n = variant.options.includes(value);
			$.each(variant.options, function(key, values) {
				if (key != name)
					arrayValue.push(values);
			});
			if (n){
				$.each(variant.options, function(key, values) {
					  if (key != name){
						  availValue.push(values);
					  }
				});
			}				
		});
		var arrayValueUnique = arrayValue.filter(function(item, index){
			return arrayValue.indexOf(item) >= index;
		});
		var availValueUnique = availValue.filter(function(item, index){
			return availValue.indexOf(item) >= index;
		});
		jQuery.grep(arrayValueUnique, function(i) {
			if (jQuery.inArray(i, availValueUnique) == -1)
			{
				disableValue.push(i);
			}
		});
		$.each(disableValue, function(key, val) {	
			$('.swatch .swatch-element', self.element).each(function(){
				var valueElement = $(this).attr('value');
				if (val == valueElement){
					$(this).removeClass('enable').removeClass('selected').addClass('disable').children("input").removeClass('checked');
				}
			});
			
		});
		$.each(availValueUnique, function(key, valu) {
			$('.swatch .swatch-element', self.element).each(function(){
				var valueElement = $(this).attr('value');
				if (valu == valueElement){
					$(this).removeClass('disable').addClass('enable');
				}
			});
		});
		availValue = [];
		arrayValue = [];
		disableValue = [];
		arrayValueUnique = [];
		availValueUnique = [];	
	}
});

var changeOptionCompare = function(index) {
      //var index = $(e.target).attr('data-item-index');
      var product = this.compareItems[index];
      var currentVariant = this.findVarianWhenOptionChange(product.variants, '.single-option-selector, .compare-option-item-' + index + ' .swatch .swatch-element .checked', '.compare-option-item-' + index, true);  
  	if(currentVariant == undefined) {
        product.availableVariant = false;
      	$('.compare-option-item-' + index + ' .add-to-cart').removeClass('enable').addClass('disable');
      	$('.compare-option-item-' + index + ' .add-to-cart button').attr('disabled','disabled');
      } else {
        product.availableVariant = currentVariant.available;
        product.currentVariant = currentVariant;
        
        $('.compare-option-item-' + index + ' .add-to-cart').removeClass('disable').addClass('enable');
		$('.compare-option-item-' + index + ' .add-to-cart button').removeAttr('disabled','disabled');
        // Change price
        var currentPrice = Shopify.formatMoney(product.currentVariant.price);
        //$('.compare-option-item-' + index + ' .product-price .money').text(currentPrice);
		$.when($('.compare-option-item-' + index + ' .price-box', self.element).children('.money').remove()).then($('.compare-option-item-' + index + ' .price-box', self.element).append('<span class=\'money\'>'+currentPrice+'</span>'));
	    cdzCurrencies();
		if ( product.currentVariant.price > product.currentVariant.compare_at_price) {
			$('.compare-option-item-' + index + ' .product-single__sale-price').addClass('hide');
		} else {
			$('.compare-option-item-' + index + ' .product-single__sale-price').removeClass('hide');
		}
			
       
        // Change current image
        if(currentVariant.featured_image != null) {
          var img = currentVariant.featured_image.src.replace('https:','');
          $('.compare-option-item-' + index + ' .product-image img').attr('src', img);
        }
        
        // Change value option
        var value = product.currentVariant.id;
        $('.compare-option-item-' + index + ' input[name=id]').attr('value', value);
      }
      this.compareItems[index] = product;
}

var addCartFromCompare = function(formData, handle){
  var form = $('#'+ formData);
  var data = form.serializeArray();
  var formMessages = $('#cdz-messages');           
  // add cart
  $.ajax({type: "POST",
          url: '/cart/add.js',
          dataType: "json",
          data: data,
          success: function(data) {
            var typeAjaxCart = theme.variables.variant_type_ajaxCart;   
			  //update header minicart
			  $.ajax({type: "GET",
				  url: '/?view=header-minicart',
				  dataType: null,
				  success: function(e) {
					$('#header-cart-content').html(e);
					$('body').trigger('contentUpdated');
					cdzCurrencies();
				  }
				});
		
			 //update footer sticky minicart
				 $.ajax({type: "GET",
				  url: '/?view=mb-bottom-cart',
				  dataType: null,
				  success: function(e) {
					$('#mb-bottom-toolbar-cart').html(e);
					$('body').trigger('contentUpdated');
					cdzCurrencies();
				  }
				});
			  if (typeAjaxCart == '01') {
				  $.ajax({type: "GET",
					  url: '/?view=footer-cart',
					  dataType: null,
					  success: function(e) {
						$('#footer-minicart-wrapper').html(e);
											 
						var $checkPanel = $('#cdz-footer-minicart').hasClass('.opened');
						
						var $footerCart = $('#cdz-footerCart-trigger');							
						$.codazon.flyingCart({productBtn: btn}, $footerCart);
						var popupData = $footerCart.data('codazon-flyingCart');
						if (!$checkPanel){
						  popupData._openFooterCart();
						}
						popupData._flyingImage();
						
						$('body').trigger('contentUpdated');   
						
						if ($('body').hasClass('cdz-popup-opened')){
						  $('body').removeClass('cdz-popup-opened');
						  $('[data-role=cdz-popup-section]').hide()
						};
						
					  }
					});
			  } else if (typeAjaxCart == '02') {
				$.ajax({type: "GET",
				  url: '/?view=popup-addMiniCart',
				  dataType: null,
				  success: function(e) {
					$.ajax({
						type: 'GET',
						url: '/products/' + handle + '.js',
						dataType: 'json',
						
						beforeSend: function( xhr ) {
						  $('#popup-addMiniCart').addClass('ajaxcart-loading');
						},
						complete: function (data) {
						  $('#popup-addMiniCart').removeClass('ajaxcart-loading');
						},
						success: function(product){
						  var urlResize = cdzResizeImage(product.featured_image, '150x');
						  var item = {
							//availableVariant : product.variants[0].available,
							title: product.title,
							featured_image: urlResize,
							options: product.options,
							variants: product.variants,
							images: product.images,
							currentVariant: product.variants[0],
							vendor: product.vendor,
							href: '/products/' + handle,
							handle: handle,
							qtyInPut: 1
						  };
						  var myLatestUpdate = mageTemplate('[data-id=latest-update-itemCart]');
						  var html = myLatestUpdate({
							  itemLaUpdate: item
						  });
						  $('#latest-update-itemCart').html(html);
						 }
					  });
					
					$('#popup-addMiniCart').html(e);
					$('body').trigger('contentUpdated');   
					cdzCurrencies();
					replaceColorSwatch();
					reloadAppReview();
					// call popup addMiniCart
					var $popup = $('#popup-addMiniCart');
					var popupData = $popup.data('codazon-cdzPopUp'); 
					popupData._openPopup();
				  }
				});
				  
			  } else {
				  $.ajax({type: "GET",
					  url: '/?view=sidebar-addMiniCart',
					  dataType: null,
					  success: function(e) {
						$('#utilies-addMiniCart').html(e);											 
						var $checkPanel = $('#utilies-addMiniCart').css('display');
						var $sidebarCart = $('#utilies-addMiniCart');
						$.codazon.flyingCart({productBtn: btn, destination: "[data-role=headSide-flying-destination]"}, $sidebarCart);
						var sidebarData = $sidebarCart.data('codazon-flyingCart');
						
						$.when(sidebarData._flyingImage(), $sidebarCart.delay( 1400 )).then(function( $opSidebar, opSidebarData ) {
						  $opSidebar = $('#utilies-addMiniCart');
							opSidebarData = $opSidebar.data('codazon-sideBar');
							opSidebarData._openSideBar();	
						});							
						$('body').trigger('contentUpdated');   
						cdzCurrencies();
						if ($('body').hasClass('cdz-popup-opened')){
						  $('body').removeClass('cdz-popup-opened');
						  $('[data-role=cdz-popup-section]').hide()
						};
						
					  }
					});
			  }
			  $('body').trigger('cardAddedSuccess', {cartData: data});
          },
          error: function(data) {
            
            var $_messages = $('<span class="error clearfix"></span>');
            $(formMessages).show().css("z-index","10000");
            // Set the message text.
            if (data.responseJSON !== '') {
              $_messages.appendTo('#cdz-messages').text(data.responseJSON.description).slideDown('slow').delay( 1000 );
              $_messages.slideUp(1500 ,function() {
                $_messages.remove();
              	$(formMessages).hide().removeAttr("style");
            });

            } else {
              $_messages.appendTo('#cdz-messages').text('Oops! An error occured and your cart could not be added').slideDown('slow').delay( 1000 );
              $_messages.slideUp(1500 ,function() {
                $_messages.remove();
              	$(formMessages).hide().removeAttr("style");
            });
            } 
          }
         });

  return false;
}

//find color and replace
var replaceColorSwatch = function() {
	var data = theme.variables.product_color_mapping;
  	var dataColor = data.split(",");
  	$('.swatch.swatch-color .swatch-element').each(function(){
      var checkValue = $(this).attr('value').toLowerCase();
      var labelValue = $(this).children('label');
      $.each(dataColor, function(key, value) {
          var name =  value.split(":");
		  if (name.length > 2) {
			name[1] = name.slice(1).join(':');
			name.length = 2;
		  }	  
          if (name[0] == checkValue.replace(/ /g, "").replace(/[-\s]/g, '')){
			  //$(labelValue).attr('style','background-color:'+name[1]);
			  var res = name[1].substring(0, 6);
			  if ( res.includes('url') ) {
				 $(labelValue).attr('style','background-image:'+name[1] + '; background-size: cover'); 
				 $(labelValue).attr("data-original-title","<div class='swatch-option-tooltip'><span class='swatch-option-img' style='background-image: " + name[1] + "; width: 130px; height: 130px; display: block;'></span><span class='swatch-option-text'>" + checkValue + "</span></div>");
			  } else {
				  $(labelValue).attr('style','background-color:'+name[1]);
				  $(labelValue).attr("data-original-title","<div class='swatch-option-tooltip'><span class='swatch-option-img' style='background-color: " + name[1] + "; width: 130px; height: 130px; display: block;'></span><span class='swatch-option-text'>" + checkValue + "</span></div>");
			  }
            
          }
       });
      
    });
}


//Layer Navigation
// Layered for collection page
function initLayerderEvent() {
  var me = this;
  var selector = '.filter-current .filter-current-content li.item a, .filter-current .filter-actions .filter-clear, .filter-options-item .swatch .swatch-element a, .filter-options-content li.item a,.filter-options-content a.action-filter-select,#collection-filter .action-sortby-select, #collection-filter .pagination li a';
  $('body').on('change', '#SortBy', function() {
      	var value = $(this).children('option:selected').attr("data-herf");
    	$(this).siblings('[data-role=action-sortby-select]').attr("href", value);
    	$('[data-role=action-sortby-select]').trigger( "click" );
   });
  $('body').on('change', '#filter-select', function() {
      	var value = $(this).val();
    	$(this).siblings('[data-role=action-filter-select]').attr("href", value);
    	$('[data-role=action-filter-select]').trigger( "click" );
   });

  if($(selector).length > 0) {
    $(document).on('click', selector, function(e){
      e.preventDefault();
      var url = $(this).attr('href');
	  if ( url.includes("?") ) {
		  if ( (url.includes('&view')) || (url.includes('?view')) ) {
			 url = url ;
		  } else {
			 url = url + '&view=content-product';
		  }
	  } else {
		   url = url + '?view=content-product';
	  }
      var dataSort = $(this).attr('data-sort');
      $.ajax({
        type: 'GET',
        url: url,
        data: {},
        beforeSend: function( xhr ) {
          showAjaxLoading();
		  if ( url.includes('&view')) {
			  url = url.split( '&view=' )[0];
		  } else {
			  url = url.split( '?view=' )[0];
		  }
        },
        complete: function (data) {
          hideAjaxLoading();
          history.pushState({
            page: url
          }, url, url);
		  
          $('#collection-filter').html($('#collection-filter', data.responseText).html());

          $('.block-layered-nav').html($('.block-layered-nav', data.responseText).html());
		  
          $('[data-toggle="tooltip"]').tooltip({
              trigger : 'hover'
          }) 
          $('body').trigger('contentUpdated');
		  cdzCurrencies();
          lozadObj.observe();
		  replaceColorSwatch();
		  reloadAppReview();
          
          $('.breadcrumbs').html($('.breadcrumbs', data.responseText).html());
        }
      });
    });
  }
}

function showAjaxLoading() {
  $('.loading-mask[data-role="loader"]').show();
}

function hideAjaxLoading() {
  $('.loading-mask[data-role="loader"]').hide();
}

function cdzResizeImage(e,t){try{if("original"==t)return e;var n=e.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);return n[1]+"_"+t+"."+n[2]}catch(r){return e}}

/*== Cart quantity ==*/
function qtyControl() {
	$('body').on('click','[data-role=change_cart_qty]', function (e) {
		var $btn = $(this);
		if ($btn.data('role') != 'change_cart_qty') {
			$btn = $btn.parents('[data-role=change_cart_qty]').first();
		}
		var qty = $btn.data('qty'),
		$pr = $btn.parents('.cart-qty').first(),
		$qtyInput = $('input.qty',$pr),
		curQty = $qtyInput.val()?parseInt($qtyInput.val()):0;
		curQty += qty;
		if (curQty < 1) {
			curQty = 1;
		}
		$qtyInput.val(curQty);
		$qtyInput.attr('value', curQty);
		
	});
}

/*========== back To Top =============*/
function backToTop() {
	if ($('#back-top').length == 0) {
		$('<div id="back-top" class="back-top" data-role="back_top"><a title="Top" href="#top">Top</a></div>').appendTo('body');
	}
	$('[data-role="back_top"]').each(function() {
		var $bt = $(this);
		$bt.click(function(e) {
			e.preventDefault();
			$('html, body').animate({'scrollTop':0},800);
		});
		function toggleButton(hide) {
			if(hide){
				$bt.fadeOut(300);
			}else{
				$bt.fadeIn(300);
			}
		}
		var hide = ($(window).scrollTop() < 100);
		toggleButton(hide);
		$(window).scroll(function() {
			var newState = ($(window).scrollTop() < 100);
			if(newState != hide){
				hide = newState;
				toggleButton(hide);
			}
		});
	});
}

/*=========== Header sticky bottom =============*/
function mbToolbar() {
	var $toolbar = $('#mb-bottom-toolbar');
	var $btnSlider = $('[data-role=group-slider]', $toolbar);
	var $switcher = $('[data-role=switch-group]');
	var clicked = false;
	$btnSlider.owlCarousel({
		items: 1,
		dots: false,
		nav: false,
		animateIn: 'changing',
		animateOut: false,
		touchDrag: false,
		mouseDrag: false,
		rtl: $('body').hasClass('rtl-layout'),
		onChanged: function(property) {
			if (clicked) {
				var dotsCount = $switcher.find('.dot').length;
				$switcher.toggleClass('return');
				$switcher.find('.dot').each(function(i, el){
					var $dot = $(this);
					setTimeout(function() {
						$dot.removeClass('wave-line').addClass('wave-line');
						setTimeout(function() {
							$dot.removeClass('wave-line');
						}, 1000);
					}, i*100);
				});
				setTimeout(function() {
					$btnSlider.find('.owl-item').removeClass('changing animated');
				},300);
				clicked = false;
			}
		}
	});
	var owl = $btnSlider.data('owl.carousel');
	var slideTo = 0;
	$switcher.on('click', function(e) {
		clicked = true;
		e.preventDefault();
		slideTo = !slideTo;
		owl.to(slideTo, 1, true);
	});
};

/*=========== Search click popup =============*/
$.widget('codazon.cdzToogleSearch',{
	_create: function() {
      this._toggleOption();
	},
  	_toggleOption: function() {
		var self = this, config = self.options;
		var wrapper = config.wrapper;
		$(self.element).on('click', function(){
			$(this).toggleClass('clicked');
          	$('.' + wrapper + ' [data-role=popup-search-content]').toggleClass('opened').slideToggle();
		});
	 }
});

/*=========== Sticky Menu =============*/
$.widget('codazon.stickyMenu', {
	options: {
		sticky_mb: true,
		sticky_dt: true,
		threshold: 200
	},
	_create: function () {
		var self = this, config = this.options;
		var $win = $(window);
		var $parent = self.element.parent();
		var parentHeight = $parent.height();
		$parent.css({minHeight: parentHeight});
		
		var t = false, w = $win.prop('innerWidth');
		$win.on('resize',function () {
			if (t) {
				clearTimeout(t);
			}
			t = setTimeout(function () {
				var newWidth = $win.prop('innerWidth');
				if (w != newWidth) {
					self.element.removeClass('active');
					$parent.css({minHeight:''});
					t = setTimeout(function () {
						parentHeight = $parent.height();
						$parent.css({minHeight:parentHeight});
					}, 50);
					w = newWidth;
				}
			}, 200);
		});
		//$win.on('load',function () {
			setTimeout(function () {
				$parent.css({minHeight:''});
				parentHeight = $parent.height();
				$parent.css({minHeight:parentHeight});
				var stickyNow = false, currentState = false;
				$win.scroll(function () {
					var curWinTop = $win.scrollTop();
					if (curWinTop > config.threshold) {
						self.element.addClass('active');
						currentState = true;
					} else {
						self.element.removeClass('active');
						currentState = false;
					}
					if (currentState != stickyNow) {
						$win.trigger('changeHeaderState');
						stickyNow = currentState;
					}
				});
			}, 300);
		//});
	}
	
});
/*=========== Gallery hover Product Grid Style 15 - Store 04 =============*/
$.widget('codazon.cdzGalleryHover', {
	_create: function () {
		var self = this;
		var $img = $('[data-action=hover-gallery]', self.element);
		$('[data-role=thumb-item]', self.element).mouseover(function() {
			$(this).addClass('item-active').parents('.owl-item').siblings().find('[data-role=thumb-item]').removeClass('item-active');
			$img.attr('src', $(this).attr('data-thumb'));
			
		  }).mouseout(function() {
			
		  });
		 
	}
	
});


/*============= Cdz Video Frame ==============*/
$.widget('codazon.videoframe', {
	options: {
		dimensionRatio: 0.562,
		playBtn: '[data-role=play-video]',
		stopBtn: '[data-role=stop-video]',
		placeholder: '[data-role=video-placeholder]',
		placehoderMask: '[data-role=placeholder-mask]',
		frameWrap: '[data-role=abs-frame]'
	},
	_create: function() {
		var conf = this.options;
		this._events();
		var $placehoderMask = $(conf.placehoderMask, self.element);
		var $frameWrapper = $(conf.frameWrap, self.element);
		$frameWrapper.css("padding-bottom", conf.dimensionRatio*100 + '%');
		$placehoderMask.css("padding-bottom", conf.dimensionRatio*100 + '%');
	},
	_events: function() {
		var self = this, conf = this.options;
		$(conf.playBtn, this.element).on('click', function() {			
			var $frameInner = $('iframe', self.element);
			 var symbol = $frameInner[0].src.indexOf("?") > -1 ? "&" : "?";
			  //modify source to autoplay and start video
			  $frameInner[0].src += symbol + "autoplay=1";
			  //$(conf.placehoderMask, self.element).hide();
			
		});
		$(conf.stopBtn, this.element).on('click', function() {			
			var $frameInner = $('iframe', self.element);
			var $newFrame = $frameInner[0].src.slice(0,-11);
			$frameInner[0].src = $newFrame;
			
		});
	}
});

/*============= Cdz Google Map ==============*/
$.widget('codazon.googleMap', {
	options: {
		mapLat: 45.6107667,
		mapLong: -73.6108024,
		mapZoom: 10,
		mapAddress: 'Demo0321',
		markerTitle: 'Infinit',
		jsSource: '//maps.googleapis.com/maps/api/js?v=3.31&key=',
		apiKey: 'AIzaSyDK5UahtlWXSFx4SHa1dW_dQmkPSf2YLfM'
	},
	_create: function(){
		var self  = this, config = this.options;
		var additionalMarkers = [];
		$('.googleMapWrapper .data-additionalMarkers').each(function(){
			var addTitle = $(this).attr('data-title');
			var addAddress = $(this).attr('data-add');
			var addLat = $(this).attr('data-lat');
			var addLong = $(this).attr('data-long');
			additionalMarkers.push({
					title: addTitle,
					address: addAddress,
					latitude: addLat,
					longitude: addLong
			});
		});
		$(this.element).parents('.google-map-wrap').first().css("padding-bottom" , config.map_ratio*100 + "%");
		var require = function(jsSource, handler) {
			var $jsMap = $('#google_maps_script');
			if ($jsMap.length == 0) {
				var googlecript = document.createElement('script');
				googlecript.id = 'google_maps_script';
				googlecript.type = 'text/javascript';
				googlecript.src = config.jsSource + config.apiKey;
				$(googlecript).load(function () {
					handler();
					$(this).data('completed', true);
				});
				document.head.appendChild(googlecript);
			} else {
				if ($jsMap.data('completed')) {
					handler();
				} else {
					$jsMap.load(function () {
						handler();
					});
				}
			}
		}		
		require(config.jsSource, function(){
			var myLatlng = new google.maps.LatLng(config.mapLat, config.mapLong);
			var mapOptions = {
				zoom: config.mapZoom,
				center: myLatlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = null;
			function createMap(){
				var map = new google.maps.Map(self.element.get(0), mapOptions);
				var markers = [];
				markers.push({
					title: config.markerTitle,
					address: config.mapAddress,
					latitude: config.mapLat,
					longitude: config.mapLong
				});
	
				google.maps.event.addListenerOnce(map, 'idle', function(){});

				if (typeof additionalMarkers == 'object') {
					if (additionalMarkers.length) {
						$.each(additionalMarkers, function(i, location) {
							markers.push(location);
						});
					}
				}
				
				var infowindow = new google.maps.InfoWindow();
				$.each(markers, function(i, location) {
					var marker = new google.maps.Marker({
						position: new google.maps.LatLng(parseFloat(location.latitude), parseFloat(location.longitude)),
						map: map,
						title: location.title
					});
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.setContent(location.address);
						infowindow.open(map, marker);
					});
				});
				
				return map;
			}			
			map = createMap();
		});
	}
});

/*============= Category Infinit Scroll ==============*/
$.widget('codazon.productInfinitScroll', {
	options: {
		pagination: '.AjaxinatePagination',
		method: 'scroll',
		container: '.AjaxinateLoop',
		offset: 0,
		loadingText: 'Loading',
		callback: null
	},
	_create: function() {
		var self = this, conf = this.options;
		// Set up our element selectors
		this.containerElement = document.querySelector(conf.container);
		this.paginationElement = document.querySelector(conf.pagination);
		this._destroy();
		this.processing = false;
		this.interval = false;
		this._initHtml();
	},
	_initHtml: function() {
		var self = this, conf = this.options;
		// Find and initialise the correct function based on the method set in the config
		if (conf.method == 'click') {
			this._addClickListener();
		} else {
			var self = this, conf = this.options;
			this.interval = setInterval(function() {
				if (self._checkIfPaginationInView(self.element)) {
					if (!self.processing) {
						self._addScrollListeners();
					}
				}
				if (typeof self.element == 'undefined') {
					clearInterval(self.interval);
				}
			}, 500);
		}
	},
	_addClickListener: function() {
		var self = this, conf = this.options;
		if (this.paginationElement) {
			this.nextPageLinkElement = this.paginationElement.querySelector('a');
			this.clickActive = true;
			if (this.nextPageLinkElement !== null) {
				$(this.nextPageLinkElement).on('click', function(){
					self._stopMultipleClicks(event);
				});
			}
		}
	},
	_addScrollListeners: function() {
		var self = this, conf = this.options;
		this.nextPageLinkElement = this.paginationElement.querySelector('a');
		this._removeScrollListener();
		if (this.nextPageLinkElement) {
		  this.nextPageLinkElement.innerHTML = conf.loadingText;
		  this.paginationElement.classList.add("ajax-loading");
		  this.nextPageUrl = this.nextPageLinkElement.href;
		  this.processing = true;
		  this._loadMore(this.nextPageUrl);
		} else {
			this.processing = false;
		}
		
	},
	_stopMultipleClicks: function(e){
		var self = this, conf = this.options;
		e.preventDefault();
		if (this.clickActive) {
			this.nextPageLinkElement.innerHTML = conf.loadingText;
			this.paginationElement.classList.add("ajax-loading");
			this.nextPageUrl = this.nextPageLinkElement.href;
			this.clickActive = false;
			this._loadMore(this.nextPageUrl);
		}
	},
	_checkIfPaginationInView: function($element) {
		var cond1 = ($element.get(0).offsetWidth > 0) && ($element.get(0).offsetHeight > 0);
		var cond2 = ($element.is(':visible'));
		var winTop = $(window).scrollTop(),
		winBot = winTop + window.innerHeight,
		elTop = $element.offset().top,
		elHeight = $element.outerHeight(true),
		elBot = elTop + elHeight;
		
		var delta = 100;
		
		var cond3 = (elTop <= winTop) && (elBot >= winTop);
		var cond4 = (elTop >= winTop) && (elTop <= winBot);
		var cond5 = (elTop >= winTop) && (elBot <= winBot);
		var cond6 = (elTop <= winBot) && (elBot >= winBot);
		
		return cond1 && cond2 && (cond3 || cond4 || cond5 || cond6);
	},
	_loadMore: function(ajaxUrl) {
		var self = this, conf = this.options;
		var request = new XMLHttpRequest();
		  request.onreadystatechange = function success() {
			if (request.readyState === 4 && request.status === 200) {
			  var newContainer = request.responseXML.querySelectorAll(conf.container)[0];
			  var newPagination = request.responseXML.querySelectorAll(conf.pagination)[0];
			  this.containerElement.insertAdjacentHTML('beforeend', newContainer.innerHTML);
			  this.paginationElement.innerHTML = newPagination.innerHTML;
			  this.paginationElement.classList.remove("ajax-loading");
			  this.processing = false;
			  if (conf.callback && typeof conf.callback === 'function') {
				conf.callback(request.responseXML);
			  }
			  $('body').trigger('contentUpdated');
				cdzCurrencies();
				replaceColorSwatch();
				reloadAppReview();
				self._initHtml();
			  //this._initHtml();
			}
		  }.bind(this);
		  request.open('GET', this.nextPageUrl +'&view=content-product');
		  request.responseType = 'document';
		  request.send();
	},
	_removeClickListener: function() {
		var self = this
		$(this.nextPageLinkElement).on('click', function(){
			self._stopMultipleClicks(event);
		});
	},
	_removeScrollListener: function() {
		var self = this;
	  document.removeEventListener('scroll', function(){
			this._checkIfPaginationInView();
		});
	},
	_destroy: function() {
		var self = this, conf = this.options;
	  // This method is used to unbind event listeners from the DOM
	  // This function is called manually to destroy "this" Ajaxinate instance
	  if (conf.method == 'click') {
			self._removeClickListener();
		} else {
			self._removeScrollListener();
		}
	  return this;
	}
});

/*========== Search Autocomplete ===========*/
$.widget('codazon.searchAutoComplete', {
	options: {
		type: 'product'
	},
	_create: function() {
		this._events();
	},
	_events: function() {
		var self = this, conf = this.options;
		// Current Ajax request.
		var currentAjaxRequest = null;
		// Grabbing all search forms on the page, and adding a .search-results list to each.
		if( !($('#header .sticky-menu .search_autocomplete_wrapper').length) ) {
			var wrapper = $('<div class="search_autocomplete text-left"></div>').hide();
			wrapper.wrap('<div class="search_autocomplete_wrapper"></div>');
			$('#header .sticky-menu').append(wrapper.parent());
		}		
		var searchForms = self.element.css('position','relative').each(function() {
		// Grabbing text input.
		var input = $(this).find('input[name="q"]', self.element);
		input.attr('autocomplete', 'off');
		// Adding a list for showing search results.
		 if( $(this).parents('.mb-bottom-toolbar-wrapper').length) {
			$('<div class="search_autocomplete text-left"></div>').appendTo($(this)).hide();
		 }
		});     
		// Listening to keyup and change on the text field within these search forms.
		$(document).on('keyup change', 'form[action="/search"] input[type="search"]', function() {
          //add css search file
          appendStyle(theme.libs.search_autocomplete.css);
		  // What's the search term?
		  var term = $(this).val();
		  var topSearch = $('#header').outerHeight();
		  // What's the search form?
		  var form = $(this).closest('form');
		  // What's the search URL?
		  var searchURL = '/search?type=' + conf.type + '&q=' + term;
		  var searchURL_article = '/search?type=article&q=' + term;
		  var searchURL_product = '/search?type=product&q=' + term;
		  // What's the search results list?
		  if( $(this).parents('#header').length) {
			var resultsList = $('#header').find('.search_autocomplete');
			//resultsList.empty();
		  } else {
			var resultsList = form.find('.search_autocomplete'); 
			//resultsList.empty();
		  }
		  // If that's a new term and it contains at least 3 characters.
		  if (term.length >= 3 && term != $(this).attr('data-old-term')) {
			// Saving old query.
			$(this).attr('data-old-term', term);
			// Killing any Ajax request that's currently being processed.
			if (currentAjaxRequest != null) currentAjaxRequest.abort();
			// Pulling results
			currentAjaxRequest = $.getJSON(searchURL + '&view=json', function(data) {
			  // Reset results.
			  resultsList.empty();
			  // If we have no results.
			  if(data.results_count == 0) {
				resultsList.hide();
				resultsList.empty();
				resultsList.css("top", "");
			  } else {
				// If we have results.
				resultsList.css("top", topSearch + "px");
				if (data.results.product.size != 0) {
					resultsList.append('<div class="search-title"><span>' + theme.strings.searchProduct + '</span><a class="see-all" href="' + searchURL_product + '">' + theme.strings.searchSeeAll + '(' + data.results.product.size + ')</a></div>');
					$.each(data.results.product.data, function(index, item) {
						if (index < 4) {
						  // code block to be executed
						  var link = $('<a class="align-items-center d-flex"></a>').attr('href', item.url);
						  link.append('<div class="thumbnail"><img src="' + item.thumbnail + '" /></div>');
						  link.append('<span class="title product-item-link">' + item.title + '</span>');
						  link.append('<span class=\'money\'>'+ Shopify.formatMoney(item.price) +'</span>');
						  link.wrap('<li class="item item-product"></li>');
						  resultsList.append(link.parent());
						  cdzCurrencies();
						}
					  
					});
					$('li.item-product').wrapAll("<div class='search-wrap search-product-wrap'><ul></ul></div>");
				}
				if (data.results.blog.size != 0) {
					resultsList.append('<div class="search-title"><span>' + theme.strings.searchBlog + '</span><a class="see-all" href="' + searchURL_article + '">' + theme.strings.searchSeeAll + '(' + data.results.blog.size + ')</a></div>');
					$.each(data.results.blog.data, function(index, item) {
						if (index < 4) {
						  // code block to be executed
						  var link = $('<a class="align-items-center d-flex"></a>').attr('href', item.url);
						  link.append('<div class="thumbnail"><img src="' + item.thumbnail + '" /></div>');
						  link.append('<span class="title product-item-link">' + item.title + '</span>');
						  link.wrap('<li class="item item-blog"></li>');
						  resultsList.append(link.parent());
						}
					  
					});
					$('li.item-blog').wrapAll("<div class='search-wrap search-blog-wrap'><ul></ul></div>");
				}
				resultsList.fadeIn(200);
			  }        
			});
		  }
		});

		// Clicking outside makes the results disappear.
		$('body').bind('click', function(){
			$('.search_autocomplete').hide().empty();
		});
	}
});


/*========== .SN- ===========*/
var compareItems = [], compareCookie = 'compareItems';
var reloadAppReview = function() {
	if(typeof SPR != 'undefined' && typeof SPR.$ != 'undefined') {
		return SPR.registerCallbacks(), SPR.initRatingHandler(), SPR.initDomEls(), SPR.loadProducts(), SPR.loadBadges();
	}
}

$(document).on('shopify:section:load',function() {
	$('body').trigger('contentUpdated');
	addScriptTwitter();
	addScriptFacebook();
});
$(document).on('shopify:section:select',function() {
	$('body').trigger('contentUpdated');
	addScriptTwitter();
	addScriptFacebook();
});
$(document).on('shopify:block:select',function() {
	$('body').trigger('contentUpdated');
	addScriptTwitter();
	addScriptFacebook();
});

var mbContentToggle = function() {
	var curWidth = window.innerWidth;
	var $fTitle = $('[data-action=mb-title-toggle]');
	var $fContent = $('.showhide');
	var is_mobile = false;
	
	$fTitle.on('click', function() {
		if (is_mobile){
			$(this).toggleClass('active');
			$(this).next('.showhide').toggle('slow');
		}
	});
	if ($(window).innerWidth() < 768){
		is_mobile = true;
		$fContent.hide();
	}
	
	
	$(window).on(dtEvent, function(){
		$fTitle.removeClass('active');
		$fContent.show();
		is_mobile = false;
	}).on(mbEvent, function(){
		is_mobile = true;
		$fContent.hide();
	});	
}

function appendScript(filepath, handle) {
    if ($('head script[src="' + filepath + '"]').length > 0) {
      if (typeof handle == 'function') {
      	handle();  
      }
      return;
    }

    var ele = document.createElement('script');
    ele.type = "text/javascript";
    ele.src = filepath;
    
  	if (typeof handle == 'function') {
      $(ele).on('load', function(e) {   
        handle();
      });
    }
    document.head.appendChild(ele);
}
function appendStyle(filepath) {
    if ($('head link[href="' + filepath + '"]').length > 0)
        return;

    var ele = document.createElement('link');
    ele.setAttribute("type", "text/css");
    ele.setAttribute("rel", "Stylesheet");
    ele.setAttribute("href", filepath);
    $('head').append(ele);
}
var addScriptTwitter = function(){
	if ($('[data-role=codazon-twitter]').length > 0) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.src = 'https://platform.twitter.com/widgets.js';
		script.async = true;
		script.charset = 'utf-8';
		script.type = 'text/javascript';
		head.appendChild(script)
	}
}
var addScriptFacebook = function(){
	if ($('[data-role=codazon-facebook]').length > 0) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v4.0';
		script.async = true;
		script.defer = true;
		script.crossorigin = 'anonymous';
		script.charset = 'utf-8';
		script.type = 'text/javascript';
		head.appendChild(script);
		$('body').append('<div id="fb-root"></div>');
	}
}
var openReview = function(){
	$('[data-role=open-review]').on('click', function(){
		 $('html, body').animate({
			scrollTop: $('[data-role=elementtoScrollToReview]').offset().top
		}, 2000);
		var $triggerClick = $('[data-itemtab=cdztab-2]').find('a');
		$triggerClick.trigger('click');
	});
	if(document.URL.indexOf("#reviews") != -1) {
		setTimeout(function() {
			$('[data-role=open-review]').trigger('click');	
		}, 1000);
	}
	
}

function include(filename){
	var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = filename;
    script.async = true;
    script.charset = 'utf-8';
    script.type = 'text/javascript';
    head.appendChild(script)
}

var collapseDesc = function(){
	var $openPanel = $('.panel-toggle-wrap.applied');
	var $closePanel = $('.panel-toggle-wrap.applied.content-open');
	var hContent = $('.panel-toggle-wrap.applied').height();
	if (hContent > 300){
		$openPanel.find('.content-outer').css({'max-height': '300px', 'overflow': 'hidden'});
		$openPanel.append('<div class=content-toolbar><div class=content-toggle><span>'+theme.strings.moreView+'</span></div></div>');
	}
	$('.content-toggle', $openPanel).on('click', function(){
		var self = this;
		$openPanel.toggleClass('content-open');
		if ($openPanel.hasClass('content-open')){
			$(this).find('span').text(theme.strings.lessView);
		} else {
			$(this).find('span').text(theme.strings.moreView);
		}
	});
}

var cdzCurrencies = function() {
	var cookieCurrency = Currency.cookie.read();
	var self = this;
	$('span.money', 'body').each(function() {
	  $(this).attr('data-currency-'+shopCurrency+'', $(this).html());
	});
	if (cookieCurrency == null) {
		if (shopCurrency !== defaultCurrency) {
			Currency.convertAll(shopCurrency, defaultCurrency);
		}
		else {
			Currency.currentCurrency = defaultCurrency;
		}
	} else if ($('[data-curencies=cdz-curencies]').size() === 0 || $('[data-curency-code='+cookieCurrency+']').size() === 0){
		Currency.currentCurrency = shopCurrency;
		Currency.cookie.write(shopCurrency);
	} else if (cookieCurrency === shopCurrency) {
		Currency.currentCurrency = shopCurrency;
	} else {
		Currency.convertAll(shopCurrency, cookieCurrency);
		$('[data-curency-code]').removeClass('active');
		$('[data-curency-code='+cookieCurrency+']').addClass('active');
		$('[data-curencies=cdz-curencies]').find('[data-role=cdz-currency-active]').text(cookieCurrency);
	}
	$('body').on('click', '[data-curency-code]', function() {
		if($(this).hasClass('active')) return false;
		$('[data-curency-code]').removeClass('active');
		$(this).addClass('active');
		var curency_code = $(this).attr('data-curency-code');
		$('[data-curencies=cdz-curencies]').find('[data-role=cdz-currency-active]').text(curency_code);
		Currency.convertAll(Currency.currentCurrency, curency_code);
		Currency.cookie.write(curency_code);
	});
}


var addProductHandleToCompareCookie= function(handle) {
	var json = getCookie(this.compareCookie), data = [];
	if(json != undefined) {
	data = $.parseJSON(json);
	}
	data.push(handle);
	$('[data-action=show-compare]').find('.item-count').text(data.length);
	setCookie(this.compareCookie, JSON.stringify(data), null);
}

var cdzAddToCompare = function() {
	var self = this;
	var formMessages = $('#cdz-messages');
	var textMessError = theme.strings.compare_mess_error;
	if(getCookie(this.compareCookie) != undefined) {
        var dataHrefs = $.parseJSON(getCookie(this.compareCookie));
		var lengthItem = dataHrefs.length;
		$('[data-action=show-compare]').find('.item-count').text(lengthItem);
		
        $.each(dataHrefs, function(index, value) {
			prepareCompareItem(value, true);
        });
		if (lengthItem == 0){
			var myCompare = mageTemplate('#content-compare');
			var html = myCompare({
				compareItem: [],	
			});
			$('#comparison-page').html(html);
		}
    }
	else{
		$('[data-action=show-compare]').find('.item-count').text('0');
		var myCompare = mageTemplate('#content-compare');
		var html = myCompare({
			compareItem: [],	
		});
		$('#comparison-page').html(html);
		
	}
	
    $('body').on('click', '[data-action=add-to-compare]', function() {
		var $checkClass = $(this).hasClass('is-actived');
		var productHanle = $(this).attr('data-post');
		var productTitle = $(this).attr('data-title');
		if ($checkClass){
			var $_messages = $('<span class="error clearfix"></span>');
			$_messages.appendTo('#cdz-messages').text('Oops! ' + productTitle + ' ' + textMessError).slideDown('slow');        
			setTimeout(function() {
				$_messages.slideUp(500 ,function() {
					$_messages.remove();
				});
			}, 1500);
		} else {
			prepareCompareItem(productHanle, false);
		}
    });
	$('body').on('click', '[data-action=rm-compare-item]', function() {
		var index = $(this).attr('data-index');
      	removeItemCompare(index);
    });
	$('body').on('click', '[data-action=close-mess-cp]', function() {
		var parent = $(this).parents('.mess-cp').first();
		$(this).parents('.mess-cp').first().slideUp(1000 ,function() {
			parent.empty();
		});
    });
	
  	$('body').on('click', '[data-action=addcart-cp]', function() {
       var formData = $(this).attr('data-form');
       var handle = $(this).attr('data-handle');
      	addCartFromCompare(formData, handle);
    });
}


var prepareCompareItem = function(handle, silent) {
	var formMessages = $('#cdz-messages');
	$.ajax({
        type: 'GET',
        url: '/products/' + handle + '.js',
        dataType: 'json',
        success: function(product){
			var item = {
				availableVariant : product.variants[0].available,
				title: product.title,
				featured_image: product.featured_image,
				options: product.options,
				variants: product.variants,
				images: product.images,
				currentVariant: product.variants[0],
				compare_at_price_max: product.compare_at_price_max,
				vendor: product.vendor,
				href: '/products/' + handle,
				handle: handle,
				qtyInPut: 1,
				description: product.description,
				sku: product.variants[0].sku
			};
			compareItems.push(item);
			$('[data-action="add-to-compare"][data-post="' + handle + '"]').addClass('is-actived');
			if (silent == false) {
				addProductHandleToCompareCookie(handle);
				var btnGoAll = theme.strings.compare_goAll;
				var $_messages = $('<div class="success clearfix mess-wl"><div class="row"><div class="all-wl col-12"><a class="show-wl" href="/?view=compare">'+btnGoAll+'</a><a class="close-mess fa fa-window-close" data-action="close-mess-wl"></a></div><div class="wl-left col-3"><img class="product-image-photo img-responsive" src="' + item.featured_image + '"/></div><div class="wl-left col-9"><div class="product-name"><a href="' + item.href + '" class="product-item-link">' + item.title + '</a></div><div class="product-price">' + Shopify.formatMoney(item.currentVariant.price) + '</div></div></div></div>');
				$(formMessages).show().slideDown('slow');
				$_messages.appendTo('#cdz-messages').slideDown('slow');				
				var timeoutID = setTimeout(function() {
				   $_messages.slideUp(1000 ,function() {
						$_messages.remove();
				  });
				}, 5000);
				cdzCurrencies();
			} else {
				var myCompare = mageTemplate('#content-compare');
				var html = myCompare({
					compareItem: compareItems,	
				});
				$('#comparison-page').html(html);
				$('body').trigger('contentUpdated');
				replaceColorSwatch();
				cdzCurrencies();
			}
		}
	});
};

var removeItemCompare = function(index){
	var item = this.compareItems[index];
	var formMessages = $('#cdz-messages');
	this.compareItems.splice(index, 1);
	var cookieData = $.parseJSON(getCookie(this.compareCookie));
	cookieData.splice(index, 1);
	$('[data-action=show-compare]').find('.item-count').text(cookieData.length);
	setCookie(this.compareCookie, JSON.stringify(cookieData), null);
	$('[data-action="add-to-compare"][data-post="' + item.handle + '"]').removeClass('is-actived');
	//build compare again after remove
	var myCompare = mageTemplate('#content-compare');
	var html = myCompare({
	  compareItem: compareItems,	
	});
	$('#comparison-page').html(html);
	var $formMessages = $('#cdzcompare-messages');
	$formMessages.addClass('success');
	var textMessRemove = theme.strings.compare_mess_remove;
	$formMessages.html('<strong> ' + item.title + '</strong> ' + ' ' + textMessRemove);
	$('body').trigger('contentUpdated');
	cdzCurrencies();
};


$.widget('codazon.owlSlider', {
	options: {
		items: 4,
		items_1900: 5,
		items_1600: 5,
		items_1440: 5,
		items_1280: 4,
		items_980: 4,
		items_768: 3,
		items_480: 2,
		items_320: 2,
		items_0: 1,
		margin: 20,
		nav: true,
		dots: false,
		rtl: false,
		msg: 'OK',
	},
	_create: function() {
		var self = this;
		this._buildSlider();
	},
	_buildSlider: function() {
		var self = this;
		cofig = this.options;
		$slider = this.element;
		
		$slider.on('initialized.owl.carousel',function() {
			$slider.prev('.brand-loader').remove();
			$slider.parent('.no-loaded').addClass('loaded').removeClass('no-loaded');
		}).owlCarousel({
			items : cofig.items,
			margin: cofig.margin,
			nav: cofig.nav,
			dots: cofig.dots,
			rtl: cofig.rtl,
			checkVisible: false,
			responsive : {
				0 : {
					items: cofig.items_0,
					margin: 10
				},
				320 : {
					items: cofig.items_320,
					margin: 10
				},
				480 : {
					items: cofig.items_480,
					margin: 10
				},
				768 : {
					items: cofig.items_768
				},
				980 : {
					items: cofig.items_980
				},
				1280 : {
					items: cofig.items_1280
				},
				1440 : {
					items: cofig.items_1440
				},
				1600 : {
					items: cofig.items_1600
				},
				1900 : {
					items: cofig.items_1900
				}
			}
			
		});
	},
});

$.widget('codazon.sliderMixItem', {
	options: {
		items: 4,
		items_1900: 5,
		items_1600: 5,
		items_1440: 5,
		items_1280: 4,
		items_980: 4,
		items_768: 3,
		items_480: 2,
		items_320: 2,
		items_0: 1,
		margin: 20,
		nav: true,
		dots: false,
		rtl: false,
		msg: 'OK',
	},
	_create: function() {
		var self = this;
		if ($(window).innerWidth() < 768){
			this._buildMbSlider();
		} else {
			this._buildDtSlider();
		}
		$(window).on(mbEvent, function(){
			self._buildMbSlider();
		}).on(dtEvent, function(){
			self._buildDtSlider();
			self._changeImage();
		});
		this._changeImage();
	},
	_buildMbSlider: function() {
		var self = this;
		var $mbSlider = $('<div data-role=\'mbslider\'></div>');
		var $dtSlider = $('[data-role=dtslider]', self.element);
		var $mediaSlider = $('.media-slider', self.element);        
		$mediaSlider.trigger('destroy.owl.carousel');
		$mbSlider.empty();
		var $item = $('.item', self.element);
		$.each($item, function(index, value) {
			$(this).find('.product-hovered-section .product-details').prependTo($(this).find('.product-item-bottom'));
		});
		
		$mbSlider.append($item);
		self.element.append($mbSlider);
		$mbSlider.addClass('owl-carousel');
		$mbSlider.find('.item').removeClass('hide');
		$dtSlider.trigger('destroy.owl.carousel').remove();
		self._buildSlider($mbSlider);
		var $itemMedia = $mbSlider.find('.item');
		$.each($itemMedia, function(index, value) {
			var $carousel = $(this).find('.owl-carousel');
			$carousel.html($carousel.find('.owl-stage-outer').html());
			$carousel.owlCarousel({items: 4,nav: true, dots: false, margin: 10});
		});
	}
	,
	_buildDtSlider: function() {
		var self = this;
		var $alignment = self.element.data('alignment');
		var $dataGrid = self.element.data('cdzgrid');
		var items = $dataGrid.split(',');
		console.log("Item:" + items);
		var $dataWidth = self.element.data('width');
		var wItems = $dataWidth.split(',');
		function getSum(total, number){
			return total + Math.round(number);
		}
		var total_items_on_group = items.reduce(getSum, 0);
		function arrayMax(arr) {
		  return arr.reduce(function (x, y) {
		    return ( x > y ? x : y );
		  });
		}
		var rows = 0;
		if (items != null){
			var rows = arrayMax(items);
		}
		console.log("rows:" + rows);
		var $dtSlider = $('<div class=\'owl-carousel\' data-role=\'dtslider\'></div>');
		var $mbSlider = $('[data-role=mbslider]', self.element);
		$dtSlider.empty();
		var $mediaSlider = $('.media-slider', self.element);        
		$mediaSlider.trigger('destroy.owl.carousel');
		var $item = $('.item', self.element);
		var $element = '';
		var j;
		if ($alignment == 'left'){
			$.each($item, function(index, value) {
				if (index % total_items_on_group == 0){
					j = 1;
					$(this).find('.product-item-bottom .product-details').prependTo($(this).find('.product-hovered-section'));
					$element += '<div class=\'items\'><div class=\'larg-item\' style=\'width:'+wItems[0]+'%\'><div class=\'item\'>'+$(this).html()+'</div></div>'; 
					$(this).remove();
				} else {
					if (j % rows == 1){
						$element += '<div class=\'small-item\' style=\'width:'+wItems[1]+'%\'>'; 
					}
					$(this).find('.product-hovered-section form').removeAttr('data-form');
					$element += '<div class=\'item\'>'+$(this).html()+'</div>';
					$(this).remove();
					if (j % rows == 0 || index == $item.length - 1){
						$element += '</div>'; 	
					}
					j++;
				}
				if ((index + 1) % total_items_on_group == 0 || index == $item.length - 1){
					$element += '</div>'; 
				}
				
				/*$('body').trigger('contentUpdated');*/	
			});
		} else {
			$.each($item, function(index, value) {
				if (index % total_items_on_group == 0){
					j = 1;
					$element += '<div class=\'items\'>'; 
				} 
				if (j == total_items_on_group){
					$(this).find('.product-item-bottom .product-details').prependTo($(this).find('.product-hovered-section'));
					$element += '<div class=\'larg-item\' style=\'width:'+wItems[0]+'%\'><div class=\'item\'>'+$(this).html()+'</div></div>'; 
					$(this).remove();
				} else {
					if (j % rows == 1){
						$element += '<div class=\'small-item\' style=\'width:'+wItems[1]+'%\'>'; 
					}
					$element += '<div class=\'item\'>'+$(this).html()+'</div>';
					$(this).remove();
					if (j % rows == 0 || index == $item.length - 1){
						$element += '</div>'; 	
					}
					j++;
				}
				if ((index + 1) % total_items_on_group == 0 || index == $item.length - 1){
					$element += '</div>'; 
				}	
			});
		}
		
		$dtSlider.append($element);
		/*$dtSlider.addClass('owl-carousel');*/
		$mbSlider.trigger('destroy.owl.carousel').remove();
		self._buildSlider($dtSlider);

		
		var $itemMedia = $dtSlider.find('.item');
		$.each($itemMedia, function(index, value) {
			var $carousel = $(this).find('.owl-carousel');
			$carousel.html($carousel.find('.owl-stage-outer').html());
			$carousel.owlCarousel({items: 4,nav: true, dots: false, margin: 20});
		});
	},
	_buildSlider: function(slide) {
		var self = this;
		cofig = this.options;
		slide.on('initialized.owl.carousel',function() {
			self.element.find('.brand-loader').remove();
			self.element.addClass('loaded').removeClass('no-loaded');
			self.element.append(slide);
		}).owlCarousel({
			items : cofig.items,
			margin: cofig.margin,
			nav: cofig.nav,
			dots: cofig.dots,
			rtl: cofig.rtl,
			responsive : {
				0 : {
					items: cofig.items_0
				},
				320 : {
					items: cofig.items_320
				},
				480 : {
					items: cofig.items_480
				},
				768 : {
					items: cofig.items_768
				},
				980 : {
					items: cofig.items_980
				},
				1280 : {
					items: cofig.items_1280
				},
				1440 : {
					items: cofig.items_1440
				},
				1600 : {
					items: cofig.items_1600
				},
				1900 : {
					items: cofig.items_1900
				}
			}
		});
		
	},
	_changeImage: function(){
		var self = this;
		var srcImage;
		var $_largImage = $('.larg-item .main-img', this.element);
		var $_mediaSlider = $('.media-slider', this.element);
		/*$('.media-slider .gitem', this.element).on('mouseover', function() {
			$_mediaSlider.find('.gitem').removeClass('item-active')
			$(this).addClass('item-active');
			var srcImage = $(this).data('thumb');
			$_largImage.attr('src', srcImage);
			
		});*/
		$('.gitem', this.element).each(function(){
			var self = this;
			var srcImage = $(this).data('thumb');
			$(this).on('click', function(e){
				e.preventDefault();
			}).on('mouseover', function(){
				var mainImg = new Image();
				$_largImage.addClass('swatch-option-loading');
				$(mainImg).on('load', function(){
					$_largImage.removeClass('swatch-option-loading');
					$_largImage.attr('src', srcImage);
				});
				mainImg.src = srcImage;
			});
		});
	}
});

$.widget('codazon.cdzGalleryHover', {
	options: {
		msg: 'OK',
	},
	_create: function() {
		var self = this;
		this._changeImage();
	},
	_changeImage: function(){
		var self = this;
		var srcImage;
		var $_largImage = $('.main-img', this.element);
		var $_mediaSlider = $('.media-slider', this.element);
		$('.gitem', this.element).each(function(){
			var self = this;
			var srcImage = $(this).data('thumb');
			$(this).on('click', function(e){
				e.preventDefault();
			}).on('mouseover', function(){
				var mainImg = new Image();
				$_largImage.addClass('swatch-option-loading');
				$(mainImg).on('load', function(){
					$_largImage.removeClass('swatch-option-loading');
					$_largImage.attr('src', srcImage);
				});
				mainImg.src = srcImage;
			});
		});
	}
});
$.widget('codazon.changeItemProduct', {
	options: {
		msg: 'OK',
	},
	_create: function() {
		var self = this;
		this._changeSlideItem();
	},
	_changeItem: function(){
		var self = this;
		var srcImage;
		var $_largItem = $('.big-product', this.element);
		var $_smallItem = $('.small-product', this.element);
		$('.gitem', this.element).on('click', function() {
			$(this).addClass('selected-thumb').siblings().removeClass('selected-thumb');
			var activeItem = $(this).data('item');
			$('[data-item='+activeItem+']', $_largItem).removeClass('hide').siblings().addClass('hide');
			
		});
	},
	_changeSlideItem: function(){
		var self = this;
		var srcImage;
		var $_largItem = $('.big-product', this.element);
		var $_smallItem = $('.small-product', this.element);
		$('.gitem', this.element).on('click', function() {
			$(this).addClass('selected-thumb').siblings().removeClass('selected-thumb');
			var activeItem = $(this).data('item');
			$_largItem.trigger("to.owl.carousel", [activeItem - 1, 0]);
		});
	}
});

$.widget('codazon.builDynamicTabs', {
	options: {
		show_ddmobile: false,
		msg: 'OK',
	},
	_create: function() {
		var self = this;
		this._activeTab();
		this._itemTab();
		this._titleItem();
		this._showDropDownMobile();
		this._closeDropdownTab();
	},
	_activeTab: function() {
		var self = this;
		var cofig = this.options;
		$tab = this.element;
		$('.tab-content-item.active', this.element).show();
		setTimeout(function() {
			$('.tab-content-item', self.element).not('.active').hide();
		}, 30);
		$tab.prepend('<a class="showhide-dropdown" href="javascript:void(0)"><span>'+ $('.tab-item.active .tab-title', $tab).text()+'</span></a>');
		/*$tab.find('.showhide-dropdown').hide();*/
		if($(window).innerWidth() < 768 && self.options.show_ddmobile == true){
			$tab.find('.showhide-dropdown').addClass('show-mobile');
		}
	},
	_itemTab: function(){
		var self = this;
		$li = $('.tab-item.has-content', this.element);
		$li.on('click', function() {
			$tab = self.element;
			$tab.find('.tab-item').removeClass('active');
			$tab.find('.tab-content-item').removeClass('active');
			$(this).addClass('active');
			var tabItem = $(this).data('itemtab');
			$tab.find('#'+tabItem).addClass('active');
			$tab.find('.tab-content-item').hide();
			$tab.find('.tab-content-item.active').show();
			var titleItem = $tab.find('[data-itemtab='+tabItem+'] .tab-title').text();
			$tab.find('.showhide-dropdown').text(titleItem);
			if($(window).innerWidth() < 768 && self.options.show_ddmobile == true){
				$tab.find('.cdztab').removeClass('show').addClass('hide').slideUp('slow');
			}


		});	
	},
	_titleItem: function(){
		var self = this;
		$('.showhide-dropdown', this.element).on('click', function(){
			$tab = self.element;
			$ul = $('.cdztab', $tab);
			if($(window).innerWidth() < 768 && self.options.show_ddmobile == true){
				if($ul.hasClass('hide')){
					$ul.removeClass('hide').addClass('show').slideDown('slow');
				}
				else{
					$ul.removeClass('show').addClass('hide').slideUp('slow');
				}
			}
		});
		
	},
	_showDropDownMobile: function() {
		var self = this;
		var cofig = this.options;
		if($(window).innerWidth() < 768 && cofig.show_ddmobile == true){
			$('.cdztab', self.element).addClass('abs-dropdown hide').hide();
			$('.showhide-dropdown', self.element).show();
		} else {
			$('.showhide-dropdown', self.element).hide();
			$('.cdztab', self.element).removeClass('abs-dropdown hide').show();
		}
		$(window).on(mbEvent, function(){
			if(cofig.show_ddmobile == true){
				$('.cdztab', self.element).addClass('abs-dropdown hide').hide();
				$('.showhide-dropdown', self.element).show();
			} else {
				$('.showhide-dropdown', self.element).hide();
				$('.cdztab', self.element).removeClass('abs-dropdown hide').show();
			}
		}).on(dtEvent, function(){
			$('.showhide-dropdown', self.element).hide();
			$('.cdztab', self.element).removeClass('abs-dropdown hide').show();
		});
	},
	_closeDropdownTab: function(){
		var self = this;
		$('body').on('click', function(e) {
			var $target = $(e.target);
			$tab = self.element;
			$a = $('.showhide-dropdown', $tab);
			$ul = $('.cdztab', $tab);
			if($(window).innerWidth() < 768 && self.options.show_ddmobile == true){
				if(! $target.is($a) || $a.find($target).length || $target.is($ul) || $ul.find($target).length){
					$ul.removeClass('show').addClass('hide').slideUp('slow');
				}
			}
		});
	}
});


$.widget('codazon.cdzProductDeal', {
	options: {
      dealStartDate: '',
      dealEndDate: '',
	  dealNowDate: ''
    },
	_create: function() {
		var self = this;
		var conf = this.options;
		var now = (new Date(conf.dealNowDate)).getTime();
		self.delta = (new Date()).getTime() - (new Date(conf.dealNowDate)).getTime();
		var startDeal = now - Date.parse(conf.dealStartDate);
		var t = Date.parse(conf.dealEndDate) - now;
		if (startDeal > 0 && t > 0) {
			this._initializeClock();
		} else {
			$(this.element).hide();
		}
	},
	_initializeClock: function() {
		var self = this;
		var daysSpan = $('.days', self.element);
		var hoursSpan = $('.hours', self.element);
		var minutesSpan = $('.minutes', self.element);
		var secondsSpan = $('.seconds', self.element);
		function updateClock() {
			var conf = self.options;
			/*var t = self._getTimeRemaining();*/
			var now = new Date().getTime() - self.delta;
			var t = Date.parse(conf.dealEndDate) - now;
			var seconds = Math.floor((t / 1000) % 60);
			var minutes = Math.floor((t / 1000 / 60) % 60);
			var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
			var days = Math.floor(t / (1000 * 60 * 60 * 24));
			daysSpan.text(days);
			hoursSpan.text(('0' + hours).slice(-2));
			minutesSpan.text(('0' + minutes).slice(-2));
			secondsSpan.text(('0' + seconds).slice(-2));

			if (t.total <= 0) {
			  clearInterval(timeinterval);
			}
		}

		updateClock();
		var timeinterval = setInterval(updateClock, 1000);
	}
});

$.widget('codazon.builDynamicQuickView',{
	options:{
		url: '',
		price: '',
		curCurrency: 'USD',
	},
	_create: function() {	
		var self = this;
		$(this.element).on('click', function() {
			$('#popup-quickshop').html('<div class=\'no-loaded\'><div class=\'brand-loader double-bounce-spinner\'><div class=\'double-bounce1\'></div><div class=\'double-bounce2\'></div></div></div>');
			appendStyle(theme.strings.fcLightGallery);
			appendStyle(theme.strings.fcLightSlider);
			var urlQS;
			if ( self.options.url.includes("?") ) {
				urlQS = self.options.url + '&view=quickshop';
			} else {
				urlQS = self.options.url + '?view=quickshop';
			}
			console.log(urlQS);
			$.ajax({type: "GET",
			    url: urlQS,
			    dataType: "HTML",
			    success: function(data) {
                appendScript(theme.strings.fsLightSlider);
                appendScript(theme.strings.fsLightGalleryAll, function() {
					var html = data;
					setTimeout(function() {
						var content = html;
						$('#popup-quickshop').html(html);
						$('body').trigger('contentUpdated');
                   		reloadAppReview();
                   		cdzCurrencies();
						replaceColorSwatch();
					}, 30);
                    
                });
			  }
			});	
		});
	},
	_updatePrice : function() {
		var self = this;
		var conf = this.options;
		var cookieCurrency = Currency.cookie.read();
		var defaultCurrency = Currency.format;
		var shopCurrency = conf.curCurrency;
		if (cookieCurrency == null) {
		  if (shopCurrency !== defaultCurrency) {
			Currency.convertAll(shopCurrency, defaultCurrency);
		  }
		  else {
			Currency.currentCurrency = defaultCurrency;
		  }
		}
		// If the cookie value does not correspond to any value in the currency dropdown.
		else if (jQuery('[name=currencies]').size() && jQuery('[name=currencies] option[value=' + cookieCurrency + ']').size() === 0) {
		  Currency.currentCurrency = shopCurrency;
		  Currency.cookie.write(shopCurrency);
		}
		else if (cookieCurrency === shopCurrency) {
		  Currency.currentCurrency = shopCurrency;
		}
		else {
		  Currency.convertAll(shopCurrency, cookieCurrency);
		}
		
	}

});

/*Instagram Item*/
$.widget('codazon.cdzInstagram', {
	options: {
		id: 1,
		ins_accesstoken: null,
		ins_count: 10,
		show_slider: 1,
		total_rows: 1,
		items: 4,
		items_1900: 5,
		items_1600: 5,
		items_1440: 5,
		items_1280: 4,
		items_980: 4,
		items_768: 3,
		items_480: 2,
		items_320: 2,
		items_0: 1,
		margin: 20,
		nav: true,
		dots: false,
		center: false,
        loop: false,
        stagePadding: 0,
		msg: 'OK',
	},
	_create: function() {
		var self = this;
		this._loadInsPhoto();
		
	},
	_loadInsPhoto: function() {
		var self = this;
		conf = this.options;
		var token = '7288248611.1677ed0.e13978dd3ac64aa196f8ae4fafe1a01b', // learn how to obtain it below
		num_photos = 9; // how much photos do you want to get
		$.ajax({
			url: 'https://api.instagram.com/v1/users/self/media/recent', // or /users/self/media/recent for Sandbox
			dataType: 'jsonp',
			type: 'GET',
			data: {access_token: conf.ins_accesstoken, count: conf.ins_count},
			success: function(data){
				var mytmpl = mageTemplate('#instagram-tmpl-'+self.options.id);
				var html = mytmpl({
					instagram: data.data,
					total_rows: self.options.total_rows,
					show_slider: self.options.show_slider
				});
				$(self.element).find('.instagram-photos').html(html);
				if (self.options.show_slider == 1 && self.options.nav == 1){
					self._buildSlider();
					// Custom Button
					var owl = $('.instagram-slider', self.element);
					$('.owl-next[data-targetslider=instagram-slider]', self.element).on('click', function() {
						owl.trigger('next.owl.carousel');
					});
					$('.owl-prev[data-targetslider=instagram-slider]', self.element).on('click', function() {
						owl.trigger('prev.owl.carousel');
					});
				}
				else{
					$('.owl-next[data-targetslider=instagram-slider]', self.element).hide();
					$('.owl-prev[data-targetslider=instagram-slider]', self.element).hide();
				}
				
			},
			error: function(data){
				
			}
		});
	},
	_buildSlider: function() {
		var self = this;
		cofig = this.options;
		$slider = this.element.find('.owl-carousel');
		$slider.owlCarousel({
			items : cofig.items,
			margin: cofig.margin,
			nav: cofig.nav,
			dots: cofig.dots,
			center: cofig.center,
			loop: cofig.loop,
			stagePadding: cofig.stagePadding,
			responsive : {
				0 : {
					items: cofig.items_0
				},
				320 : {
					items: cofig.items_320
				},
				480 : {
					items: cofig.items_480
				},
				768 : {
					items: cofig.items_768
				},
				980 : {
					items: cofig.items_980
				},
				1280 : {
					items: cofig.items_1280
				},
				1440 : {
					items: cofig.items_1440
				},
				1600 : {
					items: cofig.items_1600
				},
				1900 : {
					items: cofig.items_1900
				}
			}
		});
	}
});


$.widget('codazon.cdzProductMedia', {
	options: {
		viewMoreStyle: 'horizontal',
		mvImgWidth: 100,
		mvThumbMargin: 10,
		vmItemActive: 1,
		productManifier: true,
		productManifierWidth: 200,
		productZoomRatio: 1,
		rtl: false,
		msg: 'OK',
	},
	_create: function() {
		var self = this;
		var conf = this.options;
		var $sliderMainImg = $('.product-photo', this.element);
		this._swapImage();
        this._cdzlightGallery();
        
		$(window).on(mbEvent, function(){
			$('.view-more', this.element).hide();
		}).on(dtEvent, function(){
			$('.view-more', this.element).show();	
		});
		
		var mainImage = new Image();
		setTimeout(function(){
			mainImage.src = $sliderMainImg.find('.item-image').data('src');
		},30);
		var activeOwlItem = $('.product-photo').find('.show').data('item');
		$(mainImage).on('load', function() {
			setTimeout(function() {
				$sliderMainImg.addClass('owl-carousel');
				self._createMainImgSlider();
				$(".product-photo").trigger("to.owl.carousel", [activeOwlItem - 1, 0]);
				if(conf.productManifier == true) {
					self._cdzZoom();
				}
				mainImage = new Image();
				$(mainImage).on('load', function() {
					self._createVMSlider();
					$(window).trigger('resize');

				});
				mainImage.src = $sliderMainImg.find('.item-image').data('src');
			}, 70);
		});
	},
	_createMainImgSlider: function() {
		var self = this;
		$('.product-photo').owlCarousel({
			items: 1,
			dots: false,
			nav: false,
			margin: 10,
			rtl: self.options.rtl,
			responsive : {
				0 : {
					dots: true,
					nav: false
				},
				320 : {
					dots: true,
					nav: false
				},
				480 : {
					dots: true,
					nav: false
				},
				768 : {
					/*items: cofig.items_768*/
				}
			}
		});
		
		
	},
	_cdzlightGallery: function() {
      var self = this;
      $('.product-photo').lightGallery({
			selectWithin: '.gallery-image',
			selector: '.main-link'
		});
      $('.full-image', this.element).click( function() {
        $('.product-photo .owl-item.active .main-link', self.element).click();
      });
      
	},
	_swapImage: function() {
		var self = this;
		var conf = this.options;
		$('.view-more-list li', this.element).on('click', function() {
			$(this).addClass('selected-thumb').siblings().removeClass('selected-thumb');
			var activeMainImage = $(this).data('item');
			$(".product-photo").trigger("to.owl.carousel", [activeMainImage - 1, 500]);
			if(conf.productManifier == true) {
				self._cdzZoom();
			}
			
		});
	},
	_getMedia: function() {
		if(window.innerWidth < mBreakpoint){
			return 'mobile';
		}else{
			return 'desktop';
		}
	},
	_getVMSettings: function(config) {
		var self = this, conf = this.options;
		if (!config) {
			var config = {};
		}
		config.slideMargin = conf.mvThumbMargin;
		config.thumbWidth = conf.mvImgWidth;
		config.rtl = this.options.rtl;
		config.vertical = (conf.viewMoreStyle == 'vertical') && (window.innerWidth >= mBreakpoint);
		if (config.vertical) {
			config.slideHeight = $('.view-more-list', self.element).find('li img').first().outerHeight();
			config.verticalHeight = $('.product-photo img', self.element).outerHeight();
			config.item = config.verticalHeight / (config.slideHeight + config.slideMargin);
		}
		else{
			config.verticalHeight = $('.product-photo img', self.element).outerWidth();
			config.item = config.verticalHeight / (config.thumbWidth + config.slideMargin);
		}
		config.pager = false;
		return config;
	},
	_createVMSlider: function() {
		var self = this, conf = this.options;
		var $sliderMainImg = $('.product-photo', this.element);
		var config = this._getVMSettings({});
		var curMedia = this._getMedia();
		var t = false;
		var $sliderViewMore = $('.view-more-list', this.element);
		$sliderViewMore.lightSlider(config);
		$sliderMainImg.on('refreshed.owl.carousel',function() {
			if (t) clearTimeout(t);
			t = setTimeout(function() {
				if (curMedia != self._getMedia()) {
					curMedia = self._getMedia();
					$sliderViewMore.destroy();
					$sliderViewMore.removeClass('lSSlide');
					$sliderViewMore.lightSlider = $.fn.lightSlider;
					$sliderViewMore.lightSlider(self._getVMSettings({}));
					
				} else {
					$sliderViewMore.setConfig(self._getVMSettings({}));
					$sliderViewMore.refresh();
				}
			}, 100);
			
			
		});
	},
	_cdzZoom: function (){
		var self = this;
		var conf = this.options;
		var nativeWidth = 0;
		var nativeHeight = 0;
		$('.owl-item.active', this.element).on('mousemove touchmove', function(e) {
			var $magnify = $(this).find('.magnify');
			var $mainImg = $(this).find('.main-link img');
			var wMainImg = $mainImg.width();
			var hMainImg = $mainImg.height();
			if(!nativeWidth && !nativeHeight){
				var imgObject = new Image();
				$(imgObject).on('load', function() {
					if (imgObject.width * conf.productZoomRatio > wMainImg && imgObject.height * conf.productZoomRatio > hMainImg){
						nativeWidth = imgObject.width * conf.productZoomRatio;
						nativeHeight = imgObject.height * conf.productZoomRatio;
						var bgsize = nativeWidth + "px " + nativeHeight + "px";
						$magnify.css({backgroundSize: bgsize});
					}
					else{
						nativeWidth = imgObject.width;
						nativeHeight = imgObject.height;
					}
					$magnify.css({backgroundImage: 'url('+imgObject.src+')', backgroundRepeat: 'no-repeat'});
				});
				imgObject.src = $(this).find('.main-link').attr('href');
				
			}else{
				var magnifyOffset = $(this).offset();
				var mx = e.pageX - magnifyOffset.left;
				var my = e.pageY - magnifyOffset.top;
			}
			if(mx < $(this).width() && my < $(this).height() && mx > 0 && my > 0 && nativeWidth > $(this).width() && nativeHeight > $(this).height()){
				$magnify.fadeIn(100);
			}
			else{
				$magnify.fadeOut(100);
			}
			if($magnify.is(':visible')){
				var rx = Math.round(mx/$mainImg.width()*nativeWidth - $magnify.width()/2)*(-1);
				var ry = Math.round(my/$mainImg.height()*nativeHeight - $magnify.height()/2)*(-1);
				var bgp = rx + "px " + ry + "px";
				var px = mx - $magnify.width()/2;
				var py = my - $magnify.height()/2;
				
				
				$magnify.css({left: px, top: py, backgroundPosition: bgp, width: conf.productManifierWidth, height: conf.productManifierWidth});
			}
		});
		$('.owl-item.active', this.element).on('mouseleave touchmove',function(e){
            $('.magnify', this.element).fadeOut(100);
        }); 
		
	}
});


function makeSameHeight() {
	$('[data-sameheight]').each(function() {
		var $element = $(this), sameHeightArray = $element.data('sameheight').split(',');
		$.each(sameHeightArray, function(i, sameHeight) {
			var maxHeight = 0;
			$element.find(sameHeight).css({minHeight: ''}).each(function() {
				var $sItem = $(this);
				var height = $sItem.outerHeight();
				if (height > maxHeight) {
					maxHeight = height;
				}
			}).css({minHeight: maxHeight});
		});
	});
};
