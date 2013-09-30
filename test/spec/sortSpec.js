jasmine.getFixtures().fixturesPath = 'spec';

describe("Animated Sort Plugin", function() {
    it("exists", function() {
        expect(typeof($.fn.animatedSort)).toEqual('function');
    });

    describe("list types", function() {

        describe("existing list", function() {
            beforeEach(function() {
                $('#existing').animatedSort();
            });

            it("correctly initializes margins", function() {
                expect($('#existing')).toHaveListCss("all", {position: "relative", top: "0px", left: "0px"});
            });

            it("sets sorted flag to false", function() {
                expect($('#existing')).toHaveListAttr('sorted','false');
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

    describe("sort algorithms", function() {

        expectListToBeSortedWith("bubble");
        expectListToBeSortedWith("selection");
        expectListToBeSortedWith("insertion");
        expectListToBeSortedWith("quick");
    });

    describe("colors", function() {

        describe("sorted color", function() {
            it("is applied to all items in sorted list", function() {
                $('#existing').animatedSort({stepTime: 1});
                jasmine.Clock.tick(10000);
                expect($('#existing')).toHaveListCss("all", {color: "rgb(0, 0, 255)"});
            });

            describe("when set to null", function() {
                beforeEach(function() {
                    $('#existing').animatedSort({stepTime: 1, sortedColor: null});
                });

                it("is not applied to list", function() {
                    expect($('#existing')).toHaveListCss("all", {color: "rgb(0, 0, 0)"});
                });
            });
        });

        describe("highlight color", function() {
            it("is applied to compared item", function() {
                $('#existing').animatedSort({stepTime: 100});
                jasmine.Clock.tick(350);
                expect($('#existing')).toHaveListCss([1], {color: 'rgb(255, 0, 0)'});
            });
        });
    });

    describe("triggers", function() {

        describe("animation trigger", function() {
            beforeEach(function() {
                $('#existing').animatedSort({stepTime: 1, animationTrigger: {event: "click", selector: "#new"}});
                jasmine.Clock.tick(1000);
            });

            describe("before trigger", function() {
                it("list should be in initial state", function() {
                    expectListToNotBeSorted();
                });
            });

            describe("after trigger", function() {
                it("list should be sorted", function() {
                    $('#new').trigger("click");
                    jasmine.Clock.tick(10000);
                    expectListToBeSorted();
                });
            });
        });

        describe("reset trigger", function() {
            beforeEach(function() {
                $('#existing').animatedSort({stepTime: 1, resetTrigger: {event: "click", selector: "#new"}});
                jasmine.Clock.tick(1000);
            });

            describe("before trigger", function() {
                it("list should be sorted", function() {
                    expectListToBeSorted();
                });
            });

            describe("after trigger", function() {
                it("list should return to initial state", function() {
                    $('#new').trigger("click");
                    jasmine.Clock.tick(1);
                    expectListToNotBeSorted();
                });
            });
        });
    });

    describe("callback", function() {
        var callback;

        beforeEach(function() {
            callback = jasmine.createSpy();
            $('#existing').animatedSort({stepTime: 1, callback: callback});
        });
        describe("before animation", function() {
            it("callback should not be called", function() {
                expect(callback).not.toHaveBeenCalled();
            });
        });

        describe("after animation", function() {
            it("callback should be called", function() {
                jasmine.Clock.tick(10000);
                expect(callback).toHaveBeenCalled();
            });
        });
    });
});