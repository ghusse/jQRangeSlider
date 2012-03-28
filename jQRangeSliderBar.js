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

 	$.widget("ui.rangeSliderBar", $.ui.rangeSliderDraggable, {
 		options: {
 			leftHandle: null,
 			rightHandle: null,
 			bounds: {min: 0, max: 100},
 			containment: null,
 			drag: function() {},
 			stop: function() {},
 			values: {min: 0, max:20}
 		},

 		_values: {min: 0, max: 20},

 		_create: function(){
 			$.ui.rangeSliderDraggable.prototype._create.apply(this);

 			this.element
 				.css("position", "absolute")
				.css("top", 0)
 				.addClass("ui-rangeSlider-bar");

 			this.options.leftHandle
 				.bind("drag.bar", $.proxy(this._onDragLeftHandle, this))
 				.bind("mousestart", $.proxy(this._cache, this));

 			this.options.rightHandle
 				.bind("drag.bar", $.proxy(this._onDragRightHandle, this))
 				.bind("mousestart", $.proxy(this._cache, this));

 			this._values = this.options.values;
 		},

 		_initElement: function(){
 			$.ui.rangeSliderDraggable.prototype._initElement.apply(this);

 			this.min(this.options.values.min);
 			this.max(this.options.values.max);

 			var left = this.options.leftHandle.rangeSliderHandle("position"),
 				top = this.cache.offset.top,
 				right = this.options.rightHandle.rangeSliderHandle("position") + this.options.rightHandle.width();

 			this.element.offset({
 				left: left,
 				top: top
 			});

 			this.element.css("width", right - left);
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
 		},

 		/*
 		 * Event binding
 		 */

 		_onDragLeftHandle: function(event, ui){
 			this._values.min = ui.value;

 			if (this._switchedValues()){
 				this._switchHandles();
 				this._onDragRightHandle(event, ui);
 				return;
 			}

 			this.element.offset({left: ui.offset.left, top: this.cache.offset.top});
 			this.element.css("width", this.options.rightHandle.offset().left - ui.offset.left + this.cache.rightHandle.width);

 			this.cache.offset.left = ui.offset.left;
 		},

 		_onDragRightHandle: function(event, ui){
 			this._values.max = ui.value;

 			if (this._switchedValues()){
 				this._switchHandles(),
 				this._onDragLeftHandle(event, ui);
 				return;
 			}

 			var width = ui.offset.left + this.cache.rightHandle.width - this.cache.offset.left;
 			
 			this.element.css("width", width);
 			this.cache.width.inner = width;
 		},

 		_switchedValues: function(){
 			if (this._values.min > this._values.max){
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

 			this.options.leftHandle
 				.rangeSliderHandle("isLeft", true)
 				.unbind(".bar")
 				.bind("drag.bar", $.proxy(this._onDragLeftHandle, this));

 			this.options.rightHandle
 				.rangeSliderHandle("isLeft", false)
 				.unbind(".bar")
 				.bind("drag.bar", $.proxy(this._onDragRightHandle, this));

 			this._cacheHandles();
 		},

 		_constraintPosition: function(left){
 			var position = {},
 				right;

 			position.left = $.ui.rangeSliderDraggable.prototype._constraintPosition.apply(this, [left]);
 			position.left = this.options.leftHandle.rangeSliderHandle("position", position.left);

 			right = this.options.rightHandle.rangeSliderHandle("position", position.left + this.cache.width.outer - this.cache.rightHandle.width);
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
 		 	return this.options.leftHandle.rangeSliderHandle("value", value);
 		 },

 		 max: function(value){
 		 	return this.options.rightHandle.rangeSliderHandle("value", value);
 		 }

 	});

 })(jQuery);