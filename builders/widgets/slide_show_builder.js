'use strict';

var fs = require("fs");

var WidgetBuilder = require("./widget_builder");
var _ = require("underscore");

function SlideShowBuilder(context) {
    WidgetBuilder.call(this, context);
    this.htmlTemplate = _.template(fs.readFileSync(context.templates + "/slide_show.html", "utf-8"));
    this.imageCssTemplate = _.template(fs.readFileSync(context.templates + "/styles/slide_show.css.tmpl", "utf-8"));
}

SlideShowBuilder.prototype = Object.create(WidgetBuilder.prototype);
SlideShowBuilder.prototype.constructor = SlideShowBuilder;

SlideShowBuilder.prototype.generateCss = function (widget) {
    return this.imageCssTemplate({widget: widget});
};

SlideShowBuilder.prototype.generateHtml = function (widget) {
    return this.htmlTemplate(widget);
};

module.exports = SlideShowBuilder;

