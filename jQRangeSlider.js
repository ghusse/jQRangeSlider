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
				.draggable({axis:"x"});
			this._leftHandle = $("<div class='ui-rangeSlider-handle  ui-rangeSlider-leftHandle' />")
				.draggable({axis:"x"});
			this._rightHandle = $("<div class='ui-rangeSlider-handle ui-rangeSlider-rightHandle' />")
				.draggable({axis:"x"});
			
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
		
		_position: function(){
			var width = this.element.innerWidth();
			
			var leftPosition = (this.values.min - this.options.bounds.min)*width / (this.options.bounds.max - this.options.bounds.min);
			var rightPosition = (this.values.max - this.options.bounds.min)*width / (this.options.bounds.max - this.options.bounds.min);
			
			this._leftHandle.css("left", leftPosition);
			this._rightHandle.css("left", rightPosition);
			this._bar.css("left", leftPosition).css("width", rightPosition-leftPosition);
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