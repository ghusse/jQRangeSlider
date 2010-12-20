/* jQRangeSlider
 * A javascript slider selector that supports dates
 * 
 * Copyright (C) Guillaume Gautreau 2010
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 
 (function ($, undefined) {
	$.widget("ui.rangeSlider", $.ui.draggable, {
		options: {
			bounds: {min:0, max:100},
			defaultValues: {min:20, max:50},
			theme: "dev"
		},
		
		values: {min:20, max:50},
		
		// Created elements
		_bar: null,
		_leftHandle: null,
		_rightHandle: null,
		
		_create: function(){
			this._bar = $("<div class='ui-rangeSlider-Bar' />")
				.draggable({axis:"x", containment: "parent", drag: $.proxy(this._barMoved, this)})
				.css("position", "absolute");
			this._leftHandle = $("<div class='ui-rangeSlider-handle  ui-rangeSlider-leftHandle' />")
				.draggable({axis:"x", containment: "parent"})
				.css("position", "absolute");
			this._rightHandle = $("<div class='ui-rangeSlider-handle ui-rangeSlider-rightHandle' />")
				.draggable({axis:"x", containment: "parent"})
				.css("position", "absolute");
			
			this.element
				.append(this._bar)
				.append(this._leftHandle)
				.append(this._rightHandle)
				.addClass("ui-rangeSlider");
			
			if (this.options.theme != "")
			{
				this.element.addClass("ui-rangeSlider-"+this.options.theme);
			}
			
			this._position();
		},
		
		_setOption: function(key, value) {
			if (key == "defaultValues")
			{
				if ((typeof value.min != "undefined") 
					&& (typeof value.max != "undefined") 
					&& parseFloat(value.min) === value.min 
					&& parseFloat(value.max) === value.max)
				{
					this.values.min = value.min;
					this.values.max = value.max;
					
					this._position();
				}
			}
		},
		
		_getPosition: function(value){
			return (value - this.options.bounds.min) * this.element.innerWidth() / (this.options.bounds.max - this.options.bounds.min);
		},
		
		_getValue: function(position){
			return position * (this.options.bounds.max - this.options.bounds.min) / this.element.innerWidth() + this.options.bounds.min;
		},
		
		_position: function(){
			var leftPosition = this._getPosition(this.values.min);
			var rightPosition = this._getPosition(this.values.max);
			
			this._positionHandles(leftPosition, rightPosition);
			this._bar.css("left", leftPosition).css("width", rightPosition-leftPosition);
		},
		
		_positionHandles: function(leftPos, rightPos){
			// TODO : position on their centers
			this._leftHandle.css("left", leftPos);
			this._rightHandle.css("left", rightPos);
		},
		
		_barMoved: function(){
			var left = this._bar.position().left;
			var right = left + this._bar.outerWidth();
			this.values.min = this._getValue(left);
			this.values.max = this._getValue(right);
			
			this._positionHandles(left, right);
		},
		
		_handleMoved: function(){
			// TODO
		},
		
		destroy: function(){
			this._bar.detach();
			this._leftHandle.detach();
			this._rightHandle.detach();
			this.element.removeClass("ui-rangeSlider");
			
			if (this.options.theme != "")
			{
				this.element.removeClass("ui-rangeSlider-"+this.options.theme);
			}
		}
	});
})(jQuery);