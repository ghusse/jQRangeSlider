/**!
 * @license jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */


 (function($, undefined){
	"use strict";

	$.widget("ui.rangeSliderHandle", $.ui.rangeSliderDraggable, {
		currentMove: null,
		margin: 0,
		parentElement: null,

		options: {
			isLeft: true,
			bounds: {min:0, max:100},
			value: 0
		},

		_value: 0,
		_left: 0,

		_create: function(){
			$.ui.rangeSliderDraggable.prototype._create.apply(this);

			this.element
				.css("position", "absolute")
				.css("top", 0)
				.addClass("ui-rangeSlider-handle")
				.toggleClass("ui-rangeSlider-leftHandle", this.options.isLeft)
				.toggleClass("ui-rangeSlider-rightHandle", !this.options.isLeft);

			this._value = this.options.value;
		},

		_setOption: function(key, value){
			$.ui.draggable.prototype._setOption.apply(this, [key, value]);

			if (key === "isLeft" && (value === true || value === false)){
				this.options.isLeft = value;

				this.element
					.toggleClass("ui-rangeSlider-leftHandle", this.options.isLeft)
					.toggleClass("ui-rangeSlider-rightHandle", !this.options.isLeft);

				this._position(this._value);
			}
		},

		_initElement: function(){
			$.ui.rangeSliderDraggable.prototype._initElement.apply(this);
			
			this._position(this.options.value);
		},

		/*
		 * From draggable
		 */

		_cache: function(){
			$.ui.rangeSliderDraggable.prototype._cache.apply(this);

			this._cacheParent();
		},

		_cacheParent: function(){
			var parent = this.element.parent();

			this.cache.parent = {
				element: parent,
				offset: parent.offset(),
				padding: {
					left: this._parsePixels(parent, "paddingLeft")
				},
				width: parent.width()
			}
		},

		_position: function(value){
			var left = this._getPositionForValue(value);

			this._applyPosition(left);
		},

		_applyPosition: function(left){
			$.ui.rangeSliderDraggable.prototype._applyPosition.apply(this, [left]);

			this._left = left;
			this._setValue(this._getValueForPosition(left));
			this._triggerMouseEvent("moving");
		},

		_prepareEventData: function(){
			var data = $.ui.rangeSliderDraggable.prototype._prepareEventData.apply(this);

			data.value = this._value;

			return data;
		},

		/*
		 * Value
		 */
		_setValue: function(value){
			if (value != this._value){
				this._value = value;
			}
		},

		_constraintValue: function(value){
			value = Math.min(value, this.options.bounds.max);
			value = Math.max(value, this.options.bounds.min);

			return value;
		},

		_getPositionForValue: function(value){
			var ratio = value / (this.options.bounds.max - this.options.bounds.min),
				position = this.cache.parent.offset.left;

			if (!this.options.isLeft){
				position -= this.cache.width.outer;
			}


			return position + ratio * this.cache.parent.width;
		},

		_getValueForPosition: function(position){
			if (!this.options.isLeft){
				position += this.cache.width.outer;
			}

			var ratio = (position - this.cache.parent.offset.left) / this.cache.parent.width,
				raw = ratio * (this.options.bounds.max - this.options.bounds.min) + this.options.bounds.min;

			return this._constraintValue(raw);
		},

		/*
		 * Public
		 */

		value: function(value){
			if (typeof value != "undefined"){
				this._cache();

				value = this._constraintValue(value);

				this._position(value);
			}

			return this._value;
		},

		position: function(position){
			if (typeof position != "undefined"){
				this._cache();
				
				position = this._constraintPosition(position);
				this._applyPosition(position);
			}

			return this._left;
		}
	});
 })(jQuery);