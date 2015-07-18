'use strict';

var fs = require("fs");

var WidgetBuilder = require("./widget_builder");
var _ = require("underscore");

function TextBuilder(context) {
    WidgetBuilder.call(this, context);
    this.htmlTemplate = _.template('<div id="<%=id%>" class="nyx-widget nyx-text <%=hasAnimation ? \'animated\' : \'\'%>"><%=value%></div>');
    this.textCssTemplate = _.template(fs.readFileSync(context.templates + "/styles/text.css.tmpl", "utf-8"));
}

TextBuilder.prototype = Object.create(WidgetBuilder.prototype);
TextBuilder.prototype.constructor = TextBuilder;

TextBuilder.prototype.generateCss = function (widget) {
    var css = WidgetBuilder.prototype.generateCss.call(this, widget);
    return css + "\n" + this.textCssTemplate({widget: widget});
};

TextBuilder.prototype.generateHtml = function (widget) {
	widget.value = widget.value.replace(/\n/g, '<br />');
    return this.htmlTemplate(widget);
};

module.exports = TextBuilder;

