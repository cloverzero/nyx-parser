'use strict';

var fse = require('fs-extra');
var _ = require('underscore');
var FrameBuilder = require('./builders/frame_builder');

var TEMPLATES_PATH = __dirname + '/templates';
var BASE_PATH = __dirname;


/**
 * Nyx
 * @constructor
 */
function NyxParser(options) {
    if (options && options.out) {
        this.outputPath = process.cwd() + "/" + options.out;
    } else {
        this.outputPath = process.cwd() + '/out';
    }

    this.frameBuilder = new FrameBuilder({
        base     : BASE_PATH,
        templates: TEMPLATES_PATH,
        output   : this.outputPath
    });
}

NyxParser.prototype = {
    /**
     * build
     * @param config
     */
    build: function (config) {
        var self = this;

        fse.copy(TEMPLATES_PATH + '/copies', self.outputPath, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("copy files success!");
        });


        var images = [];
        var imageKeys = ['src', 'backgroundImage', 'image'];
        var imagePattern = /(\.jpg)|(\.png)|(\.gif)|(\.jpeg)$/;
        this.traverse(config, function (key, value) {
            if (imageKeys.indexOf(key) != -1) {
                if (imagePattern.test(value)) {
                    images.push(value);
                }
            }
        });
        config.images =images;

        fse.readFile(TEMPLATES_PATH + '/config.js', 'utf-8', function (err, content) {
            var template = _.template(content);
            fse.writeFile(self.outputPath + '/config.js', template({json: JSON.stringify(config)}, function (err) {
                if (err) {
                    console.log(err);
                }
            }))
        });


        try {
            var result = self.frameBuilder.build(config);
            fse.writeFileSync(self.outputPath + "/index.html", result);
            console.log("build success!");
        } catch (e) {
            console.log(e);
        }
    },

    traverse: function (o, func) {
        for (var i in o) {
            func.apply(this, [i, o[i]]);
            if (o[i] !== null && typeof(o[i]) == "object") {
                //going on step down in the object tree!!
                this.traverse(o[i], func);
            }
        }
    }
};

module.exports = NyxParser;