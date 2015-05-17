'use strict';

var fs = require('fs');
var ncp = require('ncp');
var _ = require('underscore');
var FrameBuilder = require('./builders/frame_builder');

var TEMPLATES_PATH = __dirname + '/templates';
var BASE_PATH = __dirname;


/**
 * Nyx
 * @constructor
 */
function NyxParser(options) {
    this.outputPath = process.cwd() + '/out';
    if (options && options.out) {
        this.outputPath = process.cwd() + "/" + options.out;
    }

    this.frameBuilder = new FrameBuilder({
        base: BASE_PATH,
        templates: TEMPLATES_PATH,
        output: this.outputPath
    });
}

NyxParser.prototype = {
    /**
     * build
     * @param config
     */
    build: function (config) {
        var self = this;

            ncp(TEMPLATES_PATH + '/copies', self.outputPath, function (err) {
                if (err) {
                    console.log(err);
                }
            });

            fs.readFile(TEMPLATES_PATH + '/config.js', 'utf-8', function (err, content) {
                var template = _.template(content);
                fs.writeFile(self.outputPath + '/config.js', template({ json: JSON.stringify(config)}, function (err) {
                    if (err) {
                        console.log(err);
                    }
                }))
            });


            try {
                var result = self.frameBuilder.build(config);
                fs.writeFileSync(self.outputPath + "/index.html", result);
                console.log("build success!");
            } catch (e) {
                console.log(e);
            }


    }
};

module.exports = NyxParser;