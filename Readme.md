jQRangeSlider, jQDateRangeSlider & jQEditRangeSlider
====================================================
A javascript slider selector that supports dates and touch devices

* [Twitter](https://twitter.com/jQRangeSlider)
* [Project page](http://ghusse.github.com/jQRangeSlider/)
* [Github project](https://github.com/ghusse/jQRangeSlider/)
* [Online demo](http://ghusse.github.com/jQRangeSlider/stable/demo/)
* [Unit tests](http://ghusse.github.com/jQRangeSlider/stable/tests/)

License
-------
Copyright : Guillaume Gautreau 2010
License : Dual license GPL v3 and MIT

Dependencies
------------
+ jQuery
+ jQuery UI core
+ jQuery UI widget
+ jQuery Mousewheel plugin by Brandon Aaron (optional, needed for scrolling or zooming)

Usage
-----
# A rangeSlider widget with float values
Javascript reference for development:
	
	<script type="text/javascript" src="jQRangeSliderMouseTouch.js"></script>
	<script type="text/javascript" src="jQRangeSliderDraggable.js"></script>
	<script type="text/javascript" src="jQRangeSliderBar.js"></script>
	<script type="text/javascript" src="jQRangeSliderHandle.js"></script>
	<script type="text/javascript" src="jQRangeSliderLabel.js"></script>
	<script type="text/javascript" src="jQRangeSlider.js"></script>

Javascript reference for production:

  <script type="text/javascript" src="jQRangeSlider-min.js"></script>

Range slider creation:

	$("#element").rangeSlider({/*options*/});

# A rangeSlider with dates 
Javascript reference for development:

	<script type="text/javascript" src="jQRangeSliderMouseTouch.js"></script>
	<script type="text/javascript" src="jQRangeSliderDraggable.js"></script>
	<script type="text/javascript" src="jQRangeSliderBar.js"></script>
	<script type="text/javascript" src="jQRangeSliderHandle.js"></script>
	<script type="text/javascript" src="jQDateRangeSliderHandle.js"></script>
	<script type="text/javascript" src="jQRangeSliderLabel.js"></script>
	<script type="text/javascript" src="jQRangeSlider.js"></script>
	<script type="text/javascript" src="jQDateRangeSlider.js"></script>

Javascript reference for production:

  <script type="text/javascript" src="jQAllRangeSliders-min.js"></script>

Range slider creation:

	$("#element").dateRangeSlider({/*options*/});

# An editable range slider
Javascript reference for development:

	<script type="text/javascript" src="jQRangeSliderMouseTouch.js"></script>
	<script type="text/javascript" src="jQRangeSliderDraggable.js"></script>
	<script type="text/javascript" src="jQRangeSliderBar.js"></script>
	<script type="text/javascript" src="jQRangeSliderHandle.js"></script>
	<script type="text/javascript" src="jQRangeSliderLabel.js"></script>
	<script type="text/javascript" src="jQEditRangeSliderLabel.js"></script>
	<script type="text/javascript" src="jQRangeSlider.js"></script>
	<script type="text/javascript" src="jQEditRangeSlider.js"></script>

Javascript reference for production:

  <script type="text/javascript" src="jQAllRangeSliders-min.js"></script>

Range slider creation:

	$("#element").editRangeSlider({/*options*/});


Options
-------

### All sliders

* bounds (default: 0 - 100)
	* Inclusive bounds of the selection range
	* object with two [numerical] fields: min and max
	* example: bounds: {min: 0, max:100}
* defaultValues (default: 20 - 50)
	* Default selected range inside defined bounds
	* object with two [numerical] fields: min and max
	* example: defaultValues: {min: 20, max:50}
* range (default: false - false)
	* Range bounds, to constraint the range size
	* for date ranges, values are expressed in **milliseconds**
	* Possible values:
		* false or null to deactivate
		* object with to fields: min and max. Set a value to false to deactivate one constraint
	* examples: range: {min: 10, max: 50} or {min: 20} or {min: 20, max: false} or {max: false} or false
* step (default: false)
	* value steps, in order to constraint values
	* Numerical value (for rangeSlider and editSlider) or false
	* An object with some of these properties (for date slider):
		* years
		* months
		* days
		* hours
		* minutes
		* seconds
* wheelMode: (default: null)
	* Interaction mode when user uses the mouse wheel on the central bar
	* Possible values : "zoom", "scroll" or null
* wheelSpeed: (default: 4)
	* Numerical speed (in % of selected range) of mouse wheel interaction
* arrows: (default: true)
	* boolean value that activate or deactivate scrolling arrows
* valueLabels: ("show", "hide", default:"change")
	* string indicating if value labels have to be displayed
		* "show" indicates that labels must be visible
		* "hide" indicates that labels must be hidden
		* "change" indicates that labels only have to be shown when the user changes a value
* formatter: function(value) returning a string, default: null
	* a formatter function for displayed labels. When set to null, default formatter is used.
* durationIn: default:0
	* fadeIn duration in ms for showing labels on a value change
* durationOut: default:400 
	* fadeOut duration in ms for hiding labels after a change
* delayOut: default:200
	* delay before hiding labels after a change

### Edit slider only

* type (default:'text', 'number')
  * input type used for creating labels

### Usage
	// When constructing the slider
	$("#slider").rangeSlider({
		wheelSpeed: 5,
		valueLabels: "show",
		formatter: function(value){
			return value;
		}
	});
	
	// Changing an option, live
	$("#slider").rangeSlider("option", "wheelmode", "zoom");
	
	// If you are using a special kind of slider
	$("#slider").dateRangeSlider("option", "arrows", false);

Events
-----
* valuesChanging
 * Triggered when the user is moving an element and changing internal values
 * Triggered a lot of times during the move
* valuesChanged
 * Triggered when values have changed (user interaction or programmatically)
* userValuesChanged
 * Triggered when user has moved and element and changed internal values (limits the number of events).

### Usage
	$("#slider").bind("valuesChanging", function(){/*Your code*/});

Methods
-------
* scrollLeft(quantity)
* scrollRight(quantity)
* zoomIn(quantity)
* zoomOut(quantity)
* values(min, max): gets or sets the values
* min(value): gets or sets the minimum value
* max(value): gets or sets the maximum value
* resize
* bounds(min, max): gets or sets the bounds

### Usage
	// Set a value
	$("#slider").rangeSlider("min", value);
	
	// Get the value
	var max = $("#slider").rangeSlider("max");
	
	// If you're using another kind of slider
	var minDate = $("#slider").dateRangeSlider("min");
 
Prerequisites 
-------------
* Element on which .rangeSlider() is applied will be positioned as relative if no positioning is set.
* jQDateRangeSlider.js is only required by the dateRangeSlider widget.
* jQEditRangeSlider.js is only required for using the editRangeSlider widget
* jQRangeSlider.js is needed by all widgets

Generating minified jQRangeSlider files
---------------------------------------
Launch min/compile.sh (on Linux or Mac) or min/compile.bat (on Windows).

FAQ
---
### How can I use methods?

	// For range sliders, example with method "values" and two parameters
	$("#element").rangeSlider("values", 0, 100);
	
	// For edit sliders, a getter method
	var min = $("#element").editRangeSlider("min");
	
	// For date sliders, use date objects
	var max = $("#element").dateRangeSlider("max", new Date(2010, 0, 1));

### How to set options?

	// When constructing the slider (example with basic range slider)
	// Or after construction, the same method can be called
	$("#element").rangeSlider({
		bounds: {min: 10, max:100},
		wheelMode: "zoom",
		step: false
	});
	
	// After construction, for setting specific options (example with edit slider)
	$("#element").editRangeSlider("option", "arrows", true);
	
	// Another example with date slider
	$("#element").dateRangeSlider("option", "formatter", function(value){
		return "Nice date";
	});

### How to bind events?
	
	$("#element").bind("valuesChanging", function(event, values){
		// Do stuff
		// Values is an object with two properties: min and max.
	});

### Is it possible to set steps?

Guys, YES !

	$("#element").rangeSlider({
		// That's all you need
		step: 2
	});

### Is it possible to set steps for date range slider ?

Yes ! Take a look at examples below.

	// Use a 2 days step:
	$("#element").rangeSlider({
		step: { days: 2 }
	});

	// More complex (and useless) step, but stil valid
	$("#element").rangeSlider({
		step: {
			days: 2,
			hours: 3
		}
	});

Take a look at the documentation for other usable units.
