#Painter

Painter is a javascript library that could draw something on html.

##how to use?

Painter is based on [jQuery](http://jquery.com/) and [underscore](http://underscorejs.org/).

- First, refer jQuery and underscore
- Second, refer draw-rect.css and draw-rect.js

``` html
<link rel="stylesheet" href="src/css/draw-rect.css">

<script type="text/javascript" src="src/js/draw-rect.js"></script>
```


```javascript
var playground = Painter.playground({id: "#playground"});

//paint a rect that x 10, y 20, width 40, height 40
var rect = playground.paintRect(10, 20, 40, 40);
```



#Painter

Painter 是一个可以在 html 上画一此东西的 javascript 类库.

##如何使用?

Painter 基于[jQuery](http://jquery.com/) 和 [underscore](http://underscorejs.org/).

- 首先, 先引 jQuery 和 underscore
- 然后, 再引 draw-rect.css 和 draw-rect.js

``` html
<link rel="stylesheet" href="src/css/draw-rect.css">

<script type="text/javascript" src="src/js/draw-rect.js"></script>
```


```javascript
var playground = Painter.playground({id: "#playground"});

//画一个矩形, 矩形的位置为 x 10, y 20 宽高为 40, 40
var rect = playground.paintRect(10, 20, 40, 40);
```
