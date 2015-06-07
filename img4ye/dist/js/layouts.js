(function() {
  var FlowLayout, GridLayout, HorizontalGridLayout;

  window.HorizontalGridLayout = HorizontalGridLayout = (function() {
    function HorizontalGridLayout(host) {
      this.host = host;
      this.GRIDS = 6;
      this.GRID_PADDING = 4;
      this.bind_events();
    }

    HorizontalGridLayout.prototype.go = function() {
      var max_left, max_top, screen_height, screen_width, side_length, that;
      screen_height = jQuery(document).height();
      screen_width = jQuery(document).width();
      side_length = (screen_height - this.GRID_PADDING * (this.GRIDS + 1)) / this.GRIDS;
      that = this;
      max_left = 0;
      max_top = 0;
      this.host.each_image(function(idx, image) {
        var left, top, x, y;
        x = ~~(idx / that.GRIDS);
        y = idx % that.GRIDS;
        left = that.GRID_PADDING + x * (side_length + that.GRID_PADDING);
        top = that.GRID_PADDING + y * (side_length + that.GRID_PADDING);
        image.x = x;
        image.y = y;
        max_left = 0;
        max_top = 0;
        image.pos(left, top, side_length, side_length);
        max_left = Math.max(max_left, image.layout_left);
        max_top = Math.max(max_top, image.layout_top);
        if (image.is_in_screen()) {
          return image.load();
        }
      });
      return this.host.$container.css({
        'height': '100%',
        'width': max_left + side_length
      });
    };

    HorizontalGridLayout.prototype.bind_events = function() {
      return this.host.$el.on('mousewheel', (function(_this) {
        return function(evt) {
          var left, move;
          move = 100;
          left = parseInt(_this.host.$container.css('left'));
          if (evt.deltaY < 0) {
            left -= move;
          }
          if (evt.deltaY > 0) {
            left += move;
          }
          if (left > 0) {
            left = 0;
          }
          _this.host.$container.css({
            'left': left
          });
          return _this.host.lazy_load_images();
        };
      })(this));
    };

    return HorizontalGridLayout;

  })();

  window.FlowLayout = FlowLayout = (function() {
    FlowLayout.prototype.GRID_SPACING = 15;

    function FlowLayout(host) {
      this.host = host;
    }

    FlowLayout.prototype.render = function() {
      return setTimeout((function(_this) {
        return function() {
          var cols, columns_count, container_width, grid_data, max_height, side_length;
          container_width = _this.host.get_width();
          columns_count = ~~(container_width / 180);
          grid_data = Util.spacing_grid_data(container_width, columns_count, _this.GRID_SPACING);
          side_length = grid_data.side_length;
          cols = Util.array_init(columns_count, function() {
            return {
              height: _this.GRID_SPACING
            };
          });
          _this.host.each_image(function(idx, image) {
            var height, heights, left, top, x;
            heights = cols.map(function(col) {
              return col.height;
            });
            top = Util.array_min(heights);
            x = heights.indexOf(top);
            left = grid_data.positions[x];
            height = side_length * image.height / image.width;
            cols[x].height += height + _this.GRID_SPACING;
            image.pos(left, top, side_length, height);
            return image.lazy_load();
          });
          max_height = Util.array_max(cols.map(function(col) {
            return col.height;
          }));
          return _this.host.$el.css('height', max_height + _this.BOTTOM_MARGIN);
        };
      })(this));
    };

    FlowLayout.prototype.need_load_more = function() {
      return this.host.$el.offset_of_window().bottom > -this.BOTTOM_MARGIN;
    };

    return FlowLayout;

  })();

  window.GridLayout = GridLayout = (function() {
    GridLayout.prototype.GRID_SPACING = 15;

    GridLayout.prototype.BOTTOM_MARGIN = 80;

    function GridLayout(host) {
      this.host = host;
    }

    GridLayout.prototype.render = function() {
      var cols, columns_count, container_width, grid_data, max_height, side_length;
      container_width = this.host.get_width();
      columns_count = ~~(container_width / 200);
      grid_data = Util.spacing_grid_data(container_width, columns_count, this.GRID_SPACING);
      side_length = grid_data.side_length;
      cols = Util.array_init(columns_count, (function(_this) {
        return function() {
          return {
            height: _this.GRID_SPACING
          };
        };
      })(this));
      this.host.each_image((function(_this) {
        return function(idx, image) {
          var heights, left, top, x;
          heights = cols.map(function(col) {
            return col.height;
          });
          top = Util.array_min(heights);
          x = heights.indexOf(top);
          left = grid_data.positions[x];
          cols[x].height += side_length + _this.GRID_SPACING;
          image.pos(left, top, side_length, side_length);
          return setTimeout(function() {
            return image.lazy_load();
          }, 100);
        };
      })(this));
      max_height = Util.array_max(cols.map(function(col) {
        return col.height;
      }));
      return this.host.$el.css('height', max_height + this.BOTTOM_MARGIN);
    };

    GridLayout.prototype.need_load_more = function() {
      return this.host.$el.offset_of_window().bottom > -this.BOTTOM_MARGIN;
    };

    return GridLayout;

  })();

}).call(this);

//# sourceMappingURL=../maps/layouts.js.map