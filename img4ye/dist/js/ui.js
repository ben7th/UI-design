
/*
  图片加载类
 */

(function() {
  var Image, ImageGrid, ImageSelector;

  Image = (function() {
    function Image($el) {
      this.$el = $el;
      this.ave = this.$el.data('ave');
      this.width = this.$el.data('width');
      this.height = this.$el.data('height');
      this.url = this.$el.data('url');
      this.$el.css({
        'position': 'absolute'
      });
      this.$ibox = jQuery('<div>').addClass('ibox').css({
        'background-color': this.ave,
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'right': 0,
        'bottom': 0
      }).appendTo(this.$el);
    }

    Image.prototype.get_png_url = function(width, height) {
      return this.url + "@" + width + "w_" + height + "h_1e_1c.png";
    };

    Image.prototype.pos = function(left, top, width, height) {
      return this.$el.css({
        'left': this.layout_left = left,
        'top': this.layout_top = top,
        'width': this.layout_width = width,
        'height': this.layout_height = height
      });
    };

    Image.prototype.lazy_load = function() {
      if (!this.$el.is_in_screen()) {
        return;
      }
      return this.load();
    };

    Image.prototype.load = function() {
      var h, img, w;
      if (this.loaded) {
        return;
      }
      this.loaded = true;
      if (!((this.layout_width != null) && (this.layout_height != null))) {
        return;
      }
      w = Math.round(this.layout_width);
      h = Math.round(this.layout_height);
      return img = jQuery("<img>").attr('src', this.get_png_url(w, h)).attr('draggable', false).css({
        'opacity': 0,
        'width': '100%',
        'height': '100%'
      }).on('load', (function(_this) {
        return function() {
          return img.animate({
            'opacity': 1
          }, 400, function() {
            return _this.$ibox.css('background', 'none');
          });
        };
      })(this)).appendTo(this.$ibox);
    };

    Image.prototype.remove = function() {
      return this.$el.remove();
    };

    return Image;

  })();


  /*
  用途：
    图像网格，支持以多种布局来显示图像
    同时支持滚动加载更多图片
  用法：
    haml:
      .grid
        .images
          .image{:data => {:url => '', :width => '', :height => '', :ave => ''}}
          .image{:data => {:url => '', :width => '', :height => '', :ave => ''}}
          .image{:data => {:url => '', :width => '', :height => '', :ave => ''}}
  
    coffee:
      ig = new ImageGrid jQuery('.images'), {
        layout: GridLayout
        viewport: jQuery('.grid')
      }
      ig.relayout()
   */

  ImageGrid = (function() {
    function ImageGrid($el, config) {
      var dom, i, len1, ref;
      this.$el = $el;
      if (config == null) {
        config = {};
      }
      this.$viewport = config.viewport || jQuery(document);
      this.layout = new (config.layout || GridLayout)(this);
      this.$el.css({
        'position': 'relative'
      });
      this.image_hash = {};
      ref = this.$el.find('.image');
      for (i = 0, len1 = ref.length; i < len1; i++) {
        dom = ref[i];
        this.add_image(jQuery(dom));
      }
      this.load_more_url = this.$el.data('load-more-url');
      this.bind_events();
    }

    ImageGrid.prototype.bind_events = function() {
      this.$viewport.on('scroll', (function(_this) {
        return function(evt) {
          _this.lazy_load_images();
          if (_this.layout.need_load_more()) {
            return _this.load_more();
          }
        };
      })(this));
      return this.$viewport.on('mindpin', function() {
        return alert(1);
      });
    };

    ImageGrid.prototype.add_image = function($image) {
      var img;
      img = new Image($image);
      jQuery('<div>').addClass('icheck').appendTo(img.$el);
      return this.image_hash[$image.data('id')] = img;
    };

    ImageGrid.prototype.remove_img_ids = function(ids) {
      var i, id, img, len1;
      for (i = 0, len1 = ids.length; i < len1; i++) {
        id = ids[i];
        img = this.image_hash[id];
        img.remove();
        delete this.image_hash[id];
      }
      return this.relayout(true);
    };

    ImageGrid.prototype.each_image = function(func) {
      var id, idx, img, ref, results;
      idx = 0;
      ref = this.image_hash;
      results = [];
      for (id in ref) {
        img = ref[id];
        func(idx, img);
        results.push(idx++);
      }
      return results;
    };

    ImageGrid.prototype.relayout = function(force) {
      if (force == null) {
        force = false;
      }
      this.layout.relayout(force);
      return setTimeout(function() {
        return jQuery('.nano').nanoScroller({
          alwaysVisible: true
        });
      });
    };

    ImageGrid.prototype.lazy_load_images = function() {
      var id, image, ref, results;
      ref = this.image_hash;
      results = [];
      for (id in ref) {
        image = ref[id];
        results.push(image.lazy_load());
      }
      return results;
    };

    ImageGrid.prototype.get_width = function() {
      return this.$el.width();
    };

    ImageGrid.prototype.load_more = function() {
      var curr_page, next_page;
      if (this.$el.hasClass('end') || this.$el.hasClass('loading')) {
        return;
      }
      this.$el.addClass('loading');
      curr_page = this.$el.data('page') || 1;
      next_page = curr_page + 1;
      return jQuery.get(this.load_more_url, {
        page: next_page
      }).done((function(_this) {
        return function(res) {
          var $images;
          $images = jQuery(res).find('.grid .images .image');
          if ($images.length) {
            $images.each(function(idx, el) {
              var $image, id;
              $image = jQuery(el);
              id = $image.data('id');
              $image.data('id', "" + id + curr_page);
              _this.$el.append($image);
              return _this.add_image($image);
            });
            _this.relayout();
            _this.$el.removeClass('loading');
            return _this.$el.data('page', next_page);
          } else {
            _this.$el.removeClass('loading');
            return _this.$el.addClass('end');
          }
        };
      })(this));
    };

    return ImageGrid;

  })();

  ImageSelector = (function() {
    function ImageSelector($el) {
      this.$el = $el;
      this.bind_events();
    }

    ImageSelector.prototype.bind_events = function() {
      var that;
      that = this;
      this.$el.on('click', '.image .icheck', function() {
        jQuery(this).toggleClass('selected');
        return that.refresh_selected();
      });
      return jQuery('.checkstatus a.check').on('click', function() {
        var $checkstatus;
        $checkstatus = jQuery(this).closest('.checkstatus');
        if ($checkstatus.hasClass('none') || $checkstatus.hasClass('some')) {
          that.$el.find('.image .icheck').addClass('selected');
          that.refresh_selected();
          return;
        }
        if ($checkstatus.hasClass('all')) {
          that.$el.find('.image .icheck').removeClass('selected');
          that.refresh_selected();
        }
      });
    };

    ImageSelector.prototype.refresh_selected = function() {
      var all_length, length;
      length = this.$el.find('.image .icheck.selected').length;
      all_length = this.$el.find('.image .icheck').length;
      jQuery('.opbar .checkstatus span.n').text(length);
      jQuery('.opbar .checkstatus').removeClass('none some all');
      if (length === 0) {
        jQuery('.opbar .checkstatus').addClass('none');
      } else if (length < all_length) {
        jQuery('.opbar .checkstatus').addClass('some');
      } else {
        jQuery('.opbar .checkstatus').addClass('all');
      }
      if (length > 0) {
        return jQuery('.opbar .btns .bttn').removeClass('disabled');
      } else {
        return jQuery('.opbar .btns .bttn').addClass('disabled');
      }
    };

    ImageSelector.prototype.get_selected = function() {
      return this.$el.find('.image .icheck.selected').closest('.image');
    };

    return ImageSelector;

  })();

  jQuery(document).on('ready page:load', function() {
    var igird, ise, popbox_delete, popbox_download;
    if (jQuery('.grid .images').length) {
      igird = new ImageGrid(jQuery('.grid .images'), {
        layout: GridLayout,
        viewport: jQuery('.grid .nano-content')
      });
      igird.relayout();
      jQuery(window).off('resize').on('resize', function() {
        return igird.relayout();
      });
      ise = new ImageSelector(jQuery('.grid .images'));
      popbox_delete = new PopBox(jQuery('.popbox.template.delete'));
      jQuery('.opbar a.bttn.delete').on('click', function() {
        return popbox_delete.show(function() {
          var len;
          len = ise.get_selected().length;
          popbox_delete.$inner.find('span.n').text(len);
          return popbox_delete.bind_ok(function() {
            var ids, image;
            ids = (function() {
              var i, len1, ref, results;
              ref = ise.get_selected();
              results = [];
              for (i = 0, len1 = ref.length; i < len1; i++) {
                image = ref[i];
                results.push(jQuery(image).data('id'));
              }
              return results;
            })();
            console.log(ids);
            return jQuery.ajax({
              url: '/',
              data: {
                ids: ids
              },
              success: function(res) {
                igird.remove_img_ids(ids);
                popbox_delete.close();
                return ise.refresh_selected();
              }
            });
          });
        });
      });
      popbox_download = new PopBox(jQuery('.popbox.template.download'));
      return jQuery('.opbar a.bttn.download').on('click', function() {
        return popbox_download.show(function() {
          var len;
          len = ise.get_selected().length;
          popbox_download.$inner.find('span.n').text(len);
          return popbox_download.bind_ok(function() {
            var ids, image;
            ids = (function() {
              var i, len1, ref, results;
              ref = ise.get_selected();
              results = [];
              for (i = 0, len1 = ref.length; i < len1; i++) {
                image = ref[i];
                results.push(jQuery(image).data('id'));
              }
              return results;
            })();
            console.log(ids);
            return alert('下载');
          });
        });
      });
    }
  });

  jQuery(document).on('click', 'a.btn-upload', function() {
    var $panel;
    $panel = jQuery('.upload-panel');
    return $panel.addClass('opened');
  });

  jQuery(document).on('click', 'a.close-panel', function() {
    var $panel;
    $panel = jQuery('.upload-panel');
    return $panel.removeClass('opened');
  });

}).call(this);

//# sourceMappingURL=../maps/ui.js.map