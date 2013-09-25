jasmine.getFixtures().fixturesPath = 'spec';

describe("Animated Sort Plugin", function() {
    it("exists", function() {
        expect(typeof($.fn.animatedSort)).toEqual('function');
    });

    describe("list types", function() {

        describe("existing list", function() {
            it("correctly initializes margins", function() {
                $('#existing').animatedSort();
                expect($('#existing')).toHaveListCss([0,1,2,3,4,5,6,7,8,9,10,11], {position: "relative", top: "0px", left: "0px"});
            });
        });

        describe("new list", function() {
            it("correctly generates list from array", function() {
                $('#new').animatedSort({listType: [5,4,9,7,3,2,6,1,2,4,5,8]});
                expect($('#new')).toHaveListItems([5,4,9,7,3,2,6,1,2,4,5,8]);
            });
        });

        describe("random list", function() {
            it("correctly generates random list", function() {
                $('#new').animatedSort({listType: {bottom: 50, top: 100, length: 12}});
                expect($('#new')).toHaveRandomListItems(50, 100, 12);
            });
        });
    });

    describe("sort types", function() {

        describe("bubble sort", function() {
            it("correctly sorts list", function() {
                jasmine.Clock.useMock();
                $('#existing').animatedSort({sortType: "bubble", stepTime: 1});
                jasmine.Clock.tick(10000);
                expect($('#existing')).toHaveListItems([3,8,11,16,23,33,44,51,62,70,85,99])
            });
        });

        describe("selection sort", function() {
            it("correctly sorts list", function() {
                jasmine.Clock.useMock();
                $('#existing').animatedSort({sortType: "selection", stepTime: 1});
                jasmine.Clock.tick(10000);
                expect($('#existing')).toHaveListItems([3,8,11,16,23,33,44,51,62,70,85,99])
            });
        });

        describe("insertion sort", function() {
            it("correctly sorts list", function() {
                jasmine.Clock.useMock();
                $('#existing').animatedSort({sortType: "insertion", stepTime: 1});
                jasmine.Clock.tick(10000);
                expect($('#existing')).toHaveListItems([3,8,11,16,23,33,44,51,62,70,85,99])
            });
        });

        describe("quick sort", function() {
            it("correctly sorts list", function() {
                jasmine.Clock.useMock();
                $('#existing').animatedSort({sortType: "quick", stepTime: 1});
                jasmine.Clock.tick(10000);
                expect($('#existing')).toHaveListItems([3,8,11,16,23,33,44,51,62,70,85,99])
            });
        });
    });
});