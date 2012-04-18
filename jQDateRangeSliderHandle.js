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

	$.widget("ui.dateRangeSliderHandle", $.ui.rangeSliderHandle, {
		_steps: false,
		_boundsValues: {},

		_create: function(){
			$.ui.rangeSliderHandle.prototype._create.apply(this);
			this._createBoundsValues();
		},

		_getValueForPosition: function(position){
			var min = this.options.bounds.min.valueOf(),
				max = this.options.bounds.max.valueOf();

			if (!this.options.isLeft){
				position += this.cache.width.outer;
			}

			var ratio = (position - this.cache.parent.offset.left) / this.cache.parent.width,
				raw = ratio * (max - min) + min;

			return this._constraintValue(new Date(raw));
		},

		_setOption: function(key, value){
			if (key === "step"){
				this.options.step = value;
				this._createSteps();
				this.update();
				return;
			}

			$.ui.rangeSliderHandle.prototype._setOption.apply(this, [key, value]);

			if (key === "bounds"){
				this._createBoundsValues();
			}
		},

		_createBoundsValues: function(){
			this._boundsValues = {
					min: this.options.bounds.min.valueOf(),
					max: this.options.bounds.max.valueOf()
			};
		},

		_bounds: function(){
			return this._boundsValues;
		},

		_createSteps: function(){
			if (this.options.step === false || !this._isValidStep()){
				this._steps = false;
			}

			var minDate = new Date(this.options.bounds.min),
				maxDate = new Date(this.options.bounds.max),
				stepDate = minDate,
				i = 0;

			this._steps = [];

			while (stepDate <= maxDate){
				this._steps.push(stepDate.valueOf());

				stepDate = this._addStep(minDate, i, this.options.step);
				i++;
			}
		},

		_isValidStep: function(){
			return typeof this.options.step === "object";
		},

		_addStep: function(reference, factor, step){
			var result = new Date(reference.valueOf());

			result = this._addThing(result, "FullYear", factor, step.years);
			result = this._addThing(result, "Month", factor, step.months);
			result = this._addThing(result, "Date", factor, step.days);
			result = this._addThing(result, "Hours", factor, step.hours);
			result = this._addThing(result, "Minutes", factor, step.minutes);
			result = this._addThing(result, "Seconds", factor, step.seconds);

			return result;
		},

		_addThing: function(date, thing, factor, base){
			if (factor === 0 || (base || 0) === 0){
				return date;
			}

			date["set" + thing](
				date["get" + thing]() + factor * (base || 0)
				);

			return date;
		},

		_round: function(value){
			if (this._steps === false){
				return value;
			}

			var max = this.options.bounds.max.valueOf(),
				min = this.options.bounds.min.valueOf(),
				ratio = (value - min) / (max - min),
				index = Math.floor(this._steps.length * ratio),
				before, after;

			while (this._steps[index] > value){
				index--;
			}

			while (index + 1 < this._steps.length && this._steps[index + 1] <= value){
				index++;
			}

			if (index >= this._steps.length - 1){
				return this._steps[this._steps.length - 1];
			} else if (index == 0){
				return this._steps[0];
			}

			before = this._steps[index];
			after = this._steps[index + 1];

			if (value - before < after - value){
				return before;
			}

			return after;
		},

		add: function(date, step){
			return this._addStep(new Date(date), 1, step).valueOf();
		},

		substract: function(date, step){
			return this._addStep(new Date(date), -1, step).valueOf();
		}
	});
})(jQuery);