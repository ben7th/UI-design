(function() {
  jQuery(document).on('click', '.form .submits a.do-submit:not(.disabled)', function() {
    return jQuery('.form .result').fadeIn();
  });

  jQuery(document).on('click', '.form a.do-clear', function() {
    return jQuery('.form .result').fadeOut();
  });

  jQuery(document).on('input', '.form textarea', function() {
    var val;
    val = jQuery('.form textarea').val();
    if (jQuery.trim(val).length > 0) {
      return jQuery('.form .submits a.do-submit').removeClass('disabled');
    } else {
      return jQuery('.form .submits a.do-submit').addClass('disabled');
    }
  });

}).call(this);

//# sourceMappingURL=../maps/ui.js.map