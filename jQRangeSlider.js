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
			theme: "dev",
			wheelMode: "zoom",
			wheelSpeed: 4,
			steps:{origin:0, step:10}
		},
		
		values: {min:20, max:50},
		
		// Created elements
		_bar: null,
		_leftHandle: null,
		_rightHandle: null,
		
		_create: function(){
			this._bar = $("<div class='ui-rangeSlider-Bar' />")
				.draggable({axis:"x", containment: "parent",
					drag: $.proxy(this._barMoved, this), 
					stop: $.proxy(this._barMoved, this)})
				.css("position", "absolute")
				.bind("mousewheel", $.proxy(this._wheelOnBar, this));
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
					this.setValues(value.min, value.max);
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
		
		_positionHandles: function(){
			this._leftHandle.css("left", this._getPosition(this.values.min) - this._leftHandle.outerWidth() / 2);
			this._rightHandle.css("left", this._getPosition(this.values.max) - this._leftHandle.outerWidth() / 2);
		},
		
		_barMoved: function(event){
			var left = this._bar.position().left;
			var right = left + this._bar.outerWidth();
			this.setValues(this._getValue(left), this._getValue(right));
		},
		
		_handleMoved: function(event){
			// TODO
		},
		
		_wheelOnBar: function(event, delta, deltaX, deltaY){
			if (this.options.wheelMode == "zoom"){
				var left = this._bar.position().left;
				var right = this._bar.innerWidth() + left;
				
				left -= deltaY * this.options.wheelSpeed;
				right += deltaY * this.options.wheelSpeed;
				
				if (left < 0){
					right -= left;
					left = 0;
				}
				
				if (right > this.element.innerWidth()){
					var difference = right - this.element.innerWidth();
					
					left = Math.max(0, left - difference);
					right = this.element.innerWidth();
				}
				
				this.setValues(this._getValue(left), this._getValue(right));
			}
		},
		
		_setValuesHandles: function(min, max){	
			this._setValues(min, max);
			this._positionHandles(min, max);
		},
		
		_setValues: function(min, max){
			if(this.options.steps != null 
				&& typeof this.options.steps["origin"] != "undefined"
				&& parseInt(this.options.steps["origin"]) == this.options.steps["origin"]
				&& typeof this.options.steps["step"] != "undefined"
				&& parseInt(this.options.steps["step"]) == this.options.steps["step"]
				&& this.options.steps["step"] != 0){
					min = Math.round((min - this.options.steps.origin) / this.options.steps.step) * this.options.steps.step + this.options.steps.origin;
					max = Math.round((max - this.options.steps.origin) / this.options.steps.step) * this.options.steps.step + this.options.steps.origin;
			}
			
			this.values.min = min;
			this.values.max = max;
			
			this.element.trigger("valuesChanged", [this.values.min, this.values.max]);
		},
		
		setValues: function(min, max){
			this._setValues(min, max);
			this._position();
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