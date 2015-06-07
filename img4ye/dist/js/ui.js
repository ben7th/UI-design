
/*
  图片加载类
 */

(function() {
  var Image, ImageGrid;

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
      ig.render()
   */

  ImageGrid = (function() {
    function ImageGrid($el, config) {
      var dom, i, len, ref;
      this.$el = $el;
      if (config == null) {
        config = {};
      }
      this.$viewport = config.viewport || jQuery(document);
      this.layout = new (config.layout || GridLayout)(this);
      this.$el.css({
        'position': 'relative'
      });
      this.images = [];
      ref = this.$el.find('.image');
      for (i = 0, len = ref.length; i < len; i++) {
        dom = ref[i];
        this.add_image(jQuery(dom));
      }
      this.load_more_url = this.$el.data('load-more-url');
      this.bind_events();
    }

    ImageGrid.prototype.bind_events = function() {
      return this.$viewport.on('scroll', (function(_this) {
        return function(evt) {
          _this.lazy_load_images();
          if (_this.layout.need_load_more()) {
            return _this.load_more();
          }
        };
      })(this));
    };

    ImageGrid.prototype.add_image = function($image) {
      var img;
      img = new Image($image);
      jQuery('<div>').addClass('icheck').appendTo(img.$el);
      return this.images.push(img);
    };

    ImageGrid.prototype.each_image = function(func) {
      var i, idx, ref, results;
      results = [];
      for (idx = i = 0, ref = this.images.length; 0 <= ref ? i < ref : i > ref; idx = 0 <= ref ? ++i : --i) {
        results.push(func(idx, this.images[idx]));
      }
      return results;
    };

    ImageGrid.prototype.render = function() {
      this.layout.render();
      return setTimeout(function() {
        return jQuery('.nano').nanoScroller({
          alwaysVisible: true
        });
      });
    };

    ImageGrid.prototype.lazy_load_images = function() {
      var i, image, len, ref, results;
      ref = this.images;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        image = ref[i];
        results.push(image.lazy_load());
      }
      return results;
    };

    ImageGrid.prototype.get_width = function() {
      return this.$el.width();
    };

    ImageGrid.prototype.load_more = function() {
      var page;
      if (this.$el.hasClass('end')) {
        return;
      }
      if (this.$el.hasClass('loading')) {
        return;
      }
      this.$el.addClass('loading');
      page = this.$el.data('page') || 1;
      return jQuery.ajax({
        url: this.load_more_url,
        type: 'GET',
        data: {
          page: page + 1
        },
        success: (function(_this) {
          return function(res) {
            var $images;
            $images = jQuery(res).find('.grid .images .image');
            if ($images.length) {
              $images.each(function(idx, el) {
                var $image;
                $image = jQuery(el);
                _this.$el.append($image);
                return _this.add_image($image);
              });
              _this.render();
              _this.$el.removeClass('loading');
              return _this.$el.data('page', page + 1);
            } else {
              _this.$el.removeClass('loading');
              return _this.$el.addClass('end');
            }
          };
        })(this)
      });
    };

    return ImageGrid;

  })();

  jQuery(document).on('ready page:load', function() {
    var ig;
    if (jQuery('.grid .images').length) {
      ig = new ImageGrid(jQuery('.grid .images'), {
        layout: GridLayout,
        viewport: jQuery('.grid .nano-content')
      });
      ig.render();
      return jQuery(window).off('resize').on('resize', function() {
        return ig.render();
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