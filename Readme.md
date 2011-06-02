jQRangeSlider & jQDateRangeSlider
=================================
A javascript slider selector that supports dates

* [Project page](http://ghusse.github.com/jQRangeSlider/)
* [Github project](https://github.com/ghusse/jQRangeSlider/)
* [Online demo](http://ghusse.github.com/jQRangeSlider/stable/demo/)
* [Unit tests](http://ghusse.github.com/jQRangeSlider/stable/tests/)

License
-------
Copyright : Guillaume Gautreau 2010
License : GPL v3. Contact me for using this library in another context

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


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
    	<script type="text/javascript" src="jQAllRangeSliders.js"></script>
Range slider creation:
	$("#element").dateRangeSlider({/*options*/});

Options
-------

* bounds (default: 0 - 100)
	* Inclusive bounds of the selection range
	* object with two [numerical] fields : min and max
	* example: bounds: {min: 0, max:100}
* defaultValues (default: 20 - 50)
	* Default selected range inside defined bounds
	* object with two [numerical] fields : min and max
	* example: defaultValues: {min: 20, max:50}
* wheelMode: (default: null)
	* Interaction mode when user uses the mouse wheel on the central bar
	* Possible values : "zoom", "scroll" or null
* wheelSpeed: (default: 4)
	* Numerical speed (in % of selected range) of mouse wheel interaction
* arrows: (default: true)
	* boolean value that activate or disactivate scrolling arrows
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
* values(min, max) : get or set the values
* min(value): get or set the minimum value
* max(value): get or set the maximum value
 
Prerequisites 
-------------
* Element on which .rangeSlider() is applied will be positioned as relative if no positioning is set.
* jQDateRangeSlider.js is only needed by the dateRangeSlider widget.
* jQRangeSlider.js is needed by both widgets

Generating minified jQRangeSlider files
---------------------------------------
Launch min/compile.sh (on Linux or Mac) or min/compile.bat (on Windows).

Changelog
---------
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
