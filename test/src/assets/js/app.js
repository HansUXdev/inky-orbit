(function ($) {
  "use strict";

  function foundation() {
  	$(document).foundation();
  }
  function menu_animation() {
		var $button = $('.menu-icon');
		var $panel = $('.menu-item');

		$button.click(function() {
		    MotionUI.animateIn('.menu .menu-item.active', 'slow hinge-in-from-top scale-in-down');

		    // change the effect to attention to home and contact pages
		    MotionUI.animateIn('.menu .menu-item.item', 'slow slide-in-left');
		    MotionUI.animateIn('.menu .menu-item.item2', 'slow hinge-in-from-left');
		    MotionUI.animateIn('.menu .menu-item.item3', 'slow slide-in-left');
		    MotionUI.animateIn('.menu .menu-item.item4', 'slow hinge-in-from-left');

		    MotionUI.animateIn('.menu .menu-item.item5', 'slow hinge-in-from-bottom scale-in-down');
		});
		
  }

  function init() {
    foundation(),
    menu_animation();
  }

  init();

})(jQuery);