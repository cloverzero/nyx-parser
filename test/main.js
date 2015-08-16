var config = {
    "id": "55ce1a1ee516ffef19ecf9af",
    "title": "天津爆炸",
    "backgroundColor": "",
    "backgroundImage": "",
    "wxEmbed": true,
    "audio": {},
    "pages": [
        {
            "id": "WELCOME",
            "type": "welcome",
            "widgets": [
                {
                    "id": "WELCOME_LOADING",
                    "type": "image",
                    "src": "http://115.29.32.105:8080/public/loading.gif",
                    "hasAnimation": false,
                    "align": "center",
                    "verticalAlign": "center",
                    "width": "13.88888888888889%",
                    "height": "7.8125%"
                }
            ],
            "backgroundColor": "#FFF",
            "leave": "fade"
        },
        {
            "id": "55ce1a1ee516ffef19ecf9ae",
            "backgroundColor": "#FFF",
            "enter": "slide",
            "widgets": [
                {
                    "type": "image",
                    "id": "nyx55ce1b3be516ffef19ecf9b3",
                    "width": "100%",
                    "left": "0%",
                    "height": "100%",
                    "top": "0%",
                    "src": "http://115.29.32.105:8080/public/upload/217da75265c9da81da6268c78959a006.png",
                    "hasAnimation": false
                },
                {
                    "type": "image",
                    "id": "nyx55ce1b6fe516ffef19ecf9b5",
                    "width": "11.11111111111111%",
                    "left": "34.44444444444444%",
                    "height": "30.625%",
                    "top": "23.4375%",
                    "src": "http://115.29.32.105:8080/public/upload/f2ae6a3e96f52da0419b7328379b0087.png",
                    "hasAnimation": true,
                    "enter": "fadeInDown",
                    "enterTimeout": 500,
                    "enterDuration": 1000
                },
                {
                    "type": "image",
                    "id": "nyx55ce1b82e516ffef19ecf9b7",
                    "width": "28.88888888888889%",
                    "left": "6.388888888888889%",
                    "height": "35.625%",
                    "top": "5.78125%",
                    "src": "http://115.29.32.105:8080/public/upload/b472aba6bcff69d77626a31273c6b56a.png",
                    "hasAnimation": true,
                    "enter": "fadeInUp",
                    "enterTimeout": 500,
                    "enterDuration": 1000
                }
            ]
        },
        {
            "id": "55ce1a44e516ffef19ecf9b1",
            "backgroundColor": "#000",
            "enter": "slide",
            "widgets": [
                {
                    "type": "image",
                    "id": "nyx55ce1fb7099dc9cd1affdd2c",
                    "width": "100%",
                    "left": "0%",
                    "height": "37.5%",
                    "top": "0%",
                    "src": "http://115.29.32.105:8080/public/upload/4f9b959611f3f2e0267f3231794818c5.png",
                    "hasAnimation": false
                },
                {
                    "type": "image",
                    "id": "nyx55ce1fc5099dc9cd1affdd2e",
                    "width": "100%",
                    "left": "0%",
                    "height": "38.75%",
                    "top": "61.25%",
                    "src": "http://115.29.32.105:8080/public/upload/337ef4996282035e0b05156389e723a0.png",
                    "hasAnimation": false
                },
                {
                    "type": "image",
                    "id": "nyx55ce21e7099dc9cd1affdd32",
                    "width": "100%",
                    "left": "0%",
                    "height": "6.875%",
                    "top": "46.09375%",
                    "src": "http://115.29.32.105:8080/public/upload/52f876237f4bfe07e3f5255e712a4111.png",
                    "hasAnimation": false
                }
            ]
        },
        {
            "id": "55ce1a3ee516ffef19ecf9b0",
            "backgroundColor": "#000",
            "enter": "slide",
            "widgets": [
                {
                    "type": "image",
                    "id": "nyx55ce1c35e516ffef19ecf9b9",
                    "width": "100%",
                    "left": "0%",
                    "height": "37.65625%",
                    "top": "11.875%",
                    "src": "http://115.29.32.105:8080/public/upload/f54ed9225cb96c7ab279399df274d9a8.png",
                    "hasAnimation": false
                },
                {
                    "type": "text",
                    "id": "nyx55ce1c3ce516ffef19ecf9ba",
                    "width": "55.55555555555556%",
                    "left": "0%",
                    "height": "7.8125%",
                    "top": "0%",
                    "color": "#000",
                    "fontSize": "24px",
                    "textAlign": "center",
                    "value": "这是一个文字素材",
                    "hasAnimation": false
                },
                {
                    "type": "image",
                    "id": "nyx55ce1ebd099dc9cd1affdd28",
                    "width": "100%",
                    "left": "0%",
                    "height": "7.96875%",
                    "top": "59.21875%",
                    "src": "http://115.29.32.105:8080/public/upload/2d8483acf0b93e09e5433f0c038d0ede.png",
                    "hasAnimation": false
                },
                {
                    "type": "image",
                    "id": "nyx55ce1edb099dc9cd1affdd2a",
                    "width": "27.22222222222222%",
                    "left": "0%",
                    "height": "3.90625%",
                    "top": "52.5%",
                    "src": "http://115.29.32.105:8080/public/upload/d703543fbecfdd955e3df0e4eae11856.png",
                    "hasAnimation": false
                }
            ]
        }
    ]
}

var NyxParser = require('../index');
var nyx = new NyxParser({});
nyx.build(config);