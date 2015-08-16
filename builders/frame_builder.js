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

        var frameStyle = "body { ";
        if (config.backgroundImage) {
            frameStyle += 'background: url(' + config.backgroundImage + ') center center no-repeat;'
        }
        frameStyle += "background-color: " + (config.backgroundColor || "white") + ";";
        frameStyle += " }";
        styles.push(frameStyle);

        config.pages.forEach(function (page, index) {
            var result = self.pageBuilder.build(page, index);
            styles.push(result.css);
            pages.push(result.html);
        });

        return this.template({
            id: config.id,
            title: config.title,
            audio: config.audio,
            wxEmbed: config.wxEmbed,
            preview: config.preview,
            styles: styles.join("\n"),
            pages: pages.join("\n")
        });
    }
};

module.exports = FrameBuilder;