define(["zepto", "../nyx_page_animation"], function ($, pageAnimations) {
    /**
     *
     * @param {String|Zepto} target
     * @constructor
     */
    function SlideShow(target) {
        var self = this;

        self.$root = $(target);
        self.current = 0;

        self.freeze = false;

        self.screenWidth = $(window).width();

        self.$ul = self.$root.children("ul");
        self.$slides = self.$ul.children().each(function (index) {
            var $slide = $(this);
            if (index != 0) {
                $slide.hide();
            }
        });

        self.length = self.$slides.size();


        self.executor = pageAnimations.getExecutor('slideHorizontally');

        self.$root.on("swipeLeft", function () {
            self.next();
        }).on("swipeRight", function () {
            self.prev();
        });
    }

    SlideShow.prototype = {
        moveTo: function (index, direction) {
            var self = this;

            if (self.freeze) {
                return;
            }

            self.freeze = true;
            direction = direction || index - self.current;
            var promise = self.executor.call(self, self.$slides.eq(self.current), self.$slides.eq(index), direction);
            self.current = index;
            promise.then(function () {
                self.freeze = false;
            });
        },

        next: function () {
            if (this.current == (this.length - 1)) {
                this.moveTo(0, 1);
            } else {
                this.moveTo(this.current + 1);
            }
        },

        prev: function () {
            if (this.current == 0) {
                this.moveTo(this.length - 1, -1);
            } else {
                this.moveTo(this.current - 1);
            }
        }
    };

    return SlideShow;
});