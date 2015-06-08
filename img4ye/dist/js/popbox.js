(function() {
  var PopBox;

  window.PopBox = PopBox = (function() {
    function PopBox($template) {
      this.$template = $template;
    }

    PopBox.prototype.show = function(func) {
      this.$overlay = jQuery('<div>').addClass('popbox popbox-overlay').fadeIn(300).appendTo(jQuery(document.body));
      this.$overlay.on('click', (function(_this) {
        return function(evt) {
          if (jQuery(evt.target).hasClass('popbox-overlay')) {
            return _this.close();
          }
        };
      })(this));
      this.$overlay.on('click', '.popbox a.popbox.action.close', (function(_this) {
        return function(evt) {
          return _this.close();
        };
      })(this));
      this.$box = jQuery('<div>').addClass('popbox box').css({
        'top': '0'
      }).animate({
        'top': '180px'
      }, 200).appendTo(this.$overlay);
      this.$inner = this.$template.clone().show().appendTo(this.$box);
      return func();
    };

    PopBox.prototype.close = function() {
      this.$box.animate({
        'top': '0'
      }, 200);
      return this.$overlay.fadeOut(300, (function(_this) {
        return function() {
          return _this.$overlay.remove();
        };
      })(this));
    };

    PopBox.prototype.bind_ok = function(func) {
      return this.$overlay.on('click', '.popbox a.popbox.action.ok', func);
    };

    return PopBox;

  })();

}).call(this);

//# sourceMappingURL=../maps/popbox.js.map