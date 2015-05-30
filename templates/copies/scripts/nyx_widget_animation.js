define(["zepto", "zepto-deferred"], function ($) {
    return {
        /**
         * widget animation executor
         * @param {String} clazz
         * @returns {Function}
         */
        getExecutor: function (clazz) {
            return function ($widget, type, timeout) {
                timeout = timeout || 0;
                return new $.Deferred(function (deferred) {
                    setTimeout(function () {
                        if (type == "enter") {
                            $widget.show();
                        }
                        $widget.addClass(clazz)
                            .one("webkitAnimationEnd", function () {
                                if (type == "leave") {
                                    $widget.hide();
                                }
                                $widget.removeClass(clazz);
                                deferred.resolve();
                            });
                    }, timeout);
                });
            }
        }

    }
});