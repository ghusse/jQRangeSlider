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
			wheelMode: null,
			wheelSpeed: 8
		},
		
		_values: {min:20, max:50},
		
		// Created elements
		bar: null,
		leftHandle: null,
		rightHandle: null,
		containment: null,
		
		_create: function(){
			this.leftHandle = $("<div class='ui-rangeSlider-handle  ui-rangeSlider-leftHandle' />")
				.draggable({axis:"x", containment: "parent",
					drag: $.proxy(this._handleMoved, this), 
					stop: $.proxy(this._position, this),
					containment: "parent"})
				.css("position", "absolute");
			this.rightHandle = $("<div class='ui-rangeSlider-handle ui-rangeSlider-rightHandle' />")
				.draggable({axis:"x", containment: "parent",
					drag: $.proxy(this._handleMoved, this), 
					stop: $.proxy(this._position, this),
					containment: "parent"})
				.css("position", "absolute");
			this.bar = $("<div class='ui-rangeSlider-Bar' />")
				.draggable({axis:"x", containment: "parent",
					drag: $.proxy(this._barMoved, this), 
					stop: $.proxy(this._position, this)})
				.css("position", "absolute")
				.bind("mousewheel", $.proxy(this._wheelOnBar, this));
			
			this.element
				.append(this.bar)
				.append(this.leftHandle)
				.append(this.rightHandle)
				.addClass("ui-rangeSlider")
				.bind("mousewheel", $.proxy(this._wheelOnContainer, this));
			
			this.containment = $("<div class='ui-rangeSlider-containment'></div>")
				.css("position", "absolute")
				.css("border", "none")
				.css("margin", 0)
				.css("padding", 0)
				.css("height", this.element.innerHeight())
				.css("left", this.leftHandle.outerWidth(true))
				.css("z-index", -1000)
				.css("width", this.element.innerWidth() - this.rightHandle.outerWidth(true) - this.leftHandle.outerWidth(true));
			this.element.append(this.containment);
			
			this.bar.draggable("option", "containment", this.containment)
			
			this.values(this.options.defaultValues.min, this.options.defaultValues.max);
		},
		
		_setOption: function(key, value) {
			if (key == "defaultValues")
			{
				if ((typeof value.min != "undefined") 
					&& (typeof value.max != "undefined") 
					&& parseFloat(value.min) === value.min 
					&& parseFloat(value.max) === value.max)
				{
					this.values(value.min, value.max);
				}
			}
		},
		
		_getPosition: function(value){
			return (value - this.options.bounds.min) * (this.element.innerWidth() - 1) / (this.options.bounds.max - this.options.bounds.min);
		},
		
		_getValue: function(position){
			return position * (this.options.bounds.max - this.options.bounds.min) / (this.element.innerWidth() - 1) + this.options.bounds.min;
		},
		
		_position: function(){
			var leftPosition = this._getPosition(this._values.min);
			var rightPosition = this._getPosition(this._values.max);
			
			this._positionHandles();
			this.bar
				.css("left", leftPosition)
				.css("width", rightPosition- leftPosition + this.bar.width() - this.bar.outerWidth(true) + 1);
		},
		
		_positionHandles: function(){
			this.leftHandle.css("left", this._getPosition(this._values.min));
			this.rightHandle.css("left", this._getPosition(this._values.max) - this.rightHandle.outerWidth(true) + 1);
		},
		
		_barMoved: function(event, ui){
			var left = ui.position.left;
			var right = left + this.bar.outerWidth(true) - 1;
			
			this._setValues(this._getValue(left), this._getValue(right));
			this._positionHandles();
		},
		
		_switchHandles: function(){
				var temp = this.leftHandle;
				this.leftHandle = this.rightHandle;
				this.rightHandle = temp;
				
				this.leftHandle
					.removeClass("ui-rangeSlider-rightHandle")
					.addClass("ui-rangeSlider-leftHandle");
				this.rightHandle
					.addClass("ui-rangeSlider-rightHandle")
					.removeClass("ui-rangeSlider-leftHandle");
		},
		
		_handleMoved: function(event, ui){
			var min = this._values.min;
			var max = this._values.max;

			if (ui.helper[0] == this.leftHandle[0]){
					min = this._getValue(ui.position.left);
			}else if (ui.helper[0] == this.rightHandle[0])
			{
				max = this._getValue(ui.position.left - 1 + ui.helper.outerWidth(true));
			}else{
				return;
			}
			
			if (min > max){
				this._switchHandles();
				var temp = min;
				min = max;
				max = temp;
			}
				
			this.values(min, max);
		},
		
		_wheelOnBar: function(event, delta, deltaX, deltaY){
			if (this.options.wheelMode == "zoom"){
				var left = this.bar.position().left;
				var right = this.bar.outerWidth(true) + left - 1;
				
				left -= deltaY * this.options.wheelSpeed / 2;
				right += deltaY * this.options.wheelSpeed / 2;
				
				this.values(this._getValue(left), this._getValue(right));
				return false;
			}
		},
		
		_wheelOnContainer: function(event, delta, deltaX, deltaY){
			if (this.options.wheelMode == "scroll"){
				var left = this.bar.position().left;
				var right = this.bar.outerWidth(true) + left - 1;
				
				left -= deltaY * this.options.wheelSpeed;
				right -= deltaY * this.options.wheelSpeed;
				
				this.values(this._getValue(left), this._getValue(right));
				return false;
			}
		},
		
		_setValuesHandles: function(min, max){	
			this._setValues(min, max);
			this._positionHandles();
		},
	
		_setValues: function(min, max){	
			var diffMin = min - this.options.bounds.min;
			var diffMax = this.options.bounds.max - max;
			
			this._values.min = Math.max(this.options.bounds.min, Math.min(min, min + diffMax));
			this._values.max = Math.min(this.options.bounds.max, Math.max(max, max - diffMin));
			
			this.element.trigger("valuesChanged", {
	  	helper: this.element,
	  	values: {
	  		min: this._values.min,
	  		max: this._values.max
	  	}
	  });
		},
		
		values: function(min, max){
			if (typeof min != "undefined" 
				&& typeof max != "undefined")
			{
				this._setValues(min, max);
				this._position();
			}
			
			return this._values;
		},

		
		destroy: function(){
			this.bar.detach();
			this.leftHandle.detach();
			this.rightHandle.detach();
			this.element.removeClass("ui-rangeSlider");
			
			if (this.options.theme != "")
			{
				this.element.removeClass("ui-rangeSlider-"+this.options.theme);
			}
		}
	});
})(jQuery);