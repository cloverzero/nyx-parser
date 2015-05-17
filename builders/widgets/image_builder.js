'use strict';

var fs = require("fs");

var WidgetBuilder = require("./widget_builder");
var _ = require("underscore");

function ImageBuilder(context) {
    WidgetBuilder.call(this, context);
    this.htmlTemplate = _.template('<div id="<%=id%>" class="nyx-widget <%=hasAnimation ? \'animated\' : \'\'%>"></div>');
    this.imageCssTemplate = _.template(fs.readFileSync(context.templates + "/styles/image.css.tmpl", "utf-8"));
}

ImageBuilder.prototype = Object.create(WidgetBuilder.prototype);
ImageBuilder.prototype.constructor = ImageBuilder;

ImageBuilder.prototype.generateCss = function (widget) {
    var css = WidgetBuilder.prototype.generateCss.call(this, widget);
    return css + "\n" + this.imageCssTemplate({widget: widget});
};

ImageBuilder.prototype.generateHtml = function (widget) {
    return this.htmlTemplate(widget);
};

module.exports = ImageBuilder;

