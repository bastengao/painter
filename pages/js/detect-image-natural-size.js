(function (window) {
    window.Images= {
        //获取图片自然大小
        naturalSize:function (imgSrc, callback) {
            jQuery("<img/>").load(
                function () {
                    var naturalWidth = this.width;
                    var naturalHeight = this.height;
                    callback(naturalWidth, naturalHeight);
                }).attr("src", imgSrc);
        }};
})(window);