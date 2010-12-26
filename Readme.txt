jQRangeSlider
A javascript slider selector that supports dates

# License

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


# Dependencies

jQuery
jQuery UI core
jQuery UI widget
jQuery UI draggable
jQuery Mousewheel plugin by Brandon Aaron (optional, needed for scrolling or zooming)

# Options
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

# Events
 * valuesChanging
   * Triggered when the user is moving an element and changing internal values
 * valuesChanged
   * Triggered when the user has moved and element and changed internal values (limits the number of events).

# Methods
 * scrollLeft(quantity)
 * scrollRight(quantity)
 * zoom(quantity)
 * unzoom(quantity)
 
# Prerequisites 
 * Element on which .rangeSlider() is applied will be positioned as relative if no positioning is set.
