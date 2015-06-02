define(["zepto", "zepto-deferred"], function ($) {
    var cssExecutors = {
        slide: [["slideOutUp", "slideInUp"], ["slideOutDown", "slideInDown"]],
        slideHorizontally: [["slideOutLeft", "slideInRight"], ["slideOutRight", "slideInLeft"]],
        flip: [["nyxFlipOutUp", "nyxFlipInUp"], ["nyxFlipOutDown", "nyxFlipInDown"]],
        shrinkAndSlide: [["shrinkOutUp", "slideInUp"], ["shrinkOutDown", "slideInDown"]],
        fade: [["fadeOut", "fadeIn"], ["fadeOut", "fadeIn"]]
    };



    return {
        getExecutor: function (type) {
            var cssExecutor = cssExecutors[type];
            if (cssExecutor) {
                return function ($current, $next, direction) {
                    return new $.Deferred(function (deferred) {
                        $next.css("zIndex", 20);
                        if (direction > 0) {
                            $current.addClass(cssExecutor[0][0]);
                            $next.show().addClass(cssExecutor[0][1]).one("webkitAnimationEnd", function (e) {
                                e.stopPropagation();
                                $next.removeClass(cssExecutor[0][1]).css("zIndex", 10);
                                $current.hide().removeClass(cssExecutor[0][0]);
                                deferred.resolve();
                            });
                        } else {
                            $current.addClass(cssExecutor[1][0]);
                            $next.show().addClass(cssExecutor[1][1]).one("webkitAnimationEnd", function (e) {
                                e.stopPropagation();
                                $next.removeClass(cssExecutor[1][1]).css("zIndex", 10);
                                $current.hide().removeClass(cssExecutor[1][0]);
                                deferred.resolve();
                            });
                        }
                    });
                }
            } else {
                throw new Error("Not found executor: " + type);
            }
        }

    }
});