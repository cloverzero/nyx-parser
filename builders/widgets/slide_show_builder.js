'use strict';

var fs = require("fs");

var WidgetBuilder = require("./widget_builder");
var _ = require("underscore");

function SlideShowBuilder(context) {
    WidgetBuilder.call(this, context);
    this.htmlTemplate = _.template('<div id="<%=id%>" class="nyx-widget <%=hasAnimation ? \'animated\' : \'\'%>"></div>');
    this.imageCssTemplate = _.template(fs.readFileSync(context.templates + "/styles/image.css.tmpl", "utf-8"));
}

SlideShowBuilder.prototype = Object.create(WidgetBuilder.prototype);
SlideShowBuilder.prototype.constructor = SlideShowBuilder;

SlideShowBuilder.prototype.generateCss = function (widget) {
    var css = WidgetBuilder.prototype.generateCss.call(this, widget);
    return css + "\n" + this.imageCssTemplate({widget: widget});
};

SlideShowBuilder.prototype.generateHtml = function (widget) {
    return this.htmlTemplate(widget);
};

module.exports = SlideShowBuilder;

