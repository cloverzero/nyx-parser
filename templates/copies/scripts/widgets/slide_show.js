define(["zepto", "velocity"], function ($) {
    /**
     *
     * @param {String|Zepto} target
     * @constructor
     */
    function SlideShow(target) {
        var self = this;

        self.$root = $(target);
        self.current = 0;

        self.screenWidth = $(window).width();

        self.$ul = self.$root.children();
        self.$slides = self.$ul.children().each(function () {
            this.style.width = self.screenWidth + "px";
        });

        self.length = self.$slides.size();
        self.$ul.width(self.screenWidth * self.length);

        self.$root.on("swipeLeft", function () {
            self.next();
        }).on("swipeRight", function () {
            self.prev();
        });
        $.Velocity.hook(self.$root, "translateX", "0px");
    }

    SlideShow.prototype = {
        moveTo: function (index) {
            this.$root.velocity({
                translateX: this.screenWidth * (-index)
            }, 700);
            this.current = index;
        },

        next: function () {
            this.moveTo(this.current == (this.length - 1) ? 0 : ++this.current);
        },

        prev: function () {
            this.moveTo(this.current == 0 ? this.length - 1 : --this.current);
        }
    };

    return SlideShow;
});