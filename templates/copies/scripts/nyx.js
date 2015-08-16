define(function (require) {
    "use strict";

    var $ = require("zepto");
    require("zepto-touch");
    var pageAnimations = require("nyx_page_animation");
    var widgetAnimations = require("nyx_widget_animation");
    var SlideShow = require("widgets/slide_show");
    var Scrawl = require("widgets/scrawl");

    function Nyx(config) {
        var self = this;
        this.config = config;

        this.currentPage = 0;
        this.startPage = 0;
        this.totalPages = config.pages.length;
        this.widgets = [];

        this.hasWelcomePage = false;
        /**
         * 用于锁定翻页操作，在翻页动画过程中，此值为true
         * @type {boolean}
         */
        this.freeze = false;


        this.$bottomButton = $("#nyx-bottom-button").bind("touch", function () {
            self.nextPage();
        });

        this.loadedPromise = this._loadImages().then(function () {
            // 延迟1.5秒
            return new $.Deferred(function (deferred) {
                window.setTimeout(function () {
                    deferred.resolve();
                }, 1500);
            })
        });

        // 哎，设计上有点失误，这三个函数有顺序依赖
        this.initPages();
        this.initMusic();
        this.initCount();

        var hash = location.hash;
        if (hash.length > 1) {
            var startPage = location.hash.substring(1) - 0;
            if (!isNaN(startPage)) {
                this.moveTo(startPage, 1, true);
                return;
            } else {
                var target = $(hash);
                if (target.size() > 0) {
                    this.moveTo(target.index(), 1, true);
                    return;
                }
            }
        }

        if (self.hasWelcomePage) {
            self.loadedPromise.then(function () {
                self.moveTo(self.startPage, 1);
                self.$bottomButton.show();
            });
        } else {
            self.executeWidgetAnimation();
        }

    }

    Nyx.prototype = {
        /**
         * 页面初始化
         */
        initPages: function () {
            // 解决微信老版本浏览器不支持zepto swipeUp事件的问题
            document.addEventListener('touchmove', function (event) {
                event.preventDefault();
            }, false);

            var self = this;

            var $window = $(window);
            var windowHeight = $window.height();
            var windowWidth = $window.width();

            var $nyx = $(".nyx-wrapper");
            $nyx.on("swipeUp", function () {
                self.nextPage();
            }).on("swipeDown", function () {
                self.prevPage();
            }).height(windowHeight);

            var pages = this.config.pages;
            this.$pages = $(".nyx-page").each(function (index) {
                var $page = $(this);
                if (self.currentPage != index) {
                    $page.hide();
                }
                $page.addClass("nyx-animated-page");

                self.widgets[index] = $page.children(".animated");

                var page = pages[index];
                if (page.type === "welcome") {
                    self.hasWelcomePage = true;
                    self.startPage = 1;
                }
                var widgets = page.widgets;

                for (var widget, i = 0; widget = widgets[i]; i++) {
                    if (widget.linkTo) {
                        (function (link) {
                            $("#" + widget.id).click(function () {
                                window.open(link);
                            });
                        })(widget.linkTo);
                    }
                    if (widget.moveTo) {
                        (function (id) {
                            $("#" + widget.id).click(function () {
                                console.log("234324");
                                self.moveTo($("#" + id).index());
                            });
                        })(widget.moveTo);
                    }
                    if (widget.type === "slideShow") {
                        new SlideShow("#" + widget.id, widget);
                    } else if (widget.type === "scrawl") {
                        widget.width = windowWidth;
                        widget.height = windowHeight;
                        var scrawl = new Scrawl("#" + widget.id, widget);

                        // 这部分代码写的有点恶心，主要是这个组件的有这么个特殊性，后面想想有什么办法解决。
                        if (page.type === "welcome") {
                            self.loadedPromise = self.loadedPromise.then(function () {
                                return new $.Deferred(function (deferred) {
                                    scrawl.onOver(function () {
                                        deferred.resolve();
                                    });
                                });
                            })
                        } else {
                            scrawl.onOver(function () {
                                self.nextPage();
                            })
                        }
                    }
                }
            });
        },


        initMusic: function () {
            var self = this;
            if (this.config.audio) {
                this.isAudioOn = false;
                this.audioElement = document.getElementById("nyx-audio");
                this.$audioButton = $("#nyx-audio-toggle-button").click(function () {
                    self.toggleAudio();
                });

                if (this.hasWelcomePage) {
                    this.loadedPromise.then(function () {
                        self.$audioButton.show();
                        if (self.config.audio.autoplay) {
                            self.toggleAudio();
                        }
                    });
                } else {
                    self.$audioButton.show();
                    if (self.config.audio.autoplay) {
                        self.toggleAudio();
                    }
                }
            }
        },

        toggleAudio: function () {
            if (this.isAudioOn) {
                this.audioElement.pause();
                this.$audioButton.removeClass("rotating");
            } else {
                this.audioElement.play();
                this.$audioButton.addClass("rotating");
            }
            this.isAudioOn = !this.isAudioOn;
        },

        initCount: function () {
            var self = this;
            $.get("/count/" + this.config.id, function (response) {
                self.setCount(response.count);
            });
        },

        setCount: function (count) {
            $(".nyx-text").each(function () {
                var $text = $(this);
                var text = $text.text();
                $text.text(text.replace("{count}", count));
            });
        },

        /**
         * 下一页
         */
        nextPage: function () {
            if (this.currentPage == (this.totalPages - 1)) {
                //this.moveTo(this.startPage, 1);
            } else {
                this.moveTo(this.currentPage + 1);
            }
        },

        /**
         * 上一页
         */
        prevPage: function () {
            if (this.currentPage == this.startPage) {
                //this.moveTo(this.totalPages - 1, -1);
            } else {
                this.moveTo(this.currentPage - 1);
            }
        },

        /**
         * 切换页面，整个过程包含了执行当前页的离场动画，页面切换，以及执行目标页的进场动画
         * @param {Number} pageNumber 页码，从0开始计数
         * @param  {Number} [direction] 方向,大于0表示正向，小于0表示逆向，值本身代码两个页面的距离
         * @param {boolean} [skipLeave] 忽略离场动画
         */
        moveTo: function (pageNumber, direction, skipLeave) {
            var self = this;

            if (self.freeze) {
                return;
            }

            self.freeze = true;
            var prevPage = self.currentPage;
            self.switchPage(pageNumber, direction).then(function () {
                var result = self.executeWidgetAnimation();
                return $.when.apply($, result);
            }).then(function () {
                self.widgets[prevPage].hide();
                self.freeze = false;
            });

            if (pageNumber === self.totalPages - 1) {
                self.$bottomButton.hide();
            } else {
                self.$bottomButton.show();
            }
        },

        /**
         * 单纯的切换页面
         * @param {Number} pageNumber 页码，从0开始计数
         * @param  {Number} direction 方向,大于0表示正向，小于0表示逆向，值本身代码两个页面的距离
         * @return {$.Deferred} 返回一个Promise，表示页面切换完成
         */
        switchPage: function (pageNumber, direction) {
            var self = this;
            direction = direction || pageNumber - self.currentPage;
            var enterAnimation = self.config.pages[self.currentPage].leave ||self.config.pages[pageNumber].enter;
            var executor = pageAnimations.getExecutor(enterAnimation);
            var promise = executor.call(self, self.$pages.eq(self.currentPage), self.$pages.eq(pageNumber), direction);
            self.currentPage = pageNumber;
            return promise;
        },

        /**
         * 执行 widget 动画
         * @returns {Array}
         */
        executeWidgetAnimation: function () {
            var self = this;
            var widgets = this.config.pages[this.currentPage].widgets || [];
            var result = [];
            widgets.forEach(function (widget) {
                var $widget = $("#" + widget.id);
                var enter = widget['enter'];
                var leave = widget['leave'];
                if (enter) {
                    result.push(self._executeWidgetAnimation($widget, enter, widget["enterTimeout"], "enter"));
                }
                if (leave) {
                    result.push(self._executeWidgetAnimation($widget, leave, widget["leaveTimeout"], "leave"));
                }

            });
            return result;
        },

        _executeWidgetAnimation: function ($widget, animation, timeout, type) {
            var executor = widgetAnimations.getExecutor(animation);
            return executor.call(this, $widget, type, timeout);
        },


        _loadImages: function () {
            var images = this.config.images;
            var imageLoadPromises = [];
            for (var i = 0; i < images.length; i++) {
                var image = images[i];
                imageLoadPromises.push(this._loadImage(image));
            }
            return $.when.apply($, imageLoadPromises);
        },

        _loadImage: function (imageAddress) {
            return new $.Deferred(function (derferred) {
                var imageNode = new Image();
                imageNode.src = imageAddress;
                imageNode.onload = function () {
                    derferred.resolve();
                }
            });
        }
    };

    return Nyx;

});