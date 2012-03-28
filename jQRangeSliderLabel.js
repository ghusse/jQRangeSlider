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

	$.widget("ui.rangeSliderLabel", {
		options: {
			handle: null,
			formatter: false
		},

		cache: null,

		_create: function(){
			var left = this.options.handle.rangeSliderHandle("option", "isLeft");

			this.element
				.addClass("ui-rangeSlider-label")
				.toggleClass("ui-rangeSlider-leftLabel", left)
				.toggleClass("ui-rangeSlider-rightLabel", !left)
				.css("position", "absolute");

			this.options.handle.bind("moving", $.proxy(this._onMoving, this));
			
			(function(that){
				setTimeout(function(){
					that._initPosition()
				}, 100);
			})(this);
		},

		_initPosition: function(){
			this._cache();
			this._position();
		},

		_cache: function(){
			this.cache = {};
			this.cache.handle = {
				width: this.options.handle.width()
			};

			this.cache.width = {
				outer: this.element.outerWidth()
			}
		},

		_cacheIfNot: function(){
			if (this.cache === null){
				this._cache();
			}
		},

		/*
		 * Event binding
		 */
		_onMoving: function(event, ui){
			this._position(ui.offset.left);
		},

		/*
		 * Positioning
		 */
		_position: function(left){
			this._cacheIfNot();
			
			var offset = this.element.offset();

			offset.left = left + this.cache.handle.width / 2 - this.cache.width.outer / 2;

			this.element.offset(offset);
		}
	});

})(jQuery);