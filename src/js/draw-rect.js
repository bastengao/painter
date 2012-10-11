/**
 * v0.1.1
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
        // content 左上角位置(Rect 元素的位置是相对于 playground 的位置, 不包括 border)
        this.offsetX = 0;
        this.offsetY = 0;
        //宽高
        this.width = 0;
        this.height = 0;
        // 边框宽度
        this.borderWidth = 1;


        // 背景鼠标事件回调集合
        this._onPgMouseMoveCallbacks = {};
        this._onPgMouseUpCallbacks = {};

        //初始化
        this.init = function () {
            //默认可以拖
            that.dragable();
        };

        //playground 上鼠标移动时, Playground 会调用此方法
        this.playgroundMouseMove = function (event) {
            that._sendEvent(event, that._onPgMouseMoveCallbacks);
        };

        //注册 Playground 鼠标移动 回调
        this.onPgMouseMove = function (name, func) {
            that._onPgMouseMoveCallbacks[name] = func;
        };

        //playground 上鼠标弹起时，Playground 会调用此方法
        this.playgroundMouseUp = function (event) {
            that._sendEvent(event, that._onPgMouseUpCallbacks);
        };

        //注册 Playground 鼠标弹起 回调
        this.onPgMouseUp = function (name, func) {
            that._onPgMouseUpCallbacks[name] = func;
        };

        //注册拖动回调
        this.onDrag = function (func) {
            that._onDragCallbakc = func;
        };

        //可以拖
        this.dragable = function () {
            //拖拽开始时，Rect 元素在 document 中的位置
            var startOffset = null;
            //起点在 document 中的位置
            var startX = null;
            var startY = null;
            var dragging = false;
            that.$ele.bind('mousedown.drag', function (event) {
                startOffset = {x:that.offsetX, y:that.offsetY};
                startX = event.pageX;
                startY = event.pageY;
                dragging = true;

                //fix bug dragging on image at FireFox
                event.preventDefault();
            });

            that.onPgMouseMove('drag', function (event) {
                //如果开始拖拽
                if (dragging) {
                    var deltaX = event.pageX - startX;
                    var deltaY = event.pageY - startY;
                    that.setX(startOffset.x + deltaX);
                    that.setY(startOffset.y + deltaY);

                    Painter._callWhenFunction(that._onDragCallbakc, event);
                }
            });

            that.onPgMouseUp('drag', function (event) {
                if (dragging) {
                    dragging = false;
                    //清空
                    startOffset = null;
                    startX = null;
                    startY = null;
                }
            });

            that.$ele.css('cursor', 'move');
        };

        //取消拖拽
        this.undrag = function () {
            //消除绑定的事件
            that.$ele.unbind("mousedown.drag");
            delete that._onPgMouseMoveCallbacks['drag'];
            delete that._onPgMouseUpCallbacks['drag'];

            that.$ele.css('cursor', 'default');
            return that;
        };


        //改变大小回调
        this.onResize = function (func) {
            that._onResizeCallback = func;
        };

        //可以改变大小
        this.resizable = function () {
            var $mover = that.$ele.append('<i class="mover"></i>').find('i');
            var moving = false;
            var startBox = null;
            var topLeftPoint = null; //左上角
            var bottomRightPoint = null; //右下角
            var startOffset = null;
            var endOffset = null;
            $mover.mousedown(function (event) {
                moving = true;
                startBox = that.box();
                topLeftPoint = {x:startBox.x, y:startBox.y};
                bottomRightPoint = {
                    x:startBox.x + startBox.width,
                    y:startBox.y + startBox.height
                };
                startOffset = {x:event.pageX, y:event.pageY};
            });

            that.onPgMouseMove('resize', function (event) {
                if (moving) {
                    endOffset = {x:event.pageX, y:event.pageY};

                    var deltaX = endOffset.x - startOffset.x;
                    var deltaY = endOffset.y - startOffset.y;

                    var newEndPointX = bottomRightPoint.x + deltaX;
                    var newEndPointY = bottomRightPoint.y + deltaY;

                    var newX = Math.min(topLeftPoint.x, newEndPointX);
                    var newY = Math.min(topLeftPoint.y, newEndPointY);
                    that.setOffset(newX, newY);

                    that.setWidth(Math.abs(topLeftPoint.x - newEndPointX));
                    that.setHeight(Math.abs(topLeftPoint.y - newEndPointY));

                    $mover.removeClass('mover-nw mover-ne mover-sw mover-sw');
                    var direction = 0; // 小方块在 Rect 中的位置，初始在右下角
                    if (newY < topLeftPoint.y) {
                        direction = direction + 0; //上
                    } else {
                        direction = direction + 2; //下
                    }

                    if (newX < topLeftPoint.x) {
                        direction = direction + 0; //左
                    } else {
                        direction = direction + 1; //右
                    }

                    switch (direction) {
                        case 0:
                            $mover.addClass('mover-nw');
                            break;
                        case 1:
                            $mover.addClass('mover-ne');
                            break;
                        case 2:
                            $mover.addClass('mover-sw');
                            break;
                        case 3:
                            $mover.addClass('mover-se');
                            break;
                    }

                    Painter._callWhenFunction(that._onResizeCallback, event);
                }
            });
            that.onPgMouseUp('resize', function (event) {
                if (moving) {
                    moving = false;
                    $mover.removeClass('mover-nw mover-ne mover-sw mover-sw');
                }
            });

            return that;
        };

        //取消改变大小
        this.unresize = function () {
            that.$ele.find('i').remove();
            delete that._onPgMouseMoveCallbacks['resize'];
            delete that._onPgMouseUpCallbacks['resize'];
        };

        //将自己删除
        this.remove = function () {
            Painter._callWhenFunction(that._onRemoveCallback, that);

            that.$ele.remove();
        };

        //注册删除回调
        this.onRemove = function (func) {
            that._onRemoveCallback = func;
        };

        /**
         * 返回矩形的位置及宽高
         * 如下：
         * {
         *    x: 左上角 x
         *    y: 左上角 y
         *    width: 宽度
         *    height: 高度
         * }
         */
        this.box = function () {
            return {x:that.offsetX, y:that.offsetY, width:that.width, height:that.height};
        };

        this.setX = function (x) {
            that.offsetX = x;
            that.$ele.css('left', x - that.borderWidth);
            return that;
        };

        this.setY = function (y) {
            that.offsetY = y;
            that.$ele.css('top', y - that.borderWidth);
            return that;
        };

        this.setOffset = function (x, y) {
            that.setX(x);
            that.setY(y);
            return that;
        };

        this.setWidth = function (width) {
            that.width = width;
            that.$ele.width(width);
            return that;
        };

        this.setHeight = function (height) {
            that.height = height;
            that.$ele.height(height);
            return that;
        };

        this.setDimension = function (width, height) {
            that.setWidth(width);
            that.setHeight(height);
            return that;
        };

        this.setColor = function (color) {
            that.$ele.css('background-color', color);
            return that;
        };

        this.setBorderColor = function (color) {
            that.$ele.css('border-color', color);
            return that;
        };

        this.setBorderWidth = function (borderWidth) {
            that.borderWidth = borderWidth;
            that.$ele.css('border-width', borderWidth);
            that._updateOffset();
            return that;
        };

        this._updateOffset = function () {
            that.setOffset(that.offsetX, that.offsetY);
        };

        //遍历回调集合
        this._sendEvent = function (event, callbacks) {
            _.each(callbacks, function (callback) {
                Painter._callWhenFunction(callback, event);
            });
        };
    }

    //创建新的 Rect
    Rect.build = function (playground) {
        //TODO use appendTo
        var $rectEle = $(playground).append('<div class="rect"></div>')
            .children().last();

        var rect = new Rect($rectEle[0]);
        rect.init();
        return rect;
    };


    //代表操场, 可以在里面画各种矩形
    function Playground(ele, options) {
        var that = this;
        //原生元素
        this.ele = ele;
        //jQuery 对象
        this.$ele = $(ele);
        this.$ele.addClass("playground");

        //保存所有的 Rect
        this.rects = [];
        (function () {
            //当开始手工画矩形时回调
            that.onPaintRectStart = null;
            if(_.has(options,'rectStart')){
                that.onPaintRectStart = options['rectStart'];
            }

            //当画完一个新矩形时的回调
            that.onPaintRectComplete = null;
            if (_.has(options, 'rectComplete')) {
                that.onPaintRectComplete = options['rectComplete'];
            }

            //mouse moving
            that.$ele.bind('mousemove.onPgMouseMove', function (event) {
                _.each(that.rects, function (rect) {
                    rect.playgroundMouseMove(event);
                });
            });

            //mouse up
            that.$ele.bind('mouseup.onPgMouseUp', function (event) {
                _.each(that.rects, function (rect) {
                    rect.playgroundMouseUp(event);
                });
            });
        })();

        //画矩形
        this.paintRect = function (x, y, width, height) {
            var rect = Rect.build(that.ele);
            that.rects.push(rect);
            rect.onRemove(function (removingRect) {
                var index = _.indexOf(that.rects, removingRect);
                that.rects.splice(index, 1);
            });
            rect.setOffset(x, y);
            rect.setDimension(width, height);
            return rect;
        };

        //可以画矩形
        this.drawable = function () {
            var $ele = that.$ele;
            //新画矩形
            var newRect = null;
            //鼠标的起始点坐标(相对于 playground)
            var startOffset = null;
            //鼠标的终点坐标(相对于 playground)
            var endOffset = null;
            var drawing = false;

            //开始画新的矩形
            $ele.bind('mousedown.draw', function (event) {
                //如果事件源来自 rect 或者 mover, 则忽略
                if (that.isEventFromRect(event)) {
                    return;
                }
                if (that.isEventFromMover(event)) {
                    return;
                }
                //如果事件源不是来自 rect
                startOffset = Painter.positionRelativeTo(event.pageX, event.pageY, $ele[0]);
                newRect = that.paintRect(startOffset.x, startOffset.y, 0, 0);
                Painter._callWhenFunction(that.onPaintRectStart, newRect);
                drawing = true;
            });
            $ele.bind('mousemove.draw', function (event) {
                if (drawing) { //如果是画矩形
                    endOffset = Painter.positionRelativeTo(event.pageX, event.pageY, $ele[0]);

                    newRect.setX(Math.min(startOffset.x, endOffset.x));
                    newRect.setY(Math.min(startOffset.y, endOffset.y));

                    newRect.setWidth(Math.abs(endOffset.x - startOffset.x));
                    newRect.setHeight(Math.abs(endOffset.y - startOffset.y));
                }
            });
            //结束画矩形
            $ele.bind('mouseup.draw', function () {
                if (drawing) { //如果是画矩形
                    drawing = false;
                    //调用矩形完成的回调
                    Painter._callWhenFunction(that.onPaintRectComplete, newRect);

                    //清空
                    startOffset = null;
                    endOffset = null;
                    newRect = null;
                }
            });
        };

        //取消可以画图
        this.undrawable = function () {
            //取消画图的鼠标事件
            that.$ele.unbind('.draw');
        };

        //判断此事件是否来自 Rect
        this.isEventFromRect = function (event) {
            return  $(event.target).hasClass('rect');
        };
        //判断此事件是否来自 Rect 的 mover
        this.isEventFromMover = function (event) {
            return $(event.target).hasClass('mover');
        };

        //init
        (function () {
            that.drawable();
        })();
    }


    /**
     * 创建操场
     *
     * 参数:
     * id : 绑定的元素的id
     * ele : 绑定的 dom element(元素)
     * rectComplete : 画完新矩形的回调, 会传入新画的矩形(Rect)的对象
     */
    Painter.playground = function (options) {
        var $ele = null;
        if (_.has(options, 'ele')) {
            $ele = $(options['ele']);
        } else if (_.has(options, 'id')) {
            $ele = $(options['id']);
        }


        return new Playground($ele[0], options);
    };

    //相对于某一个元素的坐标
    Painter.positionRelativeTo = function (pageX, pageY, element) {
        var offset = $(element).offset();
        return {x:pageX - offset.left, y:pageY - offset.top};
    };

    //调用，如果能调用
    Painter._callWhenFunction = function (func, args) {
        if (_.isFunction(func)) {
            func(args);
        }
    };
})(jQuery);

