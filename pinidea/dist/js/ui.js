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

}).call(this);

//# sourceMappingURL=../maps/ui.js.map