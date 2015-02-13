// Generated by CoffeeScript 1.8.0
(function() {
  var MathForm,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  MathForm = (function() {
    function MathForm($, formPlugin, loadDomain, loadPath, loaded, developerMode) {
      this.$ = $;
      this.formPlugin = formPlugin != null ? formPlugin : "mathquill";
      this.loadDomain = loadDomain != null ? loadDomain : "cdn.";
      this.loadPath = loadPath != null ? loadPath : "master";
      this.loaded = loaded != null ? loaded : false;
      this.developerMode = developerMode != null ? developerMode : false;
      this.googleEditorDropdownClick = __bind(this.googleEditorDropdownClick, this);
      this.googleEditorCreateEmbeddedMath = __bind(this.googleEditorCreateEmbeddedMath, this);
      this.googleEditorCreateMath = __bind(this.googleEditorCreateMath, this);
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

    MathForm.prototype.devel = function() {
      this.developerMode = true;
      return this;
    };

    MathForm.prototype.load = function(cb) {
      var css, ext, temp, tempjQuery;
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
        ext = this.developerMode ? ".js" : ".min.js";
        return this.$.getScript("https://" + this.loadDomain + "rawgit.com/CodeLenny/MathForm/" + this.loadPath + ("/lib/mathquill" + ext)).done((function(_this) {
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
          var version;
          if (window.location.pathname.indexof("viewform") > -1) {
            _this.$(".ss-q-title").each(function(index, el) {
              var form, textbox;
              if (_this.$(el).text().indexOf(labelText) > -1) {
                textbox = _this.$('#' + _this.$(el).parent("label.ss-q-item-label").attr("for"));
                form = _this.mathify(textbox);
                return textbox.before(form);
              }
            });
            version = _this.developerMode || _this.loadDomain === "" ? "Developer Version.  Please use a standard version for production!" : "Version " + _this.loadPath + ".";
            _this.$(".ss-form-desc").after($("<b>").text("MathForm loaded, using " + _this.formPlugin + " as the render engine.\nMathForm " + version));
          }
          return _this.googleEditor(labelText);
        };
      })(this));
    };

    MathForm.prototype.googleEditor = function(labelText) {
      return this.$("body").on("click", ".goog-inline-block.goog-flat-menu-button-caption", this.googleDropdownClick);
    };

    MathForm.prototype.googleEditorItem = function(id, name, cb) {
      var item, text;
      item = this.$("<div />").addClass("goog-menuitem").attr({
        role: "menuitem",
        style: "-webkit-user-select: none;",
        id: ":r" + id
      });
      text = this.$("<div />").addClass("goog-menuitem-content").attr(style, "-webkit-user-select: none;").text(name);
      click(cb).appendTo(item);
      return item;
    };

    MathForm.prototype.googleEditorCreateMath = function() {
      var name;
      name = this.$(".ss-formwidget-container-editor #:fk.fw_tf");
      if (!name.val().indexOf(labelText) > -1) {
        return name.val(labelText + " " + name.val());
      }
    };

    MathForm.prototype.googleEditorCreateEmbeddedMath = function() {
      var name;
      name = this.$(".ss-formwidget-container-editor #:fk.fw_tf");
      if (!name.val().indexOf("[MathSentance]") > -1) {
        return name.val("[MathSentance] " + name.val());
      }
    };

    MathForm.prototype.googleEditorDropdownClick = function() {
      var embedMath, math, menu;
      this.$(".goog-menu.goog-menu-vertical[aria-haspopup='true'] [id^=':r']").remove();
      menu = this.$(".goog-menu.goog-menu-vertical[aria-haspopup='true']");
      math = this.googleEditorItem("1", "Math", this.googleEditorCreateMath);
      embedMath = this.googleEditorItem("2", "Math Enabled Text", this.googleEditorCreateEmbededMath);
      return menu.append(math).append(embedMath);
    };

    MathForm.prototype.checkVersion = function() {
      var check;
      check = this.$(".mathFormVersionCheck");
      if (check.length < 0) {
        return;
      }
      if (check.text() === this.loadPath) {
        return this.$(".mathFormVersionCheckResults").removeClass("bg-info").addClass("bg-success").text("Congrats! You are running the latest version of MathForm.");
      } else {
        return this.$(".mathFormVersionCheckResults").removeClass("bg-info").addClass("bg-danger").text("Warning: You are running an outdated version of MathForm.\nPlease replace your bookmarklet.");
      }
    };

    MathForm.prototype.mathify = function(textbox) {
      var form, math, save;
      form = this.$("<div>");
      if (this.formPlugin === "mathQuill") {
        math = this.$("<span>").mathquill("editable");
        math.mathquill('latex', textbox.val());
        save = this.$("<button>").text("Save").click((function(_this) {
          return function(e) {
            e.preventDefault();
            textbox.val(math.mathquill('latex'));
            return false;
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