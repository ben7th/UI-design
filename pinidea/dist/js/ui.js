(function() {
  jQuery(document).on('ready page:load', function() {
    return console.debug('loaded');
  });

  jQuery(document).on('ready page:load', function() {
    var nav;
    nav = jQuery('[data-nav]').data('nav');
    return jQuery(".layout-footer a.item." + nav).addClass('active');
  });

  jQuery(document).on('ready page:load', function() {
    var title;
    title = jQuery('[data-title]').data('title');
    return jQuery(".layout-header .page").text(title);
  });

  jQuery(document).delegate('.page-landing .filter a.item', 'click', function() {
    var $item;
    $item = jQuery(this);
    $item.closest('.filter').find('a.item').removeClass('active');
    return $item.addClass('active');
  });

  jQuery(document).on('ready page:load', function() {
    var back_url;
    back_url = jQuery('[data-back]').data('back');
    return jQuery(".layout-header .back").attr('href', back_url);
  });

  jQuery(document).delegate('.topic-options .option', 'click', function() {
    return jQuery(this).toggleClass('active');
  });

  jQuery(document).delegate('.page-new-topic .form a.next', 'click', function() {
    var $current_part, $to_part, current, to;
    $current_part = jQuery(this).closest('.part');
    $to_part = $current_part.next('.part');
    current = $current_part.data('step');
    to = $to_part.data('step');
    $current_part.fadeOut(200);
    $to_part.fadeIn(200);
    jQuery(".topbar .steps .step[data-step=" + current + "]").removeClass('active').addClass('done');
    return jQuery(".topbar .steps .step[data-step=" + to + "]").addClass('active');
  });

  jQuery(document).delegate('.page-new-topic .form a.prev', 'click', function() {
    var $current_part, $to_part, current, to;
    $current_part = jQuery(this).closest('.part');
    $to_part = $current_part.prev('.part');
    current = $current_part.data('step');
    to = $to_part.data('step');
    $current_part.fadeOut(200);
    $to_part.fadeIn(200);
    jQuery(".topbar .steps .step[data-step=" + current + "]").removeClass('active');
    return jQuery(".topbar .steps .step[data-step=" + to + "]").removeClass('done').addClass('active');
  });

}).call(this);

//# sourceMappingURL=../maps/ui.js.map