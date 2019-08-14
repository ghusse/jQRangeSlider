## jQRangeSlider

- 5.8.0: 2019-08-14
  - Fixed #233: Differentiate left and right labels and merge if identical (author: @BistroStu)
- 5.7.2: 2016-01-18
  - Fixed #194: IE8: 'this.cache.click.left' is null or not an object
  - Fixed #206: Negative wheelSpeed not accepted
  - Fixed #202: Prevent destroyed slider from running its resize handler
  - Fixed #199: Use svg instead of png to get better image quality
- 5.7.1: 2015-01-23
  - Fixed #174: Touch and jquery-ui 1.11.0 (not working)
- 5.7.0: 2014-03-18
  _ Enhancement #154:
  _ Introduced a new option "symmetricPositionning" for a different way of positionning handles
  _ Allowed minimum ranges to be 0
  _ Fixed #152: Calling resize on an hidden slider resets values
  _ Fixed #146: Inverted labels in small ranges
  _ Fixed #153 Edit range slider does not parse float number correctly
- 5.6.0: 2014-02-01
  _ Fixed #144: Inverted label order with small range
  _ Fixed #146: Setting values via the `min`, `max`, or `values` methods produces an invalid slider
- 5.5.0: 2013-11-01
  _ Fixed #124: Scales and slider position don't line up
  _ Fixed #141: userValuesChanged event not fired when user edits input value
  _ Fixed #142: Labels don't show up the first time after a programmatically value change
  _ Fixed #143: Changing formatter causes labels to disappear
- 5.4.0: 2013-09-16
  _ Fixed #128: Using the mouse wheel changes the values, even if slider is disabled
  _ Fixed #130: Labels don't disappear when values changed in code
  _ Fixed #133: Step in weeks breaks the slider
  _ Fixed #123: Incorrect values after switching handles
- 5.3.0: 2013-07-12 \* Fixed #54: Add enabled option, enable/disable function to allow read-only sliders
- 5.2.0: 2013-06-28
  _ Fixed #108: Memory leaks when calling destroy
  _ Styling improvement: setting correct height to the slider element.
- 5.1.1: 2013-03-17
  _ Fixed #100: Inconsistent parameter type passed to the next method of scales.
  _ Fixed #102: valuesChanged event triggered even if values are identical
  _ Fixed #103: CSS bug related to IE7 and scale ticks
  _ Fixed #104: Resizing the window breaks label position \* Fixed #105: Tick appear outside of its container
- 5.1.0: 2013-03-23 \* Ticks formatting, with a new callback function: format
- 5.0.2: 2013-03-17 \* Fixed #93 (theming with scales): ticks and handle values desynchronized on the right
- 5.0.1: 2013-03-07 \* Fixed #90 dateRangeSlider displayed outside of the innerbar when setting the range
- 5.0: 2013-02-09
  _ Scales
  _ New element in handles, can be used for styling. ui-range-slider-handle-inner
- 4.2.10: 2013-02-08 \* Fixed #79: Bar not correctly updated after window resizing, with auto margin on container
- 4.2.9: 2013-01-17 \* Technical release: modified manifest to appear in plugins.jquery.com
- 4.2.8: 2013-01-16 \* Fixed #73: Can't always set the slider values programatically
- 4.2.7: 2013-01-03 \* Fixed #71: Labels not hidden when scrolling with arrows
- 4.2.6: 2012-11-30 \* Fixed #59: NaN value in date slider
- 4.2.5: 2012-11-28
  _ Fixed #58: Date labels are shifted after parent resize, even after calling resize method
  _ Fixed #35: Event drag (used internally) conflicts with other libraries. Renamed to sliderDrag.
- 4.2.4: 2012-11-19
  _ Fixed a bug in resize method, when displaying a slider in a previously hidden parent.
  _ Bug in label positionning
- 4.2.3: 2012-11-16
  _ Fixed #52 and #53: Labels shown when valueLabels option set to "change"
  _ Fixed #51: right label display bug in Chrome
- 4.2.2: 2012-11-08
  _ Fixed #46: Labels swap when they are very close
  _ Fixed #45: Access to a property of a null object \* Fixed #49: UserValuesChanged event fired when changing values programmatically
- 4.2.1: 2012-10-04
  _ Fixed wheelmode setter in constructor
  _ Documentation update
- 4.2: 2012-06-18 \* Draggable labels (Issue #28)
- 4.1.2: 2012-06-11 \* Fixed #29: range option in constructor is not working
- 4.1.1: 2012-06-07 \* Step option is not working in constructor
- 4.1: 2012-05-31
  _ New theme: iThing
  _ Bug fixes on IE
- 4.0: 2012-05-26
  _ Massive rewrite of jQRangeSlider
  _ Steps !
  _ Native support of touch devices (tested on iOS and Android)
  _ Removed min/max values Changing/Changed events. Use valuesChanged or valuesChanging instead. \* Event log in demo
- 3.2: 2012-05-22 \* Bug #27, generate better input names for editSlider. Names are based on the element id.
- 3.1.1: 2012-05-07 eonlepapillon \* Fixed bug #22: Event 'userValuesChanged' is not triggered after zooming with wheelmouse
- 3.1: 2012-04-16 nouvak@gmail.com \* Added the new "userValuesChanged" event that is triggered only on the value changes that were initiated by the user ( e.g. by modifying the range with the mouse).
- 3.0.2: 2012-03-03
  _ EditSlider: set values on focus lost
  _ editSlider unit tests
- 3.0.1: 2012-03-02
  - Errors in package construction
- 3.0: 2012-03-01
  - **New type of slider**: edit range slider!
  - Packaging minified version of individual files
- 2.4: 2012-02-23
  _ Dual license GPL and MIT
  _ Small refactoring, allowing to create a modifiable range slider
- 2.3: 2011-11-27
  _ Issue #14: limit the range with a minimum or maximum range length.
  _ Added the range option
  _ New public method for getting / setting bounds
  _ use strict
- 2.2.1: 2011-11-15 \* Issue #12: impossible to drag the left handle to the max value
- 2.2: 2011-09-27 \* Issue #11: resize public method added
- 2.1.4: 2011-09-19
  - Issue #10: remove z-ordering
- 2.1.3: 2011-09-07
  - Issue #8 fix: Problem with minified version
  - Script for creating minified package
- 2.1.2: 2011-06-02 \* Issue #6: CSS fix
- 2.1.1: 2011-05-20
  - Integrated Google Closure compiler and script for generating minified version of jQRangeSlider
- 2.1: 2011-03-28
  - Changed helpers name to labels (API change)
  - Labels replaced inside the top level parent element
- 2.0.2: 2011-03-23 bugfix
- 2.0.1: 2011-03-17 bugfix
- 2.0: 2011-03-14
  _ Value helpers
  _ New events: min/maxValueChanging and min/maxValueChanged
  _ Bugfixes
  _ Unit tests
- 1.1.1: 2011-03-04 bugfixes on public methods
- 1.1 : 2011-03-03 Added methods for setting and getting only one value
- 1.0.2: 2011-03-03 Set values fix
- 1.0.1: 2011-03-02 Fix for IE8
- 1.0 : 2010-12-28 Initial release
