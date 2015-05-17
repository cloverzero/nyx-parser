'use strict';

var fs = require("fs");
var _ = require("underscore");

var PageBuilder = require("./page_builder");

function FrameBuilder(context) {
    this.pageBuilder = new PageBuilder(context);
    var frameString = fs.readFileSync(context.templates + "/frame.html", "utf-8");
    this.template = _.template(frameString);
}

FrameBuilder.prototype = {
    build: function (config) {
        var self = this;
        var styles = [];
        var pages = [];

        styles.push("body { background-color: " + (config.backgroundColor || "black") + "; }");

        config.pages.forEach(function (page, index) {
            var result = self.pageBuilder.build(page, index);
            styles.push(result.css);
            pages.push(result.html);
        });
        return this.template({
            title: config.title,
            styles: styles.join("\n"),
            pages: pages.join("\n")
        });
    }
};

module.exports = FrameBuilder;