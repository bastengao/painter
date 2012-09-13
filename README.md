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

Painter ��һ�������� html �ϻ�һ�˶����� javascript ���.

##���ʹ��?

Painter ����[jQuery](http://jquery.com/) �� [underscore](http://underscorejs.org/).

- ����, ���� jQuery �� underscore
- Ȼ��, ���� draw-rect.css �� draw-rect.js

``` html
<link rel="stylesheet" href="src/css/draw-rect.css">

<script type="text/javascript" src="src/js/draw-rect.js"></script>
```


```javascript
var playground = Painter.playground({id: "#playground"});

//��һ������, ���ε�λ��Ϊ x 10, y 20 ���Ϊ 40, 40
var rect = playground.paintRect(10, 20, 40, 40);
```
