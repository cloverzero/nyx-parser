 'use strict';

 var fs = require("fs");
 var _ = require("underscore");

 function WidgetBuilder(context) {
     var cssTemplateString = fs.readFileSync(context.templates + "/styles/widget.css.tmpl", "utf-8");
     this.cssTemplete = _.template(cssTemplateString);
 }

 WidgetBuilder.prototype = {
     build: function (widget) {
         return {
             css: this.generateCss(widget),
             html: this.generateHtml(widget)
         }
     },

     generateCss: function (widget) {
         return this.cssTemplete({widget: widget});
     }
 };

 module.exports = WidgetBuilder;