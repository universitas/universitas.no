require('jquery');
require('slick-carousel/slick/slick');
require('zurb-foundation-5/js/foundation/foundation');
require('zurb-foundation-5/js/foundation/foundation.reveal');
jquery(document).foundation();
jquery(function(){
  jquery('.slideshow').slick({ dots:true, arrows:true });
});
