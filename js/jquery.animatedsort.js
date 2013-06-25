// Utility
if ( typeof Object.create !== 'function') {
    Object.create = function(obj) {
        function F(){}
        F.prototype = obj;
        return new F();
    };
}

// Animated Sort Plugin

(function( $, window, document, undefined ) {
    var Sort = {
        init: function(options, elem) {
            var self = this;
            self.elem = elem;
            self.$elem = $(elem);
            self.hlColor = options.hlColor;
            self.stepTime = options.stepTime;
            self.sortType = options.sortType;
            self. options = $.extend({}, $.fn.animatedSort.options, options);
        },

        initList: function() {
            var list = [];
            var self = this;
            self.$elem.find("li").each(function() {
                list.push(Number($(this).text()));
                $(this).css({"position": "relative", "top": 0, "left": 0});
            });
            console.log(list);
        }
    };


    $.fn.animatedSort = function(options) {
        return this.each(function() {
            var sort = Object.create( Sort );
            sort.init(options, this);
            sort.initList();
        });
    };

    $.fn.animatedSort.options = {
        sortType: "bubble",
        hlColor: "red",
        stepTime: 1000
    }

})(jQuery, window, document);