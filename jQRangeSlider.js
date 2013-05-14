/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function ($, undefined) {
	"use strict";

	$.widget("ui.rangeSlider", {
		options: {
			bounds: {min:0, max:100},
			defaultValues: {min:20, max:50},
			limits: {min: false, max: false},
			wheelMode: null,
			wheelSpeed: 4,
			arrows: true,
			valueLabels: "show",
			formatter: null,
			durationIn: 0,
			durationOut: 400,
			delayOut: 200,
			range: {min: false, max: false},
			step: false,
			scales: false
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
		ruler: null,

		_create: function(){
			this._setDefaultValues();

			this.labels = {left: null, right:null, leftDisplayed:true, rightDisplayed:true};
			this.arrows = {left:null, right:null};
			this.changing = {min:false, max:false};
			this.changed = {min:false, max:false};

			this._createElements();

			this._bindResize();

			setTimeout($.proxy(this.resize, this), 1);
			setTimeout($.proxy(this._initValues, this), 1);
		},

		_setDefaultValues: function(){
			this._values = {
				min: this.options.defaultValues.min,
				max: this.options.defaultValues.max
			};
		},

		_bindResize: function(){
			var that = this;

			this._resizeProxy = function(e){
				that.resize(e);
			};

			$(window).resize(this._resizeProxy);
		},

		_initWidth: function(){
			this.container.css("width", this.element.width() - this.container.outerWidth(true) + this.container.width());
			this.innerBar.css("width", this.container.width() - this.innerBar.outerWidth(true) + this.innerBar.width());
		},

		_initValues: function(){
			this.values(this._values.min, this._values.max);
		},

		_setOption: function(key, value) {
			this._setWheelOption(key, value);
			this._setArrowsOption(key, value);
			this._setLabelsOption(key, value);
			this._setLabelsDurations(key, value);
			this._setFormatterOption(key, value);
			this._setBoundsOption(key, value);
			this._setRangeOption(key, value);
			this._setStepOption(key, value);
			this._setScalesOption(key, value);
			this._setLimitsOption(key, value);
		},

		_validProperty: function(object, name, defaultValue){
			if (object === null || typeof object[name] === "undefined"){
				return defaultValue;
			}

			return object[name];
		},

		_setStepOption: function(key, value){
			if (key === "step"){
				this.options.step = value;
				this._leftHandle("option", "step", value);
				this._rightHandle("option", "step", value);
				this._changed(true);
			}
		},

		_setScalesOption: function(key, value){
			if (key === "scales"){
				if (value === false || value === null){
					this.options.scales = false;
					this._destroyRuler();
				}else if (value instanceof Array){
					this.options.scales = value;
					this._updateRuler();
				}
			}
		},

		_setRangeOption: function(key, value){
			if (key === "range"){
				this._bar("option", "range", value);
				this.options.range = this._bar("option", "range");
				this._changed(true);
			}
		},

		_setBoundsOption: function(key, value){
			if (key === "bounds" && typeof value.min !== "undefined" && typeof value.max !== "undefined"){
				this.bounds(value.min, value.max);
			}
		},

		_setWheelOption: function(key, value){
			if (key === "wheelMode" || key === "wheelSpeed"){
				this._bar("option", key, value);
				this.options[key] = this._bar("option", key);
			}
		},

		_setLabelsOption: function(key, value){
			if (key === "valueLabels"){
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
			}
		},

		_setFormatterOption: function(key, value){
			if (key === "formatter" && value !== null && typeof value === "function"){
				this.options.formatter = value;

				if (this.options.valueLabels !== "hide"){
					this._destroyLabels();
					this._createLabels();
				}
			}
		},

		_setArrowsOption: function(key, value){
			if (key === "arrows" && (value === true || value === false) && value !== this.options.arrows){
				if (value === true){
					this.element
						.removeClass("ui-rangeSlider-noArrow")
						.addClass("ui-rangeSlider-withArrows");
					this.arrows.left.css("display", "block");
					this.arrows.right.css("display", "block");
					this.options.arrows = true;
				}else if (value === false){
					this.element
						.addClass("ui-rangeSlider-noArrow")
						.removeClass("ui-rangeSlider-withArrows");
					this.arrows.left.css("display", "none");
					this.arrows.right.css("display", "none");
					this.options.arrows = false;
				}

				this._initWidth();
			}
		},

		_setLabelsDurations: function(key, value){
			if (key === "durationIn" || key === "durationOut" || key === "delayOut"){
				if (parseInt(value, 10) !== value) return;

				if (this.labels.left !== null){
					this._leftLabel("option", key, value);
				}

				if (this.labels.right !== null){
					this._rightLabel("option", key, value);
				}

				this.options[key] = value;
			}
		},

		_setLimits: function(min, max){
			if (!this.options.limits)
				this.options.limits = {};

			if ((typeof(min) === "number") || (min === false))
				this.options.limits.min = min;

			if ((typeof(max) === "number") || (max === false))
				this.options.limits.max = max;

			this._leftHandle("option", "limits", this.options.limits);
			this._rightHandle("option", "limits", this.options.limits);
			this._bar("option", "limits", this.options.limits);
		},

		_setLimitsOption: function(key, value){
			if (key === "limits" && ((typeof(value.min) !== "undefined") || (typeof value.max !== "undefined")))
			{
				this._setLimits(value.min, value.max);
			}
		},

		_createElements: function(){
			if (this.element.css("position") !== "absolute"){
				this.element.css("position", "relative");
			}

			this.element.addClass("ui-rangeSlider");

			this.container = $("<div class='ui-rangeSlider-container' />")
				.css("position", "absolute")
				.appendTo(this.element);

			this.innerBar = $("<div class='ui-rangeSlider-innerBar' />")
				.css("position", "absolute")
				.css("top", 0)
				.css("left", 0);

			this._createHandles();
			this._createBar();
			this.container.prepend(this.innerBar);
			this._createArrows();

			if (this.options.valueLabels !== "hide"){
				this._createLabels();
			}else{
				this._destroyLabels();
			}

			this._updateRuler();
		},

		_createHandle: function(options){
			return $("<div />")
				[this._handleType()](options)
				.bind("sliderDrag", $.proxy(this._changing, this))
				.bind("stop", $.proxy(this._changed, this));
		},

		_createHandles: function(){
			var leftHandleParams = {
				isLeft: true,
				bounds: this.options.bounds,
				value: this._values.min,
				step: this.options.step
			};

			var rightHandleParams = {
				isLeft: false,
				bounds: this.options.bounds,
				value: this._values.max,
				step: this.options.step
			};

			var limits = this.options.limits;
			if (limits)
			{
				leftHandleParams.limits = limits;
				rightHandleParams.limits = limits;
			}

			this.leftHandle = this._createHandle(leftHandleParams).appendTo(this.container);
			this.rightHandle = this._createHandle(rightHandleParams).appendTo(this.container);
		},

		_createBar: function(){
			this.bar = $("<div />")
				.prependTo(this.container)
				.bind("sliderDrag scroll zoom", $.proxy(this._changing, this))
				.bind("stop", $.proxy(this._changed, this));

			var barParams = {
				leftHandle: this.leftHandle,
				rightHandle: this.rightHandle,
				values: {min: this._values.min, max: this._values.max},
				type: this._handleType(),
				range: this.options.range,
				wheelMode: this.options.wheelMode,
				wheelSpeed: this.options.wheelSpeed
			};

			this._bar(barParams);

			this.options.range = this._bar("option", "range");
			this.options.wheelMode = this._bar("option", "wheelMode");
			this.options.wheelSpeed = this._bar("option", "wheelSpeed");
		},

		_createArrows: function(){
			this.arrows.left = this._createArrow("left");
			this.arrows.right = this._createArrow("right");

			if (!this.options.arrows){
				this.arrows.left.css("display", "none");
				this.arrows.right.css("display", "none");
				this.element.addClass("ui-rangeSlider-noArrow");
			}else{
				this.element.addClass("ui-rangeSlider-withArrows");
			}
		},

		_createArrow: function(whichOne){
			var arrow = $("<div class='ui-rangeSlider-arrow' />")
				.append("<div class='ui-rangeSlider-arrow-inner' />")
				.addClass("ui-rangeSlider-" + whichOne + "Arrow")
				.css("position", "absolute")
				.css(whichOne, 0)
				.appendTo(this.element),
				target;

			if (whichOne === "right"){
				target = $.proxy(this._scrollRightClick, this);
			}else{
				target = $.proxy(this._scrollLeftClick, this);
			}

			arrow.bind("mousedown touchstart", target);

			return arrow;
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

		_changing: function(){
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

			this._values.min = min;
			this._values.max = max;

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
			var params;

			if (label === null){
				params = this._getLabelConstructorParameters(label, handle);
				label = $("<div />")
					.appendTo(this.element)
					[this._labelType()](params);
			}else{
				params = this._getLabelRefreshParameters(label, handle);

				label[this._labelType()](params);
			}

			return label;
		},

		_getLabelConstructorParameters: function(label, handle){
			return {
				handle: handle,
				handleType: this._handleType(),
				formatter: this._getFormatter(),
				show: this.options.valueLabels,
				durationIn: this.options.durationIn,
				durationOut: this.options.durationOut,
				delayOut: this.options.delayOut
			};
		},

		_getLabelRefreshParameters: function(){
			return {
				formatter: this._getFormatter(),
				show: this.options.valueLabels,
				durationIn: this.options.durationIn,
				durationOut: this.options.durationOut,
				delayOut: this.options.delayOut
			};
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
				label[this._labelType()]("destroy");
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
			this._stopScrollHandle = null;
			this._bar("stopScroll");
			clearTimeout(this._scrollTimeout);
		},

		/*
		 * Ruler
		 */
		_createRuler: function(){
			this.ruler = $("<div class='ui-rangeSlider-ruler' />").appendTo(this.innerBar);
		},

		_setRulerParameters: function(){
			this.ruler.ruler({
				min: this.options.bounds.min,
				max: this.options.bounds.max,
				scales: this.options.scales
			});
		},

		_destroyRuler: function(){
			if (this.ruler !== null && $.fn.ruler){
				this.ruler.ruler("destroy");
				this.ruler.remove();
				this.ruler = null;
			}
		},

		_updateRuler: function(){
			this._destroyRuler();

			if (this.options.scales === false || !$.fn.ruler){
				return;
			}

			this._createRuler();
			this._setRulerParameters();
		},

		/*
		 * Public methods
		 */
		values: function(min, max){
			var val = this._bar("values", min, max);

			if (typeof min !== "undefined" && typeof max !== "undefined"){
				this._changed(true);
			}

			return val;
		},

		min: function(min){
			this._values.min = this.values(min, this._values.max).min;

			return this._values.min;
		},

		max: function(max){
			this._values.max = this.values(this._values.min, max).max;

			return this._values.max;
		},

		bounds: function(min, max){
			if (this._isValidValue(min) && this._isValidValue(max) && min < max){

				this._setBounds(min, max);
				this._updateRuler();
				this._changed(true);
			}

			return this.options.bounds;
		},

		limits: function(min, max){
			this._setLimits(min, max);
			return this.options.limits;
		},

		_isValidValue: function(value){
			return typeof value !== "undefined" && parseFloat(value) === value;
		},

		_setBounds: function(min, max){
			this.options.bounds = {min: min, max: max};
			this._leftHandle("option", "bounds", this.options.bounds);
			this._rightHandle("option", "bounds", this.options.bounds);
			this._bar("option", "bounds", this.options.bounds);
		},

		zoomIn: function(quantity){
			this._bar("zoomIn", quantity);
		},

		zoomOut: function(quantity){
			this._bar("zoomOut", quantity);
		},

		scrollLeft: function(quantity){
			this._bar("startScroll");
			this._bar("scrollLeft", quantity);
			this._bar("stopScroll");
		},

		scrollRight: function(quantity){
			this._bar("startScroll");
			this._bar("scrollRight", quantity);
			this._bar("stopScroll");
		},

		/**
		 * Resize
		 */
		resize: function(){
			this._initWidth();
			this._leftHandle("update");
			this._rightHandle("update");
			this._bar("update");
		},

		destroy: function(){
			this.element.removeClass("ui-rangeSlider-withArrows")
			.removeClass("ui-rangeSlider-noArrow");

			this._destroyWidgets();
			this._destroyElements();

			this.element.removeClass("ui-rangeSlider");
			this.options = null;

			$(window).unbind("resize", this._resizeProxy);
			this._resizeProxy = null;
			this._bindResize = null;

			$.Widget.prototype.destroy.apply(this, arguments);
		},

		_destroyWidget: function(name){
			this["_" + name]("destroy");
			this[name].remove();
			this[name] = null;
		},

		_destroyWidgets: function(){
			this._destroyWidget("bar");
			this._destroyWidget("leftHandle");
			this._destroyWidget("rightHandle");

			this._destroyRuler();
			this._destroyLabels();
		},

		_destroyElements: function(){
			this.container.remove();
			this.container = null;

			this.innerBar.remove();
			this.innerBar = null;

			this.arrows.left.remove();
			this.arrows.right.remove();
			this.arrows = null;
		}
	});
}(jQuery));
