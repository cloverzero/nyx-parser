({
    baseUrl: ".",
    paths: {
        zepto           : '../bower_components/zepto/zepto',
        "zepto-touch"   : '../bower_components/zeptojs/src/touch',
        "zepto-callback": '../bower_components/zeptojs/src/callbacks',
        "zepto-deferred": '../bower_components/zeptojs/src/deferred',
        "NyxConfig"     : 'empty:',
        "hammer"        : '../bower_components/hammerjs/hammer.min'
    },
    shim: {
        zepto: {
            exports: "$"
        },
        "zepto-touch": {
            deps: ["zepto"]
        },
        "zepto-callback": {
            deps: ["zepto"]
        },
        "zepto-deferred": {
            deps: ["zepto", "zepto-callback"]
        }
    },
    name: "config",
    out: "app.js"
})