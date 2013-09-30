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
            self.animateColor = jQuery.Color ? true : false;
            self.stepTime = self.options.stepTime;
            self.slideTime = self.stepTime*(2.0/3);
            self.swapTime = self.stepTime*(15.0/24);
            self.colorTime = self.stepTime*(0.5);
            self.sortAlgorithm = self.options.sortAlgorithm;
            self.listType = self.options.listType;
            self.animationTrigger = self.options.animationTrigger;
            self.resetTrigger = self.options.resetTrigger;
            self.callback = self.options.callback;
            self.animSteps = [];
        },

        // Initialize HTML List and Generate Animation Constants

        initList: function() {
            var list = [];
            var self = this;
            self.numbers = self.$elem.find("li");
            self.initialColor = self.numbers.eq(0).css("color");
            self.initialFontSize = self.numbers.eq(0).css("font-size");
            self.slideDistance = Number(self.initialFontSize.substring(0, self.initialFontSize.length-2))*2;
            self.$elem.find("li").each(function() {
                list.push(Number($(this).text()));
                $(this).css({"position": "relative", "top": 0, "left": 0});
                if (self.highlightColor !== null && self.sortedColor !== null){
                    $(this).attr('sorted', 'false');
                }
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

        setSorted: function(i) {
            var self = this;
            self.highlight([i], self.sortedColor);
          },

        highlight: function(array, color){
            var self = this;
            if (color !== null){
                // color if number not already in sorted position
                self.animSteps.push(function() {
                    //animate colors if jquery color plugin is present
                    var $liSel = self.numbers.eq(array[0]).add(self.numbers.eq(array[1]));
                    if (self.numbers.eq(0).attr('sorted')) {
                        $liSel = $liSel.filter("[sorted='false']");
                    }
                    if (self.animateColor){
                        $liSel.animate({color: color}, self.colorTime, function() {
                            if (color === self.sortedColor) {
                                $liSel.attr('sorted', 'true');
                            }
                        });
                    } else {
                        $liSel.css("color", color);
                        if (color === self.sortedColor) {
                            $liSel.attr('sorted', 'true');
                        }
                    }
                });
            }
        },

        addHighlightColor: function(array) {
            var self = this;
            self.highlight(array, self.highlightColor);
        },

        removeHighlightColor: function(array) {
            var self = this;
            self.highlight(array, self.initialColor);
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
            self.slide(array, self.slideDistance);
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
                var li1_sorted = $li1.attr("sorted");
                var li2_sorted = $li2.attr("sorted");

                // animate swap
                $li1.animate({top: li2_pos-li1_pos}, self.swapTime, function() {
                    $li1.css({top: 0, left: li2_left, color: li2_color});
                    $li1.text(li2_val);
                    $li1.attr("sorted", li2_sorted);
                });
                $li2.animate({top: li1_pos-li2_pos}, self.swapTime, function() {
                    $li2.css({top: 0, left: li1_left, color: li1_color});
                    $li2.text(li1_val);
                    $li2.attr("sorted", li1_sorted);
                });
            });
        },

        slideSwap: function(list, i1, i2) {
            var self = this;
            self.slideOut([i1, i2]);
            self.swap(list, i1, i2);
            self.slideIn([i1,i2]);
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
                        self.slideSwap(list, i, i+1);
                    }
                    self.removeHighlightColor([i, i+1]);
                }
                self.setSorted(n-1);
            }
            self.setSorted(0);
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
                    self.removeHighlightColor([i]);
                }
                if (min !== n){
                    self.addHighlightColor([min]);
                    self.slideSwap(list, n, min);
                }
                self.removeHighlightColor([min, n]);
                self.setSorted(n);
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
                self.removeHighlightColor([pos]);
                self.setSorted(pos);
            }
        },

        quick: function(list) {
            var self = this;
            var len = list.length;

            function partition(array, begin, end, pivot) {
                var pivotValue = array[pivot];
                self.addHighlightColor([pivot]);
                if (pivot !== end) {
                    self.slideSwap(array, pivot, end);
                }
                var store = begin;
                for (var n = begin; n < end; n++) {
                    self.addHighlightColor([n]);
                    if (array[n] < pivotValue) {
                        if (store !== n) {
                            self.slideSwap(array, store, n);
                            self.removeHighlightColor([store]);
                        }
                        else {
                            self.removeHighlightColor([n]);
                        }
                        store++;
                    }
                    else {
                        self.removeHighlightColor([n]);
                    }
                }
                if (end !== store) {
                    self.slideSwap(array, end, store);
                }
                self.removeHighlightColor([store]);
                self.setSorted(store);
                return store;
            }

            function quickSort(array, begin, end) {
                if (end > begin) {
                    var pivot = begin+Math.floor(Math.random()*(end-begin));
                    pivot = partition(array, begin, end, pivot);

                    quickSort(array, begin, pivot);
                    quickSort(array, pivot+1, end);
                }
                else {
                    self.setSorted(begin);
                }
            }

            quickSort(list, 0, len-1);
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
            sort[sort.sortAlgorithm](sort.initList());
            if (typeof(sort.callback) === "function"){
                var self = this;
                sort.animSteps.push(function(){sort.callback.call(self)});
            }
            if (sort.animationTrigger !== null){
                $(document).on(sort.animationTrigger.event, sort.animationTrigger.selector, function() {
                    sort.animation();
                });
            }
            else {
                sort.animation();
            }
            if (sort.resetTrigger !== null){
                $(document).on(sort.resetTrigger.event, sort.resetTrigger.selector, function() {
                    sort.$elem.find("ul").eq(0).remove();
                    sort.options.listType = sort.list;
                    sort.$elem.animatedSort(sort.options);
                });
            }
        });
    };

    $.fn.animatedSort.options = {
        sortAlgorithm: "bubble",    // string for type of sort
        highlightColor: "red",      // highlight color (null sets no color)
        sortedColor: "blue",        // sorted color (null sets to no color)
        stepTime: 1000,             // ms between animation steps
        listType: "existing",       // "existing", object for random , array
        animationTrigger: null,     // animation trigger "none" loads on document, object for event and selector
        resetTrigger: null,         // trigger to reset and reinitialize
        callback: null              // callback after animation completes
    };

})(jQuery, window, document);