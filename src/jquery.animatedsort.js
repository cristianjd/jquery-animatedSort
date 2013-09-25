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

        // Initialize, Set Options as Instance Variables

        init: function(options, elem) {
            var self = this;
            self.elem = elem;
            self.$elem = $(elem);
            self.options = $.extend({}, $.fn.animatedSort.options, options);
            self.highlightColor = self.options.highlightColor;
            self.sortedColor = self.options.sortedColor;
            self.animColor = self.options.animColor;
            self.stepTime = self.options.stepTime;
            self.slideTime = self.stepTime*(2.0/3);
            self.swapTime = self.stepTime*(15.0/24);
            self.colorTime = self.stepTime*(0.5);
            self.sortType = self.options.sortType;
            self.listType = self.options.listType;
            self.animTrig = self.options.animTrig;
            self.resetTrig = self.options.resetTrig;
            self.callback = self.options.callback;
            self.animSteps = [];
        },

        // Initialize HTML List and Generate Animation Constants

        initList: function() {
            var list = [];
            var self = this;
            self.numbers = self.$elem.find("li");
            self.initColor = self.numbers.eq(0).css("color");
            self.initFontSize = self.numbers.eq(0).css("font-size");
            self.slideDis = Number(self.initFontSize.substring(0, self.initFontSize.length-2))*2;
            self.$elem.find("li").each(function() {
                list.push(Number($(this).text()));
                $(this).css({"position": "relative", "top": 0, "left": 0});
            });
            self.list = list.slice(0);
            return list;
        },

        // Create Random Array

        randList: function(bottom, top, length) {
            var list = [];
            for (var n = 0; n<length; n++) {
                list.push(Math.floor(Math.random()*(top-bottom)+bottom));
            }
            return list;
        },

        // Generate HTML List from Array

        genList: function(list) {
            var self = this;
            var len = list.length;
            self.$elem.append("<ul></ul>");
            for (var n = 0; n < len; n++) {
                self.$elem.children("ul").append("<li>" + list[n] + "</li>");
            }
        },

        // Animation Function Definitions

        highlight: function(array, color){
            var self = this;
            if (color !== "none"){
                var $liSel = self.numbers.eq(array[0]);
                for (var n = 1; n < array.length; n++) {
                    $liSel = $liSel.add(self.numbers.eq(array[n]));
                }
                self.animSteps.push(function() {
                    if (self.animColor){
                        $liSel.animate({color: color}, self.colorTime);
                    } else {
                        $liSel.css("color", color);
                    }
                });
            }

        },

        addHighlightColor: function(array) {
            var self = this;
            self.highlight(array, self.highlightColor);
        },

        addSortedColor: function(array) {
            var self = this;
            self.highlight(array, self.sortedColor);
        },

        removeColor: function(array) {
        var self = this;
        self.highlight(array, self.initColor);
        },

        slide: function(array, distance){
            var self = this;
            var $liSel = self.numbers.eq(array[0]);
            for (var n = 1; n < array.length; n++){
                $liSel = $liSel.add(self.numbers.eq(array[n]));
            }
            self.animSteps.push(function() {
                $liSel.animate({left: distance}, self.slideTime);
            });
        },

        slideOut: function(array) {
            var self = this;
            self.slide(array, self.slideDis);
        },

        slideIn: function(array) {
            var self = this;
            self.slide(array, 0);
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

            // add animation functions to array
            self.animSteps.push(function() {
               // position, value, and color variables
                var li1_val = $li1.text();
                var li2_val = $li2.text();
                var li1_pos = $li1.position().top;
                var li2_pos = $li2.position().top;
                var li1_left = $li1.css("left");
                var li2_left = $li2.css("left");
                var li1_color = $li1.css("color");
                var li2_color = $li2.css("color");

                // animate swap
                $li1.animate({top: li2_pos-li1_pos}, self.swapTime, function() {
                    $li1.css({top: 0, left: li2_left, color: li2_color});
                    $li1.text(li2_val);
                });
                $li2.animate({top: li1_pos-li2_pos}, self.swapTime, function() {
                    $li2.css({top: 0, left: li1_left, color: li1_color});
                    $li2.text(li1_val);
                });
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
                    self.addHighlightColor([i, i+1]);
                    if (list[i] > list[i+1]) {
                        self.slideOut([i, i+1]);
                        self.swap(list, i, i+1);
                        self.slideIn([i, i+1]);
                    }
                    self.removeColor([i, i+1]);
                }
                self.addSortedColor([i, i+1]);
            }
            self.addSortedColor([0]);
        },

        selection: function(list) {
            var self = this;
            var len = list.length;
            for (var n = 0; n < len; n++){
                var min = n;
                self.addHighlightColor([n]);
                for (var i = n+1; i < len; i++){
                    self.addHighlightColor([i]);
                    if (list[i] < list[min]){
                        min = i;
                    }
                    self.removeColor([i]);
                }
                if (min !== n){
                    self.addHighlightColor([min]);
                    self.slideOut([n, min]);
                    self.swap(list, n, min);
                    self.slideIn([n, min]);
                }
                self.removeColor([min, n]);
                self.addSortedColor([n]);
            }
        },

        insertion: function(list) {
            var self = this;
            var len = list.length;
            for (var n = 0; n < len; n++){
                var val = list[n];
                var pos = n;
                self.addHighlightColor([n]);
                if (val < list[n-1]){
                    self.slideOut([pos]);
                    for (var i = n-1; i >= 0; i--){
                        if (val < list[i]){

                            self.swap(list, i+1, i);
                            pos = i;
                        }
                    }
                    self.slideIn([pos]);
                }
                self.removeColor([pos]);
                self.addSortedColor([pos]);
            }
        },

        quick: function(list) {
            var self = this;
            var len = list.length;
            function partition(array, begin, end, pivot) {
                var piv = array[pivot];
                self.swap(array, pivot, end-1);
                var store = begin;
                for (var n = begin; n < end-1; n++) {
                    //self.addHighlightColor([end-1, n]);
                    if (array[n] <= piv) {
                        self.swap(array, store, n);
                        store++;
                    }
                    //self.removeColor([end-1, n]);
                }
                self.swap(array, end-1, store);
                return store;
            }

            function qsort(array, begin, end) {
                if (end-1 > begin) {
                    var pivot = begin+Math.floor(Math.random()*(end-begin));
                    //var pivot = begin;
                    pivot = partition(array, begin, end, pivot);

                    qsort(array, begin, pivot);
                    qsort(array, pivot+1, end);
                }
            }

            qsort(list, 0, len);
            //partition(list, 0, len, 0);
            //console.log(list);
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
            if (typeof(sort.resetTrig) === "object"){
                $(document).on(sort.resetTrig.event, sort.resetTrig.selector, function() {

                    console.log(sort.list);
                    sort.animSteps = [];
                    sort.$elem.find("ul").eq(0).remove();
                    if (sort.listType === "existing") {
                        sort.options.listType = sort.list;
                    }
                    sort.$elem.animatedSort(sort.options);
                });
            }

        });
    };

    $.fn.animatedSort.options = {
        sortType: "bubble",         // string for type of sort
        highlightColor: "red",      // highlight color (none sets no highlight)
        sortedColor: "blue",        // sorted color (none sets to no highlight)
        animColor: true,            // whether or not color should be animated (requires jquery.color.src or jquery ui)
        stepTime: 1000,             // ms between animation steps
        listType: "existing",       // "existing", object for random , array
        animTrig: "none",           // animation trigger "none" loads on document, object for event and selector
        resetTrig: "none",          // trigger to reset and reinitialize
        callback: null              // callback after animation completes

    }

})(jQuery, window, document);