var $ = require('jquery');
require('slick-carousel/slick/slick');
require('zurb-foundation-5/js/foundation/foundation');
require('zurb-foundation-5/js/foundation/foundation.reveal');
$(document).foundation();
$(function(){
  $('.slideshow').slick({ dots:true, arrows:true });
});
