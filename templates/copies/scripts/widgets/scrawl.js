define(["zepto"], function ($) {
    "use strict";
    /**
     *
     * @param {String|Zepto} target
     * @param {Object} config
     * @constructor
     */
    function Scrawl(target, config) {
        this.$root = $(target);
        this.config = config;
        this.initCanvas(config);
    }

    Scrawl.prototype = {
        initCanvas: function (config) {
            var self = this;
            this.$canvas = this.$root.children("canvas");
            this.canvas = this.$canvas[0];
            this.canvas.width = config.width;
            this.canvas.height = config.height;
            this.ctx = this.canvas.getContext("2d");
            new $.Deferred(function (deferred) {
                if (config.color) {
                    self.ctx.fillStyle = config.color;
                    self.ctx.fillRect(0, 0, config.width, config.height);
                    deferred.resolve();
                } else if (config.image) {
                    var imageNode = new Image();
                    imageNode.src = config.image;
                    imageNode.onload = function () {
                        self.ctx.drawImage(imageNode, 0, 0, config.width, config.height);
                        deferred.resolve();
                    }
                }
            }).then(function () {
                self.ctx.lineJoin="round";
                self.ctx.lineCap= "round";
                self.ctx.lineWidth = 40;
                self.ctx.globalCompositeOperation = "destination-out";
            });



            this.$canvas.on("touchstart", function (e) {
                e.preventDefault();
                e.stopPropagation();
                var target = e.touches[0];
                self.lastX = target.pageX;
                self.lastY = target.pageY;
            }).on("touchmove", function (e) {
                e.preventDefault();
                e.stopPropagation();
                var target = e.touches[0];

                self.drawLine(self.lastX,self.lastY,target.pageX,target .pageY)
                self.lastX = target.pageX;
                self.lastY = target.pageY;
            }).on("touchend",function(e){
                e.preventDefault();
                e.stopPropagation();
                if (self.isOver()) {
                    self.$canvas.addClass("fadeOut").one("animationend webkitAnimationEnd", function () {
                        if (self.overCallback) {
                            self.overCallback.call(this);
                        }
                    });
                }
            });
        },

        drawLine: function (fx, fy, dx, dy) {
            this.ctx.beginPath();
            this.ctx.moveTo(fx, fy);
            this.ctx.lineTo(dx, dy);
            this.ctx.stroke();
        },

        isOver: function () {
            var imageData = this.ctx.getImageData(0, 0, this.config.width, this.config.height);
            var data = imageData.data;
            var length = imageData.width * imageData.height;
            var clearCount = 0;
            for (var i = 0; i < length; i++) {
                var index = i * 4;
                var sum = data[index] + data[index + 1] + data[index + 2] + data[index + 3];
                if (sum === 0) {
                    clearCount++;
                }
            }
            var ratio = clearCount / length;
            return ratio >= this.config.finishThreshold;
        },

        onOver: function (callback) {
            this.overCallback = callback
        }
    };

    return Scrawl;
});