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
		innerBar: null,
		
		// Scroll managment
		lastWheel : 0,
		
		_create: function(){
			this.leftHandle = $("<div class='ui-rangeSlider-handle  ui-rangeSlider-leftHandle'>&nbsp;</div>")
				.draggable({axis:"x", containment: "parent",
					drag: $.proxy(this._handleMoved, this), 
					stop: $.proxy(this._handleStop, this),
					containment: "parent"})
				.css("position", "absolute");
			this.rightHandle = $("<div class='ui-rangeSlider-handle ui-rangeSlider-rightHandle'>&nbsp;</div>")
				.draggable({axis:"x", containment: "parent",
					drag: $.proxy(this._handleMoved, this), 
					stop: $.proxy(this._handleStop, this),
					containment: "parent"})
				.css("position", "absolute");
			
			this.innerBar = $("<div class='ui-rangeSlider-innerBar'>&nbsp;</div>")
				.css("position", "absolute")
				.css("top", 0)
				.css("left", 0);
			
			this.bar = $("<div class='ui-rangeSlider-Bar'>&nbsp;</div>")
				.draggable({axis:"x", containment: "parent",
					drag: $.proxy(this._barMoved, this), 
					stop: $.proxy(this._barStop, this),
					containment: this.element})
				.css("position", "absolute")
				.bind("mousewheel", $.proxy(this._wheelOnBar, this));
			
			this.element
				.append(this.leftHandle)
				.append(this.rightHandle)
				.append(this.innerBar)
				.append(this.bar)
				.addClass("ui-rangeSlider")
				.bind("mousewheel", $.proxy(this._wheelOnContainer, this));
			
			if (this.element.css("position") != "absolute"){
				this.element.css("position", "relative");
			}
			
			this.innerBar.outerWidth(this.element.width());
			
			this.values(this.options.defaultValues.min, this.options.defaultValues.max);
			
			// Seems that all the elements are not ready, outerWidth does not return the good value
			setTimeout($.proxy(this._initWidth, this),
			1);
		},
		
		_initWidth: function(){
			this.innerBar.css("width", this.element.width() - this.innerBar.outerWidth(true) + this.innerBar.width());
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
		
		_trigger: function(eventName){
			this.element.trigger(eventName, {
			  	helper: this.element,
			  	values: {
			  		min: this._values.min,
			  		max: this._values.max
			  	}
			  });
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
		
		_barStop: function(event, ui){
			this._position();
			this._trigger("valuesChanged");
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
		
		_handleStop: function(event, ui){
			this._position();
			this._trigger("valuesChanged");
		},
		
		_prepareFiringChanged: function(){
			this.lastWheel = Math.random();
			var last = this.lastWheel;
			setTimeout($.proxy(function(){this._fireChanged(last);}, this), 200);
		},
		
		_fireChanged: function(last){
			if (this.lastWheel == last){
				this._trigger("valuesChanged");
			}
		},
		
		_wheelOnBar: function(event, delta, deltaX, deltaY){
			if (this.options.wheelMode == "zoom"){
				var left = this.bar.position().left;
				var right = this.bar.outerWidth(true) + left - 1;
				
				left -= deltaY * this.options.wheelSpeed / 2;
				right += deltaY * this.options.wheelSpeed / 2;
				
				this.values(this._getValue(left), this._getValue(right));
				
				this._prepareFiringChanged();
				
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
				
				var last = this.lastWheel;
				setTimeout($.proxy(function(){this._fireChanged(last);}, this), 500);
				
				this._prepareFiringChanged();
				
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
			
			this._trigger("valuesChanging");
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