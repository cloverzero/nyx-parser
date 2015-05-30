'use strict';

var fs = require("fs");

var WidgetBuilder = require("./widget_builder");
var _ = require("underscore");

function ScrawlBuilder(context) {
    WidgetBuilder.call(this, context);
    this.htmlTemplate = _.template('<div id="<%=id%>" class="nyx-scrawl"><canvas></canvas></div>');
    this.textCssTemplate = _.template(fs.readFileSync(context.templates + "/styles/scrawl.css.tmpl", "utf-8"));
}

ScrawlBuilder.prototype = Object.create(WidgetBuilder.prototype);
ScrawlBuilder.prototype.constructor = ScrawlBuilder;

ScrawlBuilder.prototype.generateCss = function (widget) {
    //var css = WidgetBuilder.prototype.generateCss.call(this, widget);
    return this.textCssTemplate({widget: widget});
};

ScrawlBuilder.prototype.generateHtml = function (widget) {
    return this.htmlTemplate(widget);
};

module.exports = ScrawlBuilder;

