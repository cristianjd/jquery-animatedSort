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
            self.options = $.extend({}, $.fn.animatedSort.options, options);
            self.hlColor = self.options.hlColor;
            self.stepTime = self.options.stepTime;
            self.sortType = self.options.sortType;
            self.numbers = self.$elem.find("li");
            self.animSteps = [];
        },

        initList: function() {
            var list = [];
            var self = this;
            self.$elem.find("li").each(function() {
                list.push(Number($(this).text()));
                $(this).css({"position": "relative", "top": 0, "left": 0});
            });
            return list;
        },

        swap: function(list, i1, i2) {
            //swap in list
            var self = this;
            var temp = list[i1];
            list[i1] = list[i2];
            list[i2] = temp;

            // select numbers to animate
            var $li1 = self.numbers.eq(i1);
            var $li2 = self.numbers.eq(i2);

            // add animation functions to array
            self.animSteps.push(function(){
                //slide out
                $li1.add($li2).animate({left: 80}, 400);
            }, function() {
               // position and value variables
                var li1_val = $li1.text();
                var li2_val = $li2.text();
                var li1_pos = $li1.position().top;
                var li2_pos = $li2.position().top;

                // animate swap
                $li1.animate({top: li2_pos-li1_pos}, 400, function() {
                    $li1.css("top", 0);
                    $li1.text(li2_val);
                });
                $li2.animate({top: li1_pos-li2_pos}, 400, function() {
                    $li2.css("top", 0);
                    $li2.text(li1_val);
                });
            }, function() {
                // slide in
                $li1.add($li2).animate({left: 0}, 400);
            });
        },

        animation: function() {
            var self = this;
            if (self.animSteps.length) {
                setTimeout(function(){
                    self.animSteps.splice(0,1)[0]();
                    self.animation();
                }, 600);
            }
        },

        bubblesort: function(list) {
                var self = this;
                for (var n = list.length; n > 1; --n) {
                    for (var i = 0; i < n-1; ++i) {
                        if (list[i] > list[i+1]) {
                            self.swap(list, i, i+1);
                        }
                    }
                }
            }
    };


    $.fn.animatedSort = function(options) {
        return this.each(function() {
            var sort = Object.create( Sort );
            sort.init(options, this);
            sort.bubblesort(sort.initList());
            sort.animation();
        });
    };

    $.fn.animatedSort.options = {
        sortType: "bubble",
        hlColor: "red",
        stepTime: 1000
    }

})(jQuery, window, document);