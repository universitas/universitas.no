require('expose?$!expose?jQuery!jquery');
require('slick');
require('script!zurb-foundation-5/js/foundation/foundation');
require('script!zurb-foundation-5/js/foundation/foundation.reveal');
// require('../../../bower_components/foundation/js/foundation/foundation.dropdown.js');
// require('../../../bower_components/foundation/js/foundation/foundation.tooltip.js');
// require('../../../bower_components/foundation/js/foundation/foundation.topbar.js');
$(document).foundation();
$(function(){
  $('.slideshow').slick({ dots:true, arrows:true });
});