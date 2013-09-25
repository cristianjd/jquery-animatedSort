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
            var len = indices.length;
            var list = this.actual.find('li');
            for (var n = 0; n < len; n++) {
                var item = list.eq(indices[n]);
                for (var prop in cssObj) {
                    if (item.css(prop) !== cssObj[prop]) {
                        return false
                    }
                }
            }
            return true;
        }
    });
    loadFixtures('fixture.html');
});