/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function($, undefined){
	"use strict";

	$.widget("ui.rangeSliderBar", $.ui.rangeSliderDraggable, {
		options: {
			leftHandle: null,
			rightHandle: null,
			bounds: {min: 0, max: 100},
			type: "rangeSliderHandle",
			range: false,
			containment: null,
			drag: function() {},
			stop: function() {},
			values: {min: 0, max:20}
		},

		_values: {min: 0, max: 20},
		_waitingToInit: 2,

		_create: function(){
			$.ui.rangeSliderDraggable.prototype._create.apply(this);

			this.element
				.css("position", "absolute")
			.css("top", 0)
				.addClass("ui-rangeSlider-bar");

			this.options.leftHandle
				.bind("initialize", $.proxy(this._onInitialized, this))
				.bind("drag.bar update.bar moving.bar", $.proxy(this._onDragLeftHandle, this))
				.bind("mousestart", $.proxy(this._cache, this))
				.bind("stop", $.proxy(this._onHandleStop, this));

			this.options.rightHandle
				.bind("initialize", $.proxy(this._onInitialized, this))
				.bind("drag.bar update.bar moving.bar", $.proxy(this._onDragRightHandle, this))
				.bind("mousestart", $.proxy(this._cache, this))
				.bind("stop", $.proxy(this._onHandleStop, this));

			this._values = this.options.values;
		},

		_setOption: function(key, value){
			if (key === "range"){
				if (value === false || ((value.min || false) === false && (value.max || false) == false)){
					value = false;
				}

				this._setRangeOption(value);
				this.options.range = value;
			}
		},

		_setRangeOption: function(value){
			if (value === false && this.options.range === false){
				return;
			}

			this.options.range = value;
			this._setLeftRange();
			this._setRightRange();
		},

		_setLeftRange: function(){
			if (this.options.range == false){
				return false;
			}

			var rightValue = this._values.max,
				leftRange = {min: false, max: false};

			if ((this.options.range.min || false) !== false){
				leftRange.max = this._leftHandle("substract", rightValue, this.options.range.min);
			}else{
				leftRange.max = false;
			}

			if ((this.options.range.max || false) !== false){
				leftRange.min = this._leftHandle("substract", rightValue, this.options.range.max);
			}else{
				leftRange.min = false;
			}

			this._leftHandle("option", "range", leftRange);
		},

		_setRightRange: function(){
			var leftValue = this._values.min,
				rightRange = {min: false, max:false};

			if ((this.options.range.min || false) !== false){
				rightRange.min = this._rightHandle("add", leftValue, this.options.range.min);
			}else {
				rightRange.min = false;
			}

			if ((this.options.range.max || false) !== false){
				rightRange.max = this._rightHandle("add", leftValue, this.options.range.max);
			}else{
				rightRange.max = false;
			}

			this._rightHandle("option", "range", rightRange);
		},

		_deactivateRange: function(){
			this._leftHandle("option", "range", false);
			this._rightHandle("option", "range", false);
		},

		_reactivateRange: function(){
			this._setRangeOption(this.options.range);
		},

		_onInitialized: function(){
			this._waitingToInit--;

			if (this._waitingToInit === 0){
				this._initMe();
			}
		},

		_initMe: function(){
			this._cache();
			this.min(this.options.values.min);
			this.max(this.options.values.max);

			var left = this._leftHandle("position"),
				top = this.cache.offset.top,
				right = this._rightHandle("position") + this.options.rightHandle.width();

			this.element.offset({
				left: left,
				top: top
			});

			this.element.css("width", right - left);
		},

		_leftHandle: function(){
			return this._handleProxy(this.options.leftHandle, arguments);
		},

		_rightHandle: function(){
			return this._handleProxy(this.options.rightHandle, arguments);
		},

		_handleProxy: function(element, args){
			var array = Array.prototype.slice.call(args);

			return element[this.options.type].apply(element, array);
		},

		/*
		 * Draggable
		 */

		_cache: function(){
			$.ui.rangeSliderDraggable.prototype._cache.apply(this);

			this._cacheHandles();
		},

		_cacheHandles: function(){
			this.cache.rightHandle = {};
			this.cache.rightHandle.width = this.options.rightHandle.width();
			this.cache.rightHandle.offset = this.options.rightHandle.offset();

			this.cache.leftHandle = {};
			this.cache.leftHandle.offset = this.options.leftHandle.offset();
		},

		_mouseStart: function(event){
			$.ui.rangeSliderDraggable.prototype._mouseStart.apply(this, [event]);

			this._deactivateRange();
		},

		_mouseStop: function(event){
			$.ui.rangeSliderDraggable.prototype._mouseStop.apply(this, [event]);

			this._cacheHandles();

			this._values.min = this._leftHandle("value");
			this._values.max = this._rightHandle("value");
			this._reactivateRange();

			this._leftHandle().trigger("stop");
			this._rightHandle().trigger("stop");
		},

		/*
		 * Event binding
		 */

		_onDragLeftHandle: function(event, ui){
			this._cacheIfNecessary();
			this._values.min = ui.value;

			if (this._switchedValues()){
				this._switchHandles();
				this._onDragRightHandle(event, ui);
				return;
			}

			this.element.offset({left: ui.offset.left, top: this.cache.offset.top});
			this.element.css("width", this.cache.rightHandle.offset.left - ui.offset.left + this.cache.rightHandle.width);

			this.cache.offset.left = ui.offset.left;
			this.cache.leftHandle.offset = ui.offset;
		},

		_onDragRightHandle: function(event, ui){
			this._cacheIfNecessary();
			this._values.max = ui.value;

			if (this._switchedValues()){
				this._switchHandles(),
				this._onDragLeftHandle(event, ui);
				return;
			}

			var width = ui.offset.left + this.cache.rightHandle.width - this.cache.leftHandle.offset.left;
			
			this.element
				.css("width", width)
				.offset({left: this.cache.leftHandle.offset.left, top: this.cache.offset.top});
			
			this.cache.width.inner = width;
			this.cache.rightHandle.offset = ui.offset;
		},

		_onHandleStop: function(){
			this._setLeftRange();
			this._setRightRange();
		},

		_switchedValues: function(){
			if (this.min() > this.max()){
				var temp = this._values.min;
				this._values.min = this._values.max;
				this._values.max = temp;

				return true;
			}

			return false;
		},

		_switchHandles: function(){
			var temp = this.options.leftHandle;

			this.options.leftHandle = this.options.rightHandle;
			this.options.rightHandle = temp;

			this._leftHandle("option", "isLeft", true)
				.unbind(".bar")
				.bind("drag.bar update.bar", $.proxy(this._onDragLeftHandle, this));

			this._rightHandle("option", "isLeft", false)
				.unbind(".bar")
				.bind("drag.bar update.bar", $.proxy(this._onDragRightHandle, this));

			this._cacheHandles();
		},

		_constraintPosition: function(left){
			var position = {},
				right;

			position.left = $.ui.rangeSliderDraggable.prototype._constraintPosition.apply(this, [left]);

			position.left = this._leftHandle("position", position.left);

			right = this._rightHandle("position", position.left + this.cache.width.outer - this.cache.rightHandle.width);
			position.width = right - position.left + this.cache.rightHandle.width;

			return position;
		},

		_applyPosition: function(position){
			$.ui.rangeSliderDraggable.prototype._applyPosition.apply(this, [position.left]);
			this.element.width(position.width);
		},

		/*
		 * Public
		 */

		min: function(value){
			return this._leftHandle("value", value);
		},

		max: function(value){
			return this._rightHandle("value", value);
		},

		startScroll: function(){
			this._deactivateRange();
		},

		stopScroll: function(){
			this._reactivateRange();
		},

		scrollLeft: function(quantity){
			quantity = quantity || 1;

			if (quantity < 0){
				return this.scrollRight(-quantity);
			}

			quantity = this._leftHandle("moveLeft", quantity);
			this._rightHandle("moveLeft", quantity);
		},

		scrollRight: function(quantity){
			quantity = quantity || 1;

			if (quantity < 0){
				return this.scrollLeft(-quantity);
			}

			quantity = this._rightHandle("moveRight", quantity);
			this._leftHandle("moveRight", quantity);
		}

	});

})(jQuery);