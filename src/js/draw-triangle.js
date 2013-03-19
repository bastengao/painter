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
    Painter.Triangle = function Triangle(options) {


    };

    Painter.Triangle.build = function (playground) {
        // TODO use playground jquery object directly
        var $triangleEle = $('<div class="triangle"></div>').appendTo($(playground));
        return new Painter.Triangle($triangleEle);
    };


    Painter.Playground.prototype.paintTriangle = function () {
        console.log("paint triangle");
        return Painter.Triangle.build(this.ele);
    };

})(jQuery, window);
