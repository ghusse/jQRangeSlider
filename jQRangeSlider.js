/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

// TODO: minValueChanging / Changed

(function ($, undefined) {
	"use strict";

	$.widget("ui.rangeSlider", {
		options: {
			bounds: {min:0, max:100},
			defaultValues: {min:20, max:50},
			wheelMode: null,
			wheelSpeed: 4,
			arrows: true,
			valueLabels: "show",
			formatter: null,
			durationIn: 0,
			durationOut: 400,
			delayOut: 200,
			range: {min: false, max: false},
			step: false
		},

		_values: null,
		_valuesChanged: false,

		// Created elements
		bar: null,
		leftHandle: null,
		rightHandle: null,
		innerBar: null,
		container: null,
		arrows: null,
		labels: null,
		changing: {min:false, max:false},
		changed: {min:false, max:false},

		// Scroll management
		lastWheel : 0,
		lastScroll: 0,
		scrollCount: 0,

		_create: function(){
			this._values = this.options.defaultValues;
			this.labels = {left: null, right:null, leftDisplayed:true, rightDisplayed:true};
			this.arrows = {left:null, right:null};
			this.changing = {min:false, max:false};
			this.changed = {min:false, max:false};

			this.leftHandle = this._createHandle({
					isLeft: true,
					bounds: this.options.bounds,
					value: this.options.defaultValues.min
			});
	
			this.rightHandle = this._createHandle({
				isLeft: false,
				bounds: this.options.bounds,
				value: this.options.defaultValues.max
			});
			
			this.innerBar = $("<div class='ui-rangeSlider-innerBar' />")
				.css("position", "absolute")
				.css("top", 0)
				.css("left", 0);

			this.container = $("<div class='ui-rangeSlider-container' />")
				.css("position", "absolute");

			this.bar = $("<div />")[this._barType()]
				({
					leftHandle: this.leftHandle,
					rightHandle: this.rightHandle,
					values: {min: this.options.defaultValues.min, max: this.options.defaultValues.max},
					type: this._handleType()
				})
				.bind("drag scroll", $.proxy(this._changing, this))
				.bind("stop", $.proxy(this._changed, this));

			this.container
				.append(this.innerBar)
				.append(this.bar)
				.append(this.leftHandle)
			  .append(this.rightHandle)
			  .appendTo(this.element);

			this.arrows.left = $("<div class='ui-rangeSlider-arrow ui-rangeSlider-leftArrow' />")
				.css("position", "absolute")
				.css("left", 0)
				.appendTo(this.element)
				.bind("mousedown touchstart", $.proxy(this._scrollLeftClick, this));

			this.arrows.right = $("<div class='ui-rangeSlider-arrow ui-rangeSlider-rightArrow' />")
				.css("position", "absolute")
				.css("right", 0)
				.appendTo(this.element)
				.bind("mousedown touchstart", $.proxy(this._scrollRightClick, this));

			this.element.addClass("ui-rangeSlider");

			if (this.element.css("position") !== "absolute"){
				this.element.css("position", "relative");
			}

			if (!this.options.arrows){
				this.arrows.left.css("display", "none");
				this.arrows.right.css("display", "none");
				this.element.addClass("ui-rangeSlider-noArrow");
			}else{
				this.element.addClass("ui-rangeSlider-withArrows");
			}
			if (this.options.valueLabels !== "hide"){
				this._createLabels();
			}else{
				this._destroyLabels();
			}

			$(window).resize($.proxy(this.resize, this));

			setTimeout($.proxy(this.resize, this), 1);
			setTimeout($.proxy(this._initValues, this), 1);
		},

		_initWidth: function(){
			this.container.css("width", this.element.width() - this.container.outerWidth(true) + this.container.width());
			this.innerBar.css("width", this.container.width() - this.innerBar.outerWidth(true) + this.innerBar.width());
		},

		_initValues: function(){
			this.values(this.options.defaultValues.min, this.options.defaultValues.max);
		},

		_setOption: function(key, value) {
			var option = this.options;
			
			if (key === "defaultValues")
			{
				if ((typeof value.min !== "undefined") && (typeof value.max !== "undefined") && parseFloat(value.min) === value.min && parseFloat(value.max) === value.max)
				{
					this.options.defaultValues = value;
				}
			}else if (key === "wheelMode" || key === "wheelSpeed"){
				this.options[key] = value;
				this._bar("option", key, value);
			}else if (key === "wheelSpeed" && !isNaN(parseFloat(value)) && Math.abs(parseFloat(value)) <= 100){
				this.options.wheelSpeed = parseFloat(value);
			}else if (key === "arrows" && (value === true || value === false) && value !== this.options.arrows){
				if (value){
					this.element
						.removeClass("ui-rangeSlider-noArrow")
						.addClass("ui-rangeSlider-withArrows");
					this.arrows.left.css("display", "block");
					this.arrows.right.css("display", "block");
				}else{
					this.element
						.addClass("ui-rangeSlider-noArrow")
						.removeClass("ui-rangeSlider-withArrows");
					this.arrows.left.css("display", "none");
					this.arrows.right.css("display", "none");
				}

				this.options.arrows = value;
				this._initWidth();
			}else if (key === "valueLabels"){
				this._setLabelsOption(value);
			}else if (key === "durationIn" || key === "durationOut" || key === "delayOut"){
				this._setLabelsDurations(key, value);
			}else if (key === "formatter" && value !== null && typeof value === "function"){
				this.options.formatter = value;
				
				if (this.options.valueLabels !== "hide"){
					this._destroyLabels();
					this._createLabels();
				}
			}else if (key === "bounds" && typeof value.min !== "undefined" && typeof value.max !== "undefined")
			{
				this.bounds(value.min, value.max);
			}else if (key === "range"){
				if (value !== false){
					this.options.range.min = typeof value.min !== "undefined" ? value.min : this.options.range.min;
					this.options.range.max = typeof value.max !== "undefined" ? value.max : this.options.range.max;
				}

				this._bar("option", "range", this.options.range);
				this._changed(true);
			}else if (key === "step"){
				this.options.step = value;
				this._leftHandle("option", "step", value);
				this._rightHandle("option", "step", value);
				this._changed(true);
			}
		},

		_setLabelsOption: function(value){
			if (value !== "hide" && value !== "show" && value !== "change"){
				return;
			}

			this.options.valueLabels = value;

			if (value !== "hide"){
				this._createLabels();
				this._leftLabel("update");
				this._rightLabel("update");
			}else{
				this._destroyLabels();
			}
		},

		_setLabelsDurations: function(key, value){
			if (parseInt(value, 10) !== value) return;

			if (this.labels.left !== null){
				this._leftLabel("option", key, value);
			}

			if (this.labels.right !== null){
				this._rightLabel("option", key, value);
			}

			this.options[key] = value;
		},

		_createHandle: function(options){
			return $("<div />")
				[this._handleType()](options)
				.bind("drag", $.proxy(this._changing, this))
				.bind("stop", $.proxy(this._changed, this));
		},

		_proxy: function(element, type, args){
			var array = Array.prototype.slice.call(args);

			return element[type].apply(element, array);
		},

		_handleType: function(){
			return "rangeSliderHandle";
		},

		_barType: function(){
			return "rangeSliderBar";
		},

		_bar: function(){
			return this._proxy(this.bar, this._barType(), arguments);
		},

		_labelType: function(){
			return "rangeSliderLabel";
		},

		_leftLabel: function(){
			return this._proxy(this.labels.left, this._labelType(), arguments);
		},

		_rightLabel: function(){
			return this._proxy(this.labels.right, this._labelType(), arguments);
		},

		_leftHandle: function(){
			return this._proxy(this.leftHandle, this._handleType(), arguments);
		},

		_rightHandle: function(){
			return this._proxy(this.rightHandle, this._handleType(), arguments);
		},

		_getValue: function(position, handle){
			if (handle === this.rightHandle){	
				position = position - handle.outerWidth();
			}
			
			return position * (this.options.bounds.max - this.options.bounds.min) / (this.container.innerWidth() - handle.outerWidth(true)) + this.options.bounds.min;
		},

		_trigger: function(eventName){
			var that = this;

			setTimeout(function(){
				that.element.trigger(eventName, {
						label: that.element,
						values: that.values()
				  });
			}, 1);
		},

		_changing: function(event, ui){
			if(this._updateValues()){
				this._trigger("valuesChanging");
				this._valuesChanged = true;
			}
		},

		_changed: function(isAutomatic){
			if (this._updateValues() || this._valuesChanged){
				this._trigger("valuesChanged");

				if (isAutomatic !== true){
					this._trigger("userValuesChanged");					
				}

				this._valuesChanged = false;
			}
		},

		_updateValues: function(){
			var left = this._leftHandle("value"),
				right = this._rightHandle("value"),
				min = this._min(left, right),
				max = this._max(left, right),
				changing = (min !== this._values.min || max !== this._values.max);

			this._values.min = this._min(left, right);
			this._values.max = this._max(left, right);

			return changing;
		},

		_min: function(value1, value2){
			return Math.min(value1, value2);
		},

		_max: function(value1, value2){
			return Math.max(value1, value2);
		},

		/*
		 * Value labels
		 */
		_createLabel: function(label, handle){
			if (label === null){
				label = $("<div />")
					.appendTo(this.element)
					[this._labelType()]({
						handle: handle,
						type: this._handleType(),
						formatter: this._getFormatter(),
						show: this.options.valueLabels,
						durationIn: this.options.durationIn,
						durationOut: this.options.durationOut,
						delayOut: this.options.delayOut
					});
			}else{
				label[this._labelType()]({
						formatter: this._getFormatter(),
						show: this.options.valueLabels,
						durationIn: this.options.durationIn,
						durationOut: this.options.durationOut,
						delayOut: this.options.delayOut
					});
			}

			return label;
		},

		_getFormatter: function(){
			if (this.options.formatter === false || this.options.formatter === null){
				return this._defaultFormatter;
			}

			return this.options.formatter;
		},

		_defaultFormatter: function(value){
			return Math.round(value);
		},

		_destroyLabel: function(label){
			if (label !== null){
				label.remove();
				label = null;
			}

			return label;
		},

		_createLabels: function(){
			this.labels.left = this._createLabel(this.labels.left, this.leftHandle);
			this.labels.right = this._createLabel(this.labels.right, this.rightHandle);

			this._leftLabel("pair", this.labels.right);
		},

		_destroyLabels: function(){
			this.labels.left = this._destroyLabel(this.labels.left);
			this.labels.right = this._destroyLabel(this.labels.right);
		},

		/*
		 * Scrolling
		 */
		_stepRatio: function(){
			return this._leftHandle("stepRatio");
		},

		_scrollRightClick: function(e){
			e.preventDefault();
			this._bar("startScroll");
			this._bindStopScroll();

			this._continueScrolling("scrollRight", 4 * this._stepRatio(), 1);
		},

		_continueScrolling: function(action, timeout, quantity, timesBeforeSpeedingUp){
			this._bar(action, quantity);
			timesBeforeSpeedingUp = timesBeforeSpeedingUp || 5;
			timesBeforeSpeedingUp--;

			var that = this,
				minTimeout = 16,
				maxQuantity = Math.max(1, 4 / this._stepRatio());

			this._scrollTimeout = setTimeout(function(){
				if (timesBeforeSpeedingUp === 0){
					if (timeout > minTimeout){
						timeout = Math.max(minTimeout, timeout / 1.5);	
					} else {
						quantity = Math.min(maxQuantity, quantity * 2);
					}
					
					timesBeforeSpeedingUp = 5;
				}

				that._continueScrolling(action, timeout, quantity, timesBeforeSpeedingUp);
			}, timeout);
		},

		_scrollLeftClick: function(e){
			e.preventDefault();

			this._bar("startScroll");
			this._bindStopScroll();

			this._continueScrolling("scrollLeft", 4 * this._stepRatio(), 1);
		},

		_bindStopScroll: function(){
			var that = this;
			this._stopScrollHandle = function(e){
				e.preventDefault();
				that._stopScroll();
			};

			$(document).bind("mouseup touchend", this._stopScrollHandle);
		},

		_stopScroll: function(){
			$(document).unbind("mouseup touchend", this._stopScrollHandle);
			this._bar("stopScroll");
			clearTimeout(this._scrollTimeout);
		},

		/*
		 * Public methods
		 */
		values: function(min, max){
			if (typeof min !== "undefined" && typeof max !== "undefined")
			{
				this._leftHandle("value", min);
				this._rightHandle("value", max);
			}

			return this._values;
		},

		min: function(min){
			return this.values(min, this._values.max).min;
		},

		max: function(max){
			return this.values(this._values.min, max).max;
		},
		
		bounds: function(min, max){
			if ((typeof min !== "undefined") && (typeof max !== "undefined") 
				&& parseFloat(min) === min && parseFloat(max) === max && min < max){
				
				this._setBounds(min, max);
				this._changed(true);
			}
			
			return this.options.bounds;
		},

		_setBounds: function(min, max){
			this.options.bounds = {min: min, max: max};
			this._leftHandle("option", "bounds", this.options.bounds);
			this._rightHandle("option", "bounds", this.options.bounds);
			this._bar("option", "bounds", this.options.bounds);
		},

		zoomIn: function(quantity){
			var diff = this._values.max - this._values.min,
				min = this._values.min + quantity * this.options.wheelSpeed * diff / 200,
				max = this._values.max - quantity * this.options.wheelSpeed * diff / 200;

			//this._privateValues(min, max);
		},

		zoomOut: function(quantity){
			this.zoomIn(-quantity);
		},

		scrollLeft: function(quantity){
			this._bar("scrollLeft", quantity);
		},

		scrollRight: function(quantity){
			this._bar("scrollRight", quantity);
		},
		
		/**
		 * Resize
		 */
		resize: function(){
			this._initWidth();
			this._leftHandle("update");
			this._rightHandle("update");
		},

		destroy: function(){
			this.element.removeClass("ui-rangeSlider-withArrows")
			.removeClass("ui-rangeSlider-noArrow");
			this.bar.detach();
			this.leftHandle.detach();
			this.rightHandle.detach();
			this.innerBar.detach();
			this.container.detach();
			this.arrows.left.detach();
			this.arrows.right.detach();
			this.element.removeClass("ui-rangeSlider");
			this._destroyLabels();
			delete this.options;

			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});
})(jQuery);