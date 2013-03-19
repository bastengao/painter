/**
 * v0.1.2-beta
 * draw-triangle
 *
 * @author bastengao
 * @date 2013-03-19
 * @dependency jQuery
 */
(function ($, global) {

    var Painter = global.Painter;

    // 代表一个三角形
    Painter.Triangle = function Triangle($ele, options) {
        this.$ele = $ele;
        // 对齐方式
        this.align = options.align;
        this.width = options.width;
        this.height = options.height;
        if (this.align === 'bottom') {
            var borderWidth = this.width / 2;
            this.$ele.css({'border-left-width': borderWidth, 'border-right-width': borderWidth})
                .css({'border-bottom-color': 'white', 'border-bottom-width': this.height});

        } else if (this.align === 'top') {
            var borderWidth = this.width / 2;
            this.$ele.css({'border-left-width': borderWidth, 'border-right-width': borderWidth})
                .css({'border-top-color': 'white', 'border-top-width': this.height});

        } else if (this.align === 'right'){
            var borderWidth = this.width / 2;
            this.$ele.css({'border-top-width': borderWidth, 'border-bottom-width': borderWidth})
                .css({'border-right-color': 'white', 'border-right-width': this.height});

        }else if(this.align === 'left'){
            var borderWidth = this.width / 2;
            this.$ele.css({'border-top-width': borderWidth, 'border-bottom-width': borderWidth})
                .css({'border-left-color': 'white', 'border-left-width': this.height});
        }
    };

    Painter.Triangle.build = function ($playground, options) {
        var $triangleEle = $('<div class="triangle"></div>').appendTo($playground);
        return new Painter.Triangle($triangleEle, options);
    };


    Painter.Playground.prototype.paintTriangle = function (align, width, height) {
        return Painter.Triangle.build(this.$ele, {align: align, width: width, height: height});
    };

})(jQuery, window);
