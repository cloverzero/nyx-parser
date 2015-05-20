define(function (require) {
    var $ = require("zepto");
    require("zepto-touch");
    var pageAnimations = require("nyx_page_animation");
    var widgetAnimations = require("nyx_widget_animation");
    var SlideShow = require("widgets/slide_show");

    function Nyx(config) {
        this.config = config;

        this.currentPage = 0;
        this.totalPages = config.pages.length;
        this.widgets = [];

        /**
         * 用于锁定翻页操作，在翻页动画过程中，此值为true
         * @type {boolean}
         */
        this.freeze = false;

        this.initPages();
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
            // 获取浏览器窗口高度
            var windowHeight = $(window).height();

            var $nyx = $(".nyx-wrapper");
            $nyx.on("swipeUp", function () {
                self.nextPage();
            }).on("swipeDown", function () {
                self.prevPage();
            }).height(windowHeight);

            var pages = this.config.pages;
            this.$pages = $(".nyx-page").each(function (index) {
                var $page = $(this);
                $page.height(windowHeight);
                if (self.currentPage != index) {
                    $page.hide();
                }
                $page.addClass("nyx-animated-page");

                self.widgets[index] = $page.find(".animated");

                var page = pages[index];
                var widgets = page.widgets;
                for (var widget, i = 0; widget = widgets[i]; i++) {
                    if (widget.type == "slideShow") {
                        new SlideShow("#" + widget.id);
                    }
                }
            });
        },

        /**
         * 下一页
         */
        nextPage: function () {
            if (this.currentPage == (this.totalPages - 1)) {
                this.moveTo(1, 1);
            } else {
                this.moveTo(this.currentPage + 1);
            }
        },

        /**
         * 上一页
         */
        prevPage: function () {
            if (this.currentPage == 1) {
                this.moveTo(this.totalPages - 1, -1);
            } else {
                this.moveTo(this.currentPage - 1);
            }
        },

        /**
         * 切换页面，整个过程包含了执行当前页的离场动画，页面切换，以及执行目标页的进场动画
         * @param {Number} pageNumber 页码，从0开始计数
         * @param  {Number} [direction] 方向,大于0表示正向，小于0表示逆向，值本身代码两个页面的距离
         */
        moveTo: function (pageNumber, direction) {
            var self = this;

            if (self.freeze) {
                return;
            }

            self.freeze = true;
            var prevPage = self.currentPage;
            var promises = self.executeWidgetAnimation("leave");
            $.when.apply($, promises).then(function () {
                return self.switchPage(pageNumber, direction);
            }).then(function () {
                var result = self.executeWidgetAnimation("enter");
                return $.when.apply($, result);
            }).then(function () {
                self.widgets[prevPage].hide();
                self.freeze = false;
            })
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
            var enterAnimation = self.config.pages[pageNumber].enter;
            var executor = pageAnimations.getExecutor(enterAnimation);
            var promise = executor.call(self, self.$pages.eq(self.currentPage), self.$pages.eq(pageNumber), direction);
            self.currentPage = pageNumber;
            return promise;
        },

        /**
         * 执行 widget 动画
         * @param {String} type 动画类型，分为「enter」和「leave」
         * @returns {Array}
         */
        executeWidgetAnimation: function (type) {
            var widgets = this.config.pages[this.currentPage].widgets || [];
            var result = [];
            widgets.forEach(function (widget) {
                if (widget[type]) {
                    var $widget = $("#" + widget.id);
                    var executor = widgetAnimations.getExecutor(widget[type]);
                    var promise = executor.call(this, $widget, type, widget[type + "Timeout"]);
                    result.push(promise);
                }
            });
            return result;
        }

    };

    return Nyx;

});