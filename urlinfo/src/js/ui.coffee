jQuery(document).on 'click', '.form .submits a.do-submit:not(.disabled)', ->
  jQuery('.form .result').fadeIn()

jQuery(document).on 'click', '.form a.do-clear', ->
  jQuery('.form .result').fadeOut()

jQuery(document).on 'input', '.form textarea', ->
  val = jQuery('.form textarea').val()
  if jQuery.trim(val).length > 0
    jQuery('.form .submits a.do-submit').removeClass('disabled')
  else
    jQuery('.form .submits a.do-submit').addClass('disabled')