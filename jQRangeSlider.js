/**!
 * @license jQRangeSlider
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

			this.leftHandle = $("<div />")
				.rangeSliderHandle({
					isLeft: true,
					bounds: this.options.bounds,
					value: this.options.defaultValues.min
				})
				.bind("drag", $.proxy(this._changing, this))
				.bind("stop", $.proxy(this._changed, this));

			this.rightHandle = $("<div />")
				.rangeSliderHandle({
					isLeft: false,
					bounds: this.options.bounds,
					value: this.options.defaultValues.max
				})
				.bind("drag", $.proxy(this._changing, this))
				.bind("stop", $.proxy(this._changed, this));
			
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
					values: {min: this.options.defaultValues.min, max: this.options.defaultValues.max}
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

			//this.option(this.options);

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
			}else if (key === "bounds" && typeof value.min !== "undefined" && typeof value.max !== "undefined")
			{
				this.bounds(value.min, value.max);
			}else if (key === "range"){
				if (value === false){
					option.range = {min: false, max: false};
					return;
				}
				
				var newVal = value || {};
				newVal.min = (parseFloat(newVal.min) === newVal.min || newVal.min === false ? newVal.min : option.range.min);
				newVal.max = (parseFloat(newVal.max) === newVal.max || newVal.max === false ? newVal.max : option.range.max);
				
				option.range = newVal;
				this._initWidth();
			}else if (key === "step" && (value === false || (value != 0 && parseFloat(value) === value))){
				this.options.step = value;
				this.leftHandle.rangeSliderHandle("option", "step", value);
				this.rightHandle.rangeSliderHandle("option", "step", value);
			}
		},

		_getValue: function(position, handle){
			if (handle === this.rightHandle){	
				position = position - handle.outerWidth();
			}
			
			return position * (this.options.bounds.max - this.options.bounds.min) / (this.container.innerWidth() - handle.outerWidth(true)) + this.options.bounds.min;
		},

		_trigger: function(eventName){
			this.element.trigger(eventName, {
					label: this.element,
					values: this.values()
			  });
		},

		_changing: function(event, ui){
		},

		_changed: function(event, ui){
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
						handle: handle
					});
			}

			return label;
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

			if (this.options.valueLabels === "change"){
				this.labels.left.css("display", "none");
				this.labels.right.css("display", "none");
				this.labels.leftDisplayed = false;
				this.labels.rightDisplayed = false;
			}else{
				this.labels.leftDisplayed = true;
				this.labels.rightDisplayed = true;
				this.labels.left.css("display", "block");
				this.labels.right.css("display", "block");
			}

			this._positionLabels();
		},

		_destroyLabels: function(){
			this.labels.left = this._destroyLabel(this.labels.left);
			this.labels.right = this._destroyLabel(this.labels.right);
		},

		_positionLabel: function(label, position){
			var topPos = this.leftHandle.offset().top - label.outerHeight(true),
				parent = label.offsetParent(),
				leftPos = position - parent.offset().left;

			topPos = topPos - parent.offset().top;

			label
				.css("left", leftPos)
				.css("top", topPos);
		},

		_fillInLabel: function(label, value){
			label.text(this._format(value));
		},

		_fillInLabels: function(){
			this._fillInLabel(this.labels.left, this._values.min);
			this._fillInLabel(this.labels.right, this._values.max);
		},

		_positionLabels: function(){
			if (this.labels.left !== null && this.labels.right !== null){
				this._fillInLabels();
				var minSize = this.labels.leftDisplayed ? this.labels.left.outerWidth(true) : 0,
					maxSize = this.labels.rightDisplayed ? this.labels.right.outerWidth(true) : 0,
					leftBound = 0,
					rightBound = $(window).width() - maxSize,
					minLeft = Math.max(leftBound, this.leftHandle.offset().left + this.leftHandle.outerWidth(true) / 2 - minSize / 2),
					maxLeft = Math.min(rightBound, this.rightHandle.offset().left + this.rightHandle.outerWidth(true) / 2 - maxSize / 2);

				// Need to find a better position
				if (minLeft + minSize >= maxLeft){
					var diff =  minLeft + minSize - maxLeft;
					minLeft = Math.max(leftBound, minLeft - diff / 2);
					maxLeft = Math.min(rightBound, minLeft + minSize);
					minLeft = Math.max(leftBound, maxLeft - minSize);
				}

				if (this.labels.leftDisplayed) this._positionLabel(this.labels.left, minLeft);
				if (this.labels.rightDisplayed) this._positionLabel(this.labels.right, maxLeft);
			}
		},

		_format: function(value){
			if (typeof this.options.formatter !== "undefined" && this.options.formatter !== null){
				return this.options.formatter(value);
			}else{
				return this._defaultFormat(value);
			}
		},

		_defaultFormat: function(value){
			return Math.round(value);
		},

		_showLabels: function(){
			if (this.options.valueLabels === "change" && !this.privateChange){
				if (this.changing.min && !this.labels.leftDisplayed){
					this.labels.left.stop(true, true).fadeIn(this.options.durationIn);
					this.labels.leftDisplayed = true;
				}

				if (this.changing.max && !this.labels.rightDisplayed){
					this.labels.rightDisplayed = true;
					this.labels.right.stop(true, true).fadeIn(this.options.durationIn);
				}
			}
		},

		_hideLabels: function(){
			if (this.options.valueLabels === "change" && this.labels.left !== null && this.labels.right !== null){
				this.labels.leftDisplayed = false;
				this.labels.rightDisplayed = false;
				this.labels.left.stop(true, true).delay(this.options.delayOut).fadeOut(this.options.durationOut);
				this.labels.right.stop(true, true).delay(this.options.delayOut).fadeOut(this.options.durationOut);
			}
		},

		/*
		 * Public methods
		 */
		values: function(min, max){
			if (typeof min !== "undefined" && typeof max !== "undefined")
			{
				
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
				this.options.bounds = {min: min, max: max};
				
				this.leftHandle.rangeSliderHandle("option", "bounds", this.options.bounds);
				this.rightHandle.rangeSliderHandle("option", "bounds", this.options.bounds);
				this.bar.rangeSliderBar("option", "bounds", this.options.bounds);
			}
			
			return this.options.bounds;
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

			//this._privateValues(min, max);
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