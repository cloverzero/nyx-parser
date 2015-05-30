'use strict';
var fs = require("fs");
var _ = require("underscore");

var ImageBuilder = require("./widgets/image_builder");
var TextBuilder = require("./widgets/text_builder");
var SlideShowBuilder = require("./widgets/slide_show_builder");
var ScrawlBuilder = require("./widgets/scrawl_builder");

function PageBuilder(context) {
    var cssTemplateString = fs.readFileSync(context.templates + "/styles/page.css.tmpl", "utf-8");
    this.cssTemplete = _.template(cssTemplateString);
    this.htmlTemplate = _.template('<div id="<%=id%>" class="nyx-page nyx-page-<%=index%> animated"><%=widgets%></div>');

    this.widgetBuilders = {
        image: new ImageBuilder(context),
        text: new TextBuilder(context),
        slideShow: new SlideShowBuilder(context),
        scrawl: new ScrawlBuilder(context)
    }
}

PageBuilder.prototype = {
    build: function (page, index) {
        var pageMap = _.extend({}, page);
        pageMap.index = index;
        var css = [];
        css.push(this.generateCss(pageMap));

        var widgets = [];
        if (page.widgets) {
            for (let widget of page.widgets) {
                var builder = this.getWidgetBuilder(widget.type);
                var result = builder.build(widget);
                css.push(result.css);
                widgets.push(result.html);
            }
        }

        pageMap.widgets = widgets.join("");
        return {
            css: css.join("\n"),
            html: this.generateHtml(pageMap)
        }
    },

    generateCss: function (page) {
        return this.cssTemplete({page: page})
    },

    generateHtml: function (page) {
        return this.htmlTemplate(page);
    },

    getWidgetBuilder: function (buiderName) {
        var builder = this.widgetBuilders[buiderName];
        if (builder) {
            return builder;
        } else {
            throw new Error('Not found builder: ' + buiderName);
        }
    }
};

module.exports = PageBuilder;

