/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2013
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

 (function($){
	"use strict";

	var scaleDefaults = {
		first: function(start){
			return start;
		},
		next: function(value){
			return value + 1;
		},
		label: function(step){
			return Math.round(step);
		},
		stop: function(){
			return false;
		}
	};

	$.widget("ui.ruler", {
		options: {
			min: 0,
			max: 100,
			scales: []
		},

		_create: function(){
			this.element.addClass("ui-ruler");

			this._createScales();
		},

		destroy: function(){
			this.element.removeClass("ui-ruler");
			this.element.empty();
		},

		_regenerate: function(){
			this.element.empty();
			this._createScales();
		},

		_setOption: function(key, value){
			if (key === "min" || key === "max" && value !== this.options[key]){
				this.options[key] = value;
				this._regenerate();
				return;
			}

			if (key === "scales" && value instanceof Array){
				this.options.scales = value;
				this._regenerate();
				return;
			}
		},

		_createScales: function(){
			if (this.options.max === this.options.min){
				return;
			}

			for (var i = 0; i < this.options.scales.length; i++){
				this._createScale(this.options.scales[i], i);
			}
		},

		_createScale: function(opt, index){
			var options = $.extend({}, scaleDefaults, opt),
				container = $("<div class='ui-ruler-scale' />").appendTo(this.element);

			container.addClass("ui-ruler-scale" + index);

			this._createSteps(container, options);
		},

		_createSteps: function(container, scaleOptions){
			var start,
				end = scaleOptions.first(this.options.min, this.options.max),
				difference = this.options.max - this.options.min,
				first = true,
				width, step;

			do{
				start = end;
				end = scaleOptions.next(start);
				
				width = (Math.min(end, this.options.max) - Math.max(start, this.options.min)) / difference;
				step = this._createStep(start, end, scaleOptions);
				container.append(step);
				step.css("width", 100 * width + "%");

				if (first && start > this.options.min){
					step.css("margin-left", 100 * (start - this.options.min) / difference + "%");
				}

				first = false;

			}while(!this._stop(scaleOptions, end));
		},

		_stop: function(scaleOptions, value){
			return scaleOptions.stop(value) || value >= this.options.max;
		},

		_createStep: function(start, end, scaleOptions){
			var container = $("<div class='ui-ruler-step' style='display:inline-block' />"),
				inner = $("<div class='ui-ruler-step-inner' />").appendTo(container),
				label = $("<span class='ui-ruler-step-label' />").appendTo(inner);

			label.text(scaleOptions.label(start, end));

			return container;
		}
	});

}(jQuery));