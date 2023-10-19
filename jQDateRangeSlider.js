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

	$.widget("ui.dateRangeSlider", $.ui.rangeSlider, {
		options: {
			bounds: {min: new Date(2010,0,1).valueOf(), max: new Date(2012,0,1).valueOf()},
			defaultValues: {min: new Date(2010,1,11).valueOf(), max: new Date(2011,1,11).valueOf()}
		},

		_create: function(){
			this._super();

			this.element.addClass("ui-dateRangeSlider");
		},

		destroy: function(){
			this.element.removeClass("ui-dateRangeSlider");
			this._super();
		},

		_setDefaultValues: function(){
			this._values = {
				min: this.options.defaultValues.min.valueOf(),
				max: this.options.defaultValues.max.valueOf()
			};
		},

		_setRulerParameters: function(){
			this.ruler.ruler({
				min: new Date(this.options.bounds.min.valueOf()),
				max: new Date(this.options.bounds.max.valueOf()),
				scales: this.options.scales
			});
		},

		_setOption: function(key, value){
			if ((key === "defaultValues" || key === "bounds") && typeof value !== "undefined" && value !== null && this._isValidDate(value.min) && this._isValidDate(value.max)){
				this._super(key, {min:value.min.valueOf(), max:value.max.valueOf()});
			}else{
				this._super.apply(this, this._toArray(arguments));
			}
		},

		_handleType: function(){
			return "dateRangeSliderHandle";
		},

		option: function(key){
			if (key === "bounds" || key === "defaultValues"){
				var result = this._super.apply(this, this._toArray(arguments));

				return {min:new Date(result.min), max:new Date(result.max)};
			}

			return  this._super.apply(this, this._toArray(arguments));
		},

		_defaultFormatter: function(value){
			var month = value.getMonth() + 1,
				day = value.getDate();

			return "" + value.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
		},

		_getFormatter: function(){
			var formatter = this.options.formatter;

			if (this.options.formatter === false || this.options.formatter === null){
				formatter = this._defaultFormatter;
			}

			return (function(formatter){
				return function(value, isLeft){
					return formatter(new Date(value), isLeft);
				};
			}(formatter));
		},

		values: function(min, max){
			var values = null;

			if (this._isValidDate(min) && this._isValidDate(max))
			{
				values = this._super(min.valueOf(), max.valueOf());
			}else{
				values = this._super.apply(this, this._toArray(arguments));
			}

			return {min: new Date(values.min), max: new Date(values.max)};
		},

		min: function(min){
			if (this._isValidDate(min)){
				return new Date(this._super(min.valueOf()));
			}

			return new Date(this._super());
		},

		max: function(max){
			if (this._isValidDate(max)){
				return new Date(this._super(max.valueOf()));
			}

			return new Date(this._super());
		},

		bounds: function(min, max){
			var result;

			if (this._isValidDate(min) && this._isValidDate(max)) {
				result = this._super(min.valueOf(), max.valueOf());
			} else {
				result = this._super.apply(this, this._toArray(arguments));
			}

			return {min: new Date(result.min), max: new Date(result.max)};
		},

		_isValidDate: function(value){
			return typeof value !== "undefined" && value instanceof Date;
		},

		_toArray: function(argsObject){
			return Array.prototype.slice.call(argsObject);
		}
	});
}(jQuery));
