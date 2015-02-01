// Generated by CoffeeScript 1.8.0
(function() {
  var MathForm;

  MathForm = (function() {
    function MathForm($, formPlugin, loadDomain, loadPath, loaded) {
      this.$ = $;
      this.formPlugin = formPlugin != null ? formPlugin : "mathquill";
      this.loadDomain = loadDomain != null ? loadDomain : "cdn.";
      this.loadPath = loadPath != null ? loadPath : "master";
      this.loaded = loaded != null ? loaded : false;
    }

    MathForm.prototype.render = function(formPlugin) {
      this.formPlugin = formPlugin;
      return this;
    };

    MathForm.prototype.subdomain = function(loadDomain) {
      this.loadDomain = loadDomain;
      return this;
    };

    MathForm.prototype.path = function(loadPath) {
      this.loadPath = loadPath;
      return this;
    };

    MathForm.prototype.load = function(cb) {
      var css, temp, tempjQuery;
      if (this.loaded) {
        if (cb) {
          cb(this);
        }
      }
      if (this.formPlugin === "mathQuill") {
        css = "https://" + this.loadDomain + "rawgit.com/CodeLenny/MathForm/" + this.loadPath + "/lib/mathquill.css";
        this.$("head").append(this.$("<link rel='stylesheet' type='text/css' href='" + css + "'>"));
        temp = window.$;
        tempjQuery = window.jQuery;
        window.$ = this.$;
        window.jQuery = this.$;
        return this.$.getScript("https://" + this.loadDomain + "rawgit.com/CodeLenny/MathForm/" + this.loadPath + "/lib/mathquill.min.js").done((function(_this) {
          return function() {
            _this.loaded = true;
            if (cb) {
              return cb(_this);
            }
          };
        })(this));
      } else if (this.formPlugin === "mathdox") {
        return this.$.loadScript("http://mathdox.org/formulaeditor/main.js").done((function(_this) {
          return function() {
            _this.loaded = true;
            if (cb) {
              return cb(_this);
            }
          };
        })(this));
      }
    };

    MathForm.prototype.google = function(labelText) {
      return this.load((function(_this) {
        return function() {
          return _this.$(".ss-q-title").each(function(index, el) {
            var form, textbox;
            if (_this.$(el).text().indexOf(labelText) > -1) {
              textbox = _this.$('#' + _this.$(el).parent("label.ss-q-item-label").attr("for"));
              form = _this.mathify(textbox);
              return textbox.before(form);
            }
          });
        };
      })(this));
    };

    MathForm.prototype.mathify = function(textbox) {
      var form, math, save;
      form = this.$("<div>");
      if (this.formPlugin === "mathQuill") {
        math = this.$("<span>").mathquill("editable");
        save = this.$("<button>").text("Save").click((function(_this) {
          return function() {
            return textbox.val(math.mathquill().mathquill('latex'));
          };
        })(this));
        form.append(math).append(save);
      } else if (this.formPlugin === "mathdox") {
        alert("Unsupported Plugin.  This is an error in the link used to activate the math library.");
      }
      return form;
    };

    return MathForm;

  })();

  window.MathForm = MathForm;

}).call(this);
