(function() {
  var SearchPage, TopicForm, is_field_empty;

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

  jQuery(document).on('click', '.page-landing .filter a.item', function() {
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

  jQuery(document).on('click', '.topic-options .option', function() {
    return jQuery(this).toggleClass('active');
  });

  jQuery(document).on('click', '.footer-nav .item.new', function() {
    jQuery('.footer-nav').addClass('new-topic-type-select');
    return jQuery('.float-new-type-select').addClass('show');
  });

  jQuery(document).on('click', '.footer-nav a.cancel-new', function() {
    jQuery('.footer-nav').removeClass('new-topic-type-select');
    return jQuery('.float-new-type-select').removeClass('show');
  });

  is_field_empty = function($field) {
    return jQuery.trim($field.val()).length === 0;
  };

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
      this.$tdesc_textarea = this.$el.find('textarea.tdesc');
      this.bind_events();
    }

    TopicForm.prototype.bind_events = function() {
      var that;
      this.$el.on('click', 'a.next:not(.disabled)', (function(_this) {
        return function() {
          return _this.to_next();
        };
      })(this));
      this.$el.on('click', 'a.prev:not(.disabled)', (function(_this) {
        return function() {
          return _this.to_prev();
        };
      })(this));
      this.$el.on('click', 'a.done.disabled', function(evt) {
        return evt.preventDefault();
      });
      that = this;
      this.$el.on('click', 'a.additem', (function(_this) {
        return function() {
          var $ipt;
          $ipt = _this.$el.find('.item-inputs .ipt').last().clone();
          $ipt.find('input').val('');
          $ipt.hide().fadeIn(200);
          _this.$el.find('.item-inputs').append($ipt);
          return _this.refresh_item_ipts();
        };
      })(this));
      this.$el.on('click', '.ipt a.delete:not(.disabled)', function() {
        jQuery(this).closest('.ipt').remove();
        return that.refresh_item_ipts();
      });
      this.$el.find('.item-inputs').on('input', (function(_this) {
        return function() {
          return _this.refresh_item_ipts();
        };
      })(this));
      this.$url_textarea.on('input', (function(_this) {
        return function() {
          if (is_field_empty(_this.$url_textarea)) {
            return _this.$a_loadurl.addClass('disabled');
          } else {
            return _this.$a_loadurl.removeClass('disabled');
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
      this.$el.on('click', 'a.next.urldone:not(.disabled)', (function(_this) {
        return function() {
          return _this.$el.find('.part.tdesc').find('.infocard').remove().end().prepend(_this.$infocard.clone());
        };
      })(this));
      return this.$tdesc_textarea.on('input', (function(_this) {
        return function() {
          var $a_next;
          $a_next = _this.$tdesc_textarea.closest('.part').find('a.next');
          if (is_field_empty(_this.$tdesc_textarea)) {
            return $a_next.addClass('disabled');
          } else {
            return $a_next.removeClass('disabled');
          }
        };
      })(this));
    };

    TopicForm.prototype.refresh_item_ipts = function() {
      var count;
      count = 0;
      this.$el.find('.item-inputs input').each(function(idx, i) {
        jQuery(this).attr('placeholder', "选项 " + (idx + 1));
        if (jQuery.trim(jQuery(this).val()).length > 0) {
          count += 1;
        }
        if (count >= 2) {
          return jQuery(this).closest('.part').find('a.done').removeClass('disabled');
        } else {
          return jQuery(this).closest('.part').find('a.done').addClass('disabled');
        }
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
      }, 3000, (function(_this) {
        return function() {
          _this.$infocard.fadeIn(200);
          _this.$loading.hide();
          _this.$loadsuccess.show();
          _this.$el.find('a.next.skip').hide();
          _this.$el.find('a.next.urldone').show();
          return _this.$url_textarea.attr('disabled', true);
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
    if (jQuery('.page-new-topic').length > 0) {
      return new TopicForm(jQuery('.page-new-topic'));
    }
  });

  SearchPage = (function() {
    function SearchPage($el) {
      this.$el = $el;
      this.$history = this.$el.find('.history');
      this.$result = this.$el.find('.result');
      this.$input = this.$el.find('input[name=q]');
      this.$topbar = this.$el.find('.topbar');
      this.bind_events();
    }

    SearchPage.prototype.bind_events = function() {
      var that;
      that = this;
      this.$el.on('click', '.history .word a.delete', function() {
        return jQuery(this).closest('.word').fadeOut(200, function() {
          return jQuery(this).remove();
        });
      });
      this.$el.on('click', '.history .word a.s', function() {
        var q;
        q = jQuery(this).find('.t').text();
        that.$input.val(q);
        return that.search();
      });
      this.$el.on('click', '.topbar a.cancel', function() {
        return that.cancel();
      });
      this.$input.on('input', (function(_this) {
        return function() {
          return _this.search();
        };
      })(this));
      return this.$el.on('click', '.history a.clear', (function(_this) {
        return function() {
          if (confirm('确定要清除吗？')) {
            return _this.$el.find('.history .word').fadeOut(200, function() {
              return _this.$el.find('.history .word').remove();
            });
          }
        };
      })(this));
    };

    SearchPage.prototype.search = function() {
      this.$topbar.addClass('filled');
      if (!is_field_empty(this.$input)) {
        this.$history.hide();
        return this.$result.fadeIn(200);
      } else {
        this.$history.fadeIn(200);
        return this.$result.hide();
      }
    };

    SearchPage.prototype.cancel = function() {
      this.$history.fadeIn(200);
      this.$result.hide();
      this.$input.val('');
      return this.$topbar.removeClass('filled');
    };

    return SearchPage;

  })();

  jQuery(document).on('ready page:load', function() {
    if (jQuery('.page-search').length > 0) {
      return new SearchPage(jQuery('.page-search'));
    }
  });

}).call(this);

//# sourceMappingURL=../maps/ui.js.map