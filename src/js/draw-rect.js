/**
 *
 * draw rect
 * 画矩形
 *
 * User: bastengao
 * Date: 12-9-3  Time: 上午9:33
 * dependency : jQuery, underscore
 */
(function ($) {
    //画家是最大的名称空间
    //init Painter
    var Painter = (function () {
        if (_.isObject(window.Painter)) {
            return window.Painter;
        } else {
            window.Painter = {};
            return window.Painter;
        }
    })();


    //代表一个矩形
    function Rect(ele) {
        var that = this;
        this.ele = ele;
        this.$ele = $(ele);
        //左上角位置(Rect 元素的位置是相对于 playground 的位置)
        this.offsetX = 0;
        this.offsetY = 0;
        //宽高
        this.width = 0;
        this.height = 0;

        this.init = function () {
            that.dragable();
        };

        //可以拖
        this.dragable = function () {
            //拖拽开始时，Rect 元素在 document 中的位置
            var startOffset = null;
            //起点在 document 中的位置
            var startX = null;
            var startY = null;
            that.$ele.mousedown(function (event) {
                startOffset = {x:that.offsetX, y:that.offsetY};
                startX = event.pageX;
                startY = event.pageY;

                //fix bug dragging on image at FireFox
                event.preventDefault();
            });
            that.$ele.mousemove(function (event) {
                //如果开始拖拽
                if (!_.isNull(startX) && !_.isNull(startY)) {
                    var deltaX = event.pageX - startX;
                    var deltaY = event.pageY - startY;
                    that.setX(startOffset.x + deltaX);
                    that.setY(startOffset.y + deltaY);
                }
            });
            that.$ele.mouseup(function () {
                //清空
                startOffset = null;
                startX = null;
                startY = null;
            });

            that.$ele.css('cursor','move');
        };

        //取消拖拽
        this.undrag = function(){
            //消除绑定的事件
            that.$ele.unbind("mousedown").unbind("mousemove").unbind("moveup");
            that.$ele.css('cursor','default');
        };

        this.setX = function (x) {
            that.offsetX = x;
            that.$ele.css('left', x);
        };

        this.setY = function (y) {
            that.offsetY = y;
            that.$ele.css('top', y);
        };

        this.setOffset = function (x, y) {
            that.setX(x);
            that.setY(y);
        };

        this.setWidth = function (width) {
            that.width = width;
            that.$ele.width(width);
        };

        this.setHeight = function (height) {
            that.height = height;
            that.$ele.height(height);
        };

        this.setDimension = function (width, height) {
            that.setWidth(width);
            that.setHeight(height);
        }
    }

    //创建新的 Rect
    Rect.build = function (playground) {
        var rectEle = $(playground).append('<div class="rect"></div>')
            .children().last();

        var rect = new Rect(rectEle);
        rect.init();
        return rect;
    };


    //代表操场, 可以在里面画各种矩形
    function Playground(ele) {
        var that = this;
        //原生元素
        this.ele = ele;
        //jQuery 对象
        this.$ele = $(ele);
        this.$ele.addClass("playground");

        //画矩形
        this.paintRect = function (x, y, width, height) {
            var rect = Rect.build(that.ele);
            rect.setOffset(x, y);
            rect.setDimension(width, height);
            return rect;
        };

        (function ($ele) {
            //新画矩形
            var newRect = null;
            //鼠标的起始点坐标(相对于 playground)
            var startOffset = null;
            //鼠标的终点坐标(相对于 playground)
            var endOffset = null;

            //开始画新的矩形
            $ele.mousedown(function (event) {
                if (that.isEventFromRect(event)) {
                    console.log("rect down");
                } else {
                    startOffset = Painter.positionRelativeTo(event.pageX, event.pageY, $ele[0]);
                    console.log(startOffset);
                    newRect = that.paintRect(startOffset.x, startOffset.y, 0, 0);
                }

                console.log("down");
            });
            $ele.mousemove(function (event) {
                if (!_.isNull(startOffset)) {
                    endOffset = Painter.positionRelativeTo(event.pageX, event.pageY, $ele[0]);

                    newRect.setX(Math.min(startOffset.x, endOffset.x));
                    newRect.setY(Math.min(startOffset.y, endOffset.y));

                    newRect.setWidth(Math.abs(endOffset.x - startOffset.x));
                    newRect.setHeight(Math.abs(endOffset.y - startOffset.y));
                }
            });
            //结束画矩形
            $ele.mouseup(function () {
                //清空
                startOffset = null;
                endOffset = null;
                newRect = null;
            });
        })(that.$ele);

        //判断此事件是否来自 Rect
        this.isEventFromRect = function (event) {
            return  $(event.target).hasClass("rect");
        };

    }


    //创建操场
    Painter.playground = function (options) {
        var $ele = null;
        if (_.has(options, 'ele')) {
            $ele = $(options['ele']);
        } else if (_.has(options, 'id')) {
            $ele = $(options['id'])
        }


        return new Playground($ele[0]);
    };

    //相对于某一个元素的坐标
    Painter.positionRelativeTo = function (pageX, pageY, element) {
        var offset = $(element).offset();
        return {x:pageX - offset.left, y:pageY - offset.top};
    };
})(jQuery);

