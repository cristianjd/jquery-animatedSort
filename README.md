# Description

jQuery plugin that animates the sorting of an HTML list using various options including the algorithm to be used.

# Installation

## Dependencies

- [jQuery](http://codeorigin.jquery.com/jquery-1.10.2.min.js) required.
- [jQuery Color](http://codeorigin.jquery.com/color/jquery.color.plus-names-2.1.2.min.js) or [jQuery UI](http://codeorigin.jquery.com/ui/1.10.3/jquery-ui.min.js) required for color animation. If not preset colors will not fade into each other.

## Script
Include animated sort script into HTML file after dependencies.

    <script type="text/javascript" src="jquery.animatedSort.js"></script>

# Documentation

## Basic Usage
To animate the sorting of an html list within div with id of "selector" with default behavior:

    $('#selector').animatedSort();

An options object can be passed in to override default behavior. The code above is equivalent to:

    $('#selector').animatedSort({
        listType: 'existing',
        sortAlgorithm: 'bubble',
        stepTime: 1000,
        highlightColor: 'red',
        sortedColor: 'blue',
        animationTrigger: null,
        resetTrigger: null,
        callback: null
    });

See below for a list of the possible options.

## Options

### List Type
Specify whether to use a list already in the HTML or to create a new one randomly or from an array.

- `listType: 'existing'`                                 Use an existing contained in the selector. *Default.*
- `listType: [3, 6, 7, 22, 45, 74, 51, 33, 24, 11]`      Generate list in selector with values from array.
- `listType: {bottom: 0, top: 100, length: 10}`          Generate list in selector with 10 random numbers from 0 to 100.

### Sort Algorithm
Specify which sort algorithm to use in animation.

- `sortAlgorithm: 'bubble'`     Use bubble sort. *Default.*
- `sortAlgorithm: 'selection'`  Use selection sort.
- `sortAlgorithm: 'insertion'`  Use insertion sort.
- `sortAlgorithm: 'quick'`      Use quick sort.

### Step Time
Specify the time in millisecond between each step (color, slide, swap) in the animation

- `stepTime: 1000`              Set time between each step to 1000 milliseconds. *Default.*

### Highlight Color
Specify which color to use to highlight the values being compared. Accepts a string naming the color in name, hex, or rgb formats.

- `highlightColor: 'red'`       Set highlight color to red. *Default.*
- `highlightColor: null`        No highlight color.

### Sorted Color
Specify which color to use to show which values have been sorted. Accepts a string naming the color in name, hex, or rgb formats.

- `highlightColor: 'blue'`      Set sorted color to blue. *Default.*
- `highlightColor: null`        No sorted color.

### Animation Trigger
Specify a selector and event used to trigger the start of animation.

- `animationTrigger: null`                                  No animation trigger. Starts on document ready. *Default.*
- `animationTrigger: {event: click, selector: '#selector'}`  Begin animation when '#selector' is clicked.

### Reset Trigger
Specify a selector and event used to trigger the reset of the list to its initial state.

- `resetTrigger: null`                                  No reset trigger. *Default.*
- `resetTrigger: {event: click, selector: '#selector'}`  Reset list when '#selector' is clicked.

### Callback Function
Specify a function to be called after the animation is complete.

- `callback: null`                                                  No callback function. *Default.*
- `callback: function() {$(this).css("background-color", "gray")}`  Sets the background of the element containing the list to gray after the animation is complete.

## Demo
See [demo](/demo/index.html) to view examples of the plugin in action.