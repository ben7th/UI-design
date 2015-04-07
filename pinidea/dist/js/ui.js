(function() {
  var TopicForm;

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

  TopicForm = (function() {
    function TopicForm($el) {
      this.$el = $el;
      if (this.$el.length === 0) {
        return;
      }
      this.current_step = 1;
      this.$url_textarea = this.$el.find('textarea.url');
      this.$a_loadurl = this.$el.find('a.loadurl');
      this.$infocard = this.$el.find('.infocard');
      this.$loading = this.$el.find('.loading');
      this.$loadsuccess = this.$el.find('.loaded-success');
      this.bind_events();
    }

    TopicForm.prototype.bind_events = function() {
      var that;
      this.$el.delegate('a.next:not(.disabled)', 'click', (function(_this) {
        return function() {
          return _this.to_next();
        };
      })(this));
      this.$el.delegate('a.prev:not(.disabled)', 'click', (function(_this) {
        return function() {
          return _this.to_prev();
        };
      })(this));
      this.$url_textarea.on('input', (function(_this) {
        return function() {
          if (jQuery.trim(_this.$url_textarea.val()).length > 0) {
            return _this.$a_loadurl.removeClass('disabled');
          } else {
            return _this.$a_loadurl.addClass('disabled');
          }
        };
      })(this));
      this.$a_loadurl.on('click', (function(_this) {
        return function() {
          if (_this.$a_loadurl.hasClass('disabled')) {
            return;
          }
          return _this.loadurl();
        };
      })(this));
      this.$el.delegate('a.additem', 'click', (function(_this) {
        return function() {
          var $input;
          $input = _this.$el.find('.item-inputs .ipt').last().clone().val('');
          _this.$el.find('.item-inputs').append($input.hide().fadeIn(200));
          return _this.refresh_item_ipts();
        };
      })(this));
      that = this;
      return this.$el.delegate('.ipt a.delete', 'click', function() {
        if (jQuery(this).hasClass('disabled')) {
          return;
        }
        jQuery(this).closest('.ipt').remove();
        return that.refresh_item_ipts();
      });
    };

    TopicForm.prototype.refresh_item_ipts = function() {
      this.$el.find('.item-inputs input').each(function(idx, i) {
        return jQuery(this).attr('placeholder', "选项 " + (idx + 1));
      });
      if (this.$el.find('.item-inputs input').length < 3) {
        return this.$el.find('.item-inputs .ipt a.delete').addClass('disabled');
      } else {
        return this.$el.find('.item-inputs .ipt a.delete').removeClass('disabled');
      }
    };

    TopicForm.prototype.loadurl = function() {
      this.$a_loadurl.hide();
      this.$loading.show();
      this.$el.find('a.next.skip').addClass('disabled');
      return this.$loading.find('.p').css({
        'width': 0
      }).animate({
        'width': '100%'
      }, 5000, (function(_this) {
        return function() {
          _this.$infocard.show(200);
          _this.$loading.hide();
          _this.$loadsuccess.show();
          _this.$el.find('a.next.skip').hide();
          return _this.$el.find('a.next.urldone').show();
        };
      })(this));
    };

    TopicForm.prototype.to_next = function() {
      var $current_link, $current_part, $to_link, $to_part, to_step;
      to_step = this.current_step + 1;
      $current_link = this.$el.find(".steps .step[data-step=" + this.current_step + "]");
      $to_link = this.$el.find(".steps .step[data-step=" + to_step + "]");
      if ($to_link.length > 0) {
        $current_part = this.$el.find(".part[data-step=" + this.current_step + "]");
        $to_part = this.$el.find(".part[data-step=" + to_step + "]");
        $current_part.fadeOut(200);
        $to_part.fadeIn(200);
        $current_link.removeClass('active').addClass('done');
        $to_link.addClass('active');
        return this.current_step = to_step;
      }
    };

    TopicForm.prototype.to_prev = function() {
      var $current_link, $current_part, $to_link, $to_part, to_step;
      to_step = this.current_step - 1;
      $current_link = this.$el.find(".steps .step[data-step=" + this.current_step + "]");
      $to_link = this.$el.find(".steps .step[data-step=" + to_step + "]");
      if ($to_link.length > 0) {
        $current_part = this.$el.find(".part[data-step=" + this.current_step + "]");
        $to_part = this.$el.find(".part[data-step=" + to_step + "]");
        $current_part.fadeOut(200);
        $to_part.fadeIn(200);
        $current_link.removeClass('active');
        $to_link.addClass('active').removeClass('done');
        return this.current_step = to_step;
      }
    };

    return TopicForm;

  })();

  jQuery(document).on('ready page:load', function() {
    return new TopicForm(jQuery('.page-new-topic'));
  });

}).call(this);

//# sourceMappingURL=../maps/ui.js.map