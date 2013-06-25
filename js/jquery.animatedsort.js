// Browser Compatibility with Object.create
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
            self.initColor = self.numbers.eq(1).css("color");
            self.animSteps = [];
        },

        // List Processing

        initList: function() {
            var list = [];
            var self = this;
            self.$elem.find("li").each(function() {
                list.push(Number($(this).text()));
                $(this).css({"position": "relative", "top": 0, "left": 0});
            });
            return list;
        },


        // Animation Function Definitions

        highlight: function(i1, i2, hlColor){
            var self = this;
            var colorTime = self.stepTime*(0.5);
            var $li1 = self.numbers.eq(i1);
            var $li2 = self.numbers.eq(i2);
            self.animSteps.push(function() {
                $li1.add($li2).animate({color: hlColor}, colorTime);//css("color", hlColor);
            });

        },

        swap: function(list, i1, i2) {
            var self = this;

            //swap in list
            var temp = list[i1];
            list[i1] = list[i2];
            list[i2] = temp;

            // select numbers to animate
            var $li1 = self.numbers.eq(i1);
            var $li2 = self.numbers.eq(i2);

            //define slide timing
            var slideTime = self.stepTime*(2/3);

            // add animation functions to array
            self.animSteps.push(function(){
                //slide out
                $li1.add($li2).animate({left: 80}, slideTime);
            }, function() {
               // position and value variables
                var li1_val = $li1.text();
                var li2_val = $li2.text();
                var li1_pos = $li1.position().top;
                var li2_pos = $li2.position().top;

                // animate swap
                $li1.animate({top: li2_pos-li1_pos}, slideTime, function() {
                    $li1.css("top", 0);
                    $li1.text(li2_val);
                });
                $li2.animate({top: li1_pos-li2_pos}, slideTime, function() {
                    $li2.css("top", 0);
                    $li2.text(li1_val);
                });
            }, function() {
                // slide in
                $li1.add($li2).animate({left: 0}, slideTime);
            });
        },

        // Execute Animation

        animation: function() {
            var self = this;
            if (self.animSteps.length) {
                setTimeout(function(){
                    self.animSteps.splice(0,1)[0]();
                    self.animation();
                }, self.stepTime);
            }
        },

        // Sort Algorithms

        bubble: function(list) {
            var self = this;
            for (var n = list.length; n > 1; --n) {
                for (var i = 0; i < n-1; ++i) {
                    self.highlight(i, i+1, self.hlColor);
                    if (list[i] > list[i+1]) {
                        self.swap(list, i, i+1);
                    }
                    self.highlight(i, i+1, self.initColor);
                }
            }
        }
    };


    $.fn.animatedSort = function(options) {
        return this.each(function() {
            var sort = Object.create( Sort );
            sort.init(options, this);
            sort.bubble(sort.initList());
            sort.animation();
        });
    };

    $.fn.animatedSort.options = {
        sortType: "bubble",
        hlColor: "red",
        stepTime: 1000
    }

})(jQuery, window, document);