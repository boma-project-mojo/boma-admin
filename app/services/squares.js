/* 

This service handles the toggling of the full information for
items (squares) on each of the pages.  

*/

import Service from '@ember/service';

export default Service.extend({
  activeSetNumber: null,

  /* 
   * goToTop()
   *
   * Animate the scroll position to the top of the page.  
   */  
  goToTop() {
    $('body').velocity('scroll', { duration: 900, offset: -53 });
  },
  /* 
   * toggleSquare()
   *
   * Binds the click events for toggling open or closed the page elements and
   * handling the animation of the page scroll position for best UX.  
   */   
  toggleSquare() {
    var self = this;
    $('.toggle-content-wrap, .close-square')
      .unbind()
      .click(function (e) {
        // Close open relevant DOM elements
        $('.image-square.active').not($(this)).removeClass('active');
        $('.content-wrap:visible')
          .not($(this).next('.content-wrap'))
          .removeClass('active animate');

        // Open / Close new DOM elements
        $(this).toggleClass('active');
        $(this).next('.content-wrap').toggleClass('active');

        // If the .content-wrap is not in the current set then animate open and scrollTo
        if (
          self.get('activeSetNumber') === null ||
          self.get('activeSetNumber') != $(this).data('set-number')
        ) {
          $(this).next('.content-wrap').addClass('animate');
          $(this).velocity('scroll', { duration: 300, offset: -53 });
        }

        // Set the current set number
        self.set('activeSetNumber', $(this).data('set-number'));
      });
  },
});
