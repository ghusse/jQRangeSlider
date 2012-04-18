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

			this.bar = $("<div />")
				.rangeSliderBar({
					leftHandle: this.leftHandle,
					rightHandle: this.rightHandle,
					values: {min: this.options.defaultValues.min, max: this.options.defaultValues.max},
					type: this._handle()
				})
				.bind("mousewheel", $.proxy(this._wheelOnBar, this))
				.bind("drag", $.proxy(this._changing, this))
				.bind("stop", $.proxy(this._changed, this));

			this.arrows.left = $("<div class='ui-rangeSlider-arrow ui-rangeSlider-leftArrow' />")
				.css("position", "absolute")
				.css("left", 0)
				.bind("mousedown", $.proxy(this._startScrollLeft, this));

			this.arrows.right = $("<div class='ui-rangeSlider-arrow ui-rangeSlider-rightArrow' />")
				.css("position", "absolute")
				.css("right", 0)
				.bind("mousedown", $.proxy(this._startScrollRight, this));

			$(document).bind("mouseup", $.proxy(this._stopScroll, this));

			this.container
				.append(this.innerBar)
				.append(this.bar)
				.append(this.leftHandle)
			  .append(this.rightHandle);

			this.element
				.append(this.container)
				.append(this.arrows.left)
				.append(this.arrows.right)
				.addClass("ui-rangeSlider")
				.bind("mousewheel", $.proxy(this._wheelOnContainer, this));

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
			}else if (key === "wheelMode" && (value === "zoom" || value === "scroll" || value===null)){
				this.options.wheelMode = value;
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
			}else if (key === "valueLabels" && (value === "hide" || value === "show" || value === "change")){
				this.options.valueLabels = value;

				if (value !== "hide"){
					this._createLabels();
				}else{
					this._destroyLabels();
				}
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

				this.bar.rangeSliderBar("option", "range", this.options.range);
			}else if (key === "step"){
				this.options.step = value;
				this.leftHandle[this._handle()]("option", "step", value);
				this.rightHandle[this._handle()]("option", "step", value);
				this._changed();
			}
		},

		_createHandle: function(options){
			return $("<div />")
				[this._handle()](options)
				.bind("drag", $.proxy(this._changing, this))
				.bind("stop", $.proxy(this._changed, this));
		},

		_handle: function(){
			return "rangeSliderHandle";
		},

		_getValue: function(position, handle){
			if (handle === this.rightHandle){	
				position = position - handle.outerWidth();
			}
			
			return position * (this.options.bounds.max - this.options.bounds.min) / (this.container.innerWidth() - handle.outerWidth(true)) + this.options.bounds.min;
		},

		_trigger: function(eventName){
			(function(that, eventName){
				setTimeout(function(){
					that.element.trigger(eventName, {
							label: that.element,
							values: that.values()
					  });
				}, 1);
			})(this, eventName);
		},

		_changing: function(event, ui){
			if(this._updateValues()){
				this._trigger("valuesChanging");
				this._valuesChanged = true;
			}
		},

		_changed: function(event, ui){
			if (this._updateValues() || this._valuesChanged){
				this._trigger("valuesChanged");
				this._valuesChanged = false;
			}
		},

		_updateValues: function(){
			var left = this.leftHandle[this._handle()]("value"),
				right = this.rightHandle[this._handle()]("value"),
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
		 * Scrolling
		 */
		_startScrollLeft: function(event, ui){
			this.lastScroll = Math.random();
			this.scrollCount = 0;
			this._continueScrollingRight(-1, this.lastScroll);
		},

		_startScrollRight: function(event, ui){
			this.lastScroll = Math.random();
			this.scrollCount = 0;
			this._continueScrollingRight(1, this.lastScroll);
		},

		_continueScrollingRight: function(quantity, last){
			if (last === this.lastScroll){
				var factor = Math.min(Math.floor(this.scrollCount / 5) + 1, 4) / 4;

				this.scrollRight(quantity * factor);
				this.scrollCount++;
				setTimeout($.proxy(function(){this._continueScrollingRight(quantity, last);}, this), 50);
			}
		},

		_stopScroll: function(event, ui){
			this.lastScroll = Math.random();
		},

		/*
		 * Mouse wheel
		 */

		_wheelOnBar: function(event, delta, deltaX, deltaY){
			if (this.options.wheelMode === "zoom"){
				this.zoomIn(-deltaY);

				return false;
			}
		},

		_wheelOnContainer: function(event, delta, deltaX, deltaY){
			if (this.options.wheelMode === "scroll"){
				this.scrollRight(-deltaY);

				return false;
			}
		},

		/*
		 * Value labels
		 */
		_createLabel: function(label, handle){
			if (label === null){
				label = $("<div />")
					.appendTo(this.element)
					.rangeSliderLabel({
						handle: handle,
						type: this._handle(),
						formatter: this._getFormatter()
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

			this.labels.left.rangeSliderLabel("pair", this.labels.right);
		},

		_destroyLabels: function(){
			this.labels.left = this._destroyLabel(this.labels.left);
			this.labels.right = this._destroyLabel(this.labels.right);
		},

		/*
		 * Public methods
		 */
		values: function(min, max){
			if (typeof min !== "undefined" && typeof max !== "undefined")
			{
				this.leftHandle[this._handle()]("value", min);
				this.rightHandle[this._handle()]("value", max);
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
			}
			
			return this.options.bounds;
		},

		_setBounds: function(min, max){
			this.options.bounds = {min: min, max: max};
			this.leftHandle[this._handle()]("option", "bounds", this.options.bounds);
			this.rightHandle[this._handle()]("option", "bounds", this.options.bounds);
			this.bar.rangeSliderBar("option", "bounds", this.options.bounds);
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
			if (typeof quantity === 'undefined')
				quantity = 1;
			this.scrollRight(-quantity);
		},

		scrollRight: function(quantity){
			if (typeof quantity === "undefined")
				quantity = 1;

			var diff = this._values.max - this._values.min,
				min = this._values.min + quantity * this.options.wheelSpeed * diff / 100,
				max = this._values.max + quantity * this.options.wheelSpeed * diff / 100;
		},
		
		/**
		 * Resize
		 */
		resize: function(){
			this._initWidth();
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