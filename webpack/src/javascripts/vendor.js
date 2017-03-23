const $ = require('jquery')
require('foundation-sites/dist/js/plugins/foundation.core')
require('foundation-sites/dist/js/plugins/foundation.reveal')
require('foundation-sites/dist/js/plugins/foundation.util.mediaQuery')
require('slick-carousel/slick/slick')

$(document).foundation()
$(function(){
  $('.slideshow').slick({ dots:true, arrows:true })
})
