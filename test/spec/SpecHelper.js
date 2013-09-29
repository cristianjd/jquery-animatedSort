beforeEach(function() {
    this.addMatchers({
        toHaveListItems: function (array) {
            var len = array.length;
            var list = this.actual.find('li');
            for (var n = 0; n < len;  n++) {
                if (list.eq(n).text() != array[n]) {
                    return false;
                }
            }
            return true;
        },
        toHaveRandomListItems: function (bottom, top, length) {
            var list = this.actual.find('li');
            for (var n = 0; n < length; n++) {
               var number = Number(list.eq(n).text());
               if (number < bottom || number > top) {
                   return false;
               }
            }
            return true;
        },
        toHaveListCss: function (indices, cssObj) {
            var list = this.actual.find('li');
            var len, all, item;
            if (typeof(indices) === "string") {
                len = list.length;
                all = true;
            }
            else {
                len = indices.length;
                all = false;
            }
            for (var n = 0; n < len; n++) {
                if (all) {
                    item = list.eq(n);
                }
                else {
                    item = list.eq(indices[n]);
                }
                for (var prop in cssObj) {
                    if (item.css(prop) !== cssObj[prop]) {
                        return false;
                    }
                }
            }
            return true;
        },
        toHaveListAttr: function(attrName, attrValue) {
            var list = this.actual.find('li');
            var len = list.length;
            for (var n = 0; n < len; n++) {
                if (list.eq(n).attr(attrName) !== attrValue) {
                    return false;
                }
            }
            return true;
        }
    });
    loadFixtures('fixture.html');
    jasmine.Clock.useMock();
    $.fx.off = true;
});

function expectListToBeSorted() {
    expect($('#existing')).toHaveListItems([3,8,11,16,23,33,44,51,62,70,85,99]);
}

function expectListToNotBeSorted() {
    expect($('#existing')).toHaveListItems([23,51,11,44,8,99,3,62,33,16,70,85]);
}

function expectListToBeSortedWith(algorithm) {
    describe(algorithm + " sort", function() {
        beforeEach(function() {
            $('#existing').animatedSort({sortAlgorithm: algorithm, stepTime: 1});
            jasmine.Clock.tick(10000);
        });

        it("correctly sorts list", function() {
            expectListToBeSorted();
        });

        it("adds sorted color to all items in list", function() {
            expect($('#existing')).toHaveListCss("all", {color: "rgb(0, 0, 255)"});
        });

        it("sets sorted flag to true", function() {
            expect($('#existing')).toHaveListAttr('sorted', 'true');
        });
    });
}