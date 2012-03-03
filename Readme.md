jQRangeSlider, jQDateRangeSlider & jQEditRangeSlider
====================================================
A javascript slider selector that supports dates

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
+ jQuery UI draggable
+ jQuery Mousewheel plugin by Brandon Aaron (optional, needed for scrolling or zooming)

Usage
-----
# A rangeSlider widget with float values
Javascript reference for development:

	<script type="text/javascript" src="jQRangeSlider.js"></script>

Javascript reference for production:

  <script type="text/javascript" src="jQRangeSlider-min.js"></script>

Range slider creation:

	$("#element").rangeSlider({/*options*/});

# A rangeSlider with dates 
Javascript reference for development:

	<script type="text/javascript" src="jQRangeSlider.js"></script>
	<script type="text/javascript" src="jQDateRangeSlider.js"></script>

Javascript reference for production:

  <script type="text/javascript" src="jQAllRangeSliders-min.js"></script>

Range slider creation:

	$("#element").dateRangeSlider({/*options*/});

# A editable range slider
Javascript reference for development:

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
* round: (false or a number used for rounding)
	* false to deactivate
	* a number used for formatting the displayed values in inputs
	* if a custom formatter function is provided, this parameter is ignored

Events
-----
* valuesChanging
 * Triggered when the user is moving an element and changing internal values
 * Triggered a lot of times during the move
* valuesChanged
 * Triggered when the user has moved and element and changed internal values (limits the number of events).
* minValueChanging/maxValueChanging
	* Triggered when the minimum/maximum selected value is starting to change (only fired once during a move)
* minValueChanged/maxValueChanged
	* Triggered has the minimum/maximum selected value have been changed, at the end of the move.

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
### Is it possible to set steps?

You can set value steps simply by providing a custom formatter function that rounds values according to your needs. This way, **displayed values** will be rounded, but not actual values (you'll have to round again before using them).

For instance:

	$("#slider").rangeSlider({
		formatter: function(value){
			var step = 10;

			return Math.round(value / step) * step;
		}
	});

On the other hand, it's not possible to set graphical steps when moving the range or its ends.

Changelog
---------
* 3.0.2: 2012-03-03
	* EditSlider: set values on focus lost
	* editSlider unit tests
* 3.0.1: 2012-03-02
  * Errors in package construction
* 3.0: 2012-03-01
  * **New type of slider**: edit range slider!
  * Packaging minified version of individual files
* 2.4: 2012-02-23
	* Dual license GPL and MIT
	* Small refactoring, allowing to create a modifiable range slider
* 2.3: 2011-11-27
	* Issue #14: limit the range with a minimum or maximum range length.
	* Added the range option
	* New public method for getting / setting bounds
	* use strict
* 2.2.1: 2011-11-15
	* Issue #12: impossible to drag the left handle to the max value
* 2.2: 2011-09-27
	* Issue #11: resize public method added
* 2.1.4: 2011-09-19
  * Issue #10: remove z-ordering
* 2.1.3: 2011-09-07
  * Issue #8 fix: Problem with minified version
  * Script for creating minified package
* 2.1.2: 2011-06-02
	* Issue #6: CSS fix
* 2.1.1: 2011-05-20
  * Integrated Google Closure compiler and script for generating minified version of jQRangeSlider
* 2.1: 2011-03-28 
  * Changed helpers name to labels (API change)
  * Labels replaced inside the top level parent element
* 2.0.2: 2011-03-23 bugfix
* 2.0.1: 2011-03-17 bugfix
* 2.0: 2011-03-14 
	* Value helpers
	* New events: min/maxValueChanging and min/maxValueChanged
	* Bugfixes
	* Unit tests
* 1.1.1: 2011-03-04 bugfixes on public methods
* 1.1  : 2011-03-03 Added methods for setting and getting only one value
* 1.0.2: 2011-03-03 Set values fix
* 1.0.1: 2011-03-02 Fix for IE8
* 1.0  : 2010-12-28 Initial release
