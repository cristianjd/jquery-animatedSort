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
            self.sortedColor = self.options.sortedColor;
            self.stepTime = self.options.stepTime;
            self.sortType = self.options.sortType;
            self.listType = self.options.listType;
            self.animTrig = self.options.animTrig;
            self.callback = self.options.callback;
            self.animSteps = [];
        },

        // List Processing

        initList: function() {
            var list = [];
            var self = this;
            self.numbers = self.$elem.find("li");
            self.initColor = self.numbers.eq(0).css("color");
            self.$elem.find("li").each(function() {
                list.push(Number($(this).text()));
                $(this).css({"position": "relative", "top": 0, "left": 0});
            });
            self.list = list;
            return list;
        },

        randList: function(bottom, top, length) {
            var list = [];
            for (var n = 0; n<length; n++) {
                list.push(Math.floor(Math.random()*(top-bottom)+bottom));
            }
            return list;
        },

        revList: function(list){
            len = list.length;
            for (var n = 0; n < len; n++){}
        },

        genList: function(list) {
            var self = this;
            var len = list.length;
            self.$elem.append("<ul></ul>");
            for (var n = 0; n < len; n++) {
                self.$elem.children("ul").append("<li>" + list[n] + "</li>");
            }
        },


        // Animation Function Definitions

        highlight: function(iArray, hlColor){
            var self = this;
            if (hlColor !== "none"){
                var colorTime = self.stepTime*(0.5);
                var $liSel = self.numbers.eq(iArray[0]);
                for (var n = 1; n < iArray.length; n++) {
                    $liSel = $liSel.add(self.numbers.eq(iArray[n]));
                }
                self.animSteps.push(function() {
                    $liSel.animate({color: hlColor}, colorTime);//css("color", hlColor);
                });
            }

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
                    self.highlight([i, i+1], self.hlColor);
                    if (list[i] > list[i+1]) {
                        self.swap(list, i, i+1);
                    }
                    self.highlight([i, i+1], self.initColor);
                }
                self.highlight([n-1], self.sortedColor);
            }
            self.highlight([0], self.sortedColor);
        },

        selection: function(list) {
            var self = this;
            var len = list.length;
            for (var n = 0; n < len; n++){
                var min = n;
                self.highlight([n], self.hlColor);
                for (var i = n+1; i < len; i++){
                    self.highlight([i], self.hlColor);
                    if (list[i] < list[min]){
                        min = i;
                    }
                    self.highlight([i], self.initColor);
                }
                if (min !== n){
                    self.highlight([min], self.hlColor);
                    self.swap(list, n, min);
                }
                self.highlight([min, n], self.initColor);
                self.highlight([n], self.sortedColor);
            }
        }
    };


    $.fn.animatedSort = function(options) {
        return this.each(function() {
            var sort = Object.create( Sort );
            sort.init(options, this);
            if ($.isArray(sort.listType)){
                sort.genList(sort.listType)
            }
            else if (typeof(sort.listType) === "object" ){
                sort.genList(sort.randList(sort.listType.bottom, sort.listType.top, sort.listType.length));
            }
            sort[sort.sortType](sort.initList()); // prepares animation to be executed (will need switch for diff algs.)
            if (typeof(sort.callback) === "function"){
                var self = this;
                sort.animSteps.push(function(){sort.callback.call(self)});
            }
            if (sort.animTrig === "none"){
                sort.animation();
            }
            else if (typeof(sort.animTrig) === "object"){
                $(document).on(sort.animTrig.event, sort.animTrig.selector, function() {
                    sort.animation();
                });
            }

        });
    };

    $.fn.animatedSort.options = {
        sortType: "bubble",         // string for type of sort
        hlColor: "red",             // highlight color (none sets no highlight)
        sortedColor: "blue",        // sorted color (none sets to no highlight)
        stepTime: 1000,             // ms between animation steps
        listType: "existing",       // "existing", object for random , array
        animTrig: "none",           // animation trigger "none" loads on document, object for event and selector
        resetTrig: "none",          // trigger to reset and reinitialize
        callback: null              // callback after animation completes

    }

})(jQuery, window, document);