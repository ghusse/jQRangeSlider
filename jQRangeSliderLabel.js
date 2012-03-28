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

			this._cacheWidth();

			var parent = this.element.parent();
			this.cache.parent = {
				offset: parent.offset(),
				width: parent.width()
			}
		},

		_cacheWidth: function(){
			this.cache.width = {
				outer: this.element.outerWidth()
			}
		},

		_updateWidthCache: function(){
			if (this.cache === null){
				this._cache();
			}else{
				this._cacheWidth();
			}
		},

		_cacheIfNot: function(){
			if (this.cache === null){
				this._cache();
			}
		},

		_display: function(value){
			if (this.options.formatter == false){
				this.element.text(Math.round(value));
			}else{
				this.element.text(this.options.formatter(value));
			}

			this._updateWidthCache();
		},

		/*
		 * Event binding
		 */
		_onMoving: function(event, ui){
			this._display(ui.value);
			this._position(ui.offset.left);
		},

		/*
		 * Positioning
		 */
		_position: function(left){
			this._cacheIfNot();

			var offset = this.element.offset();

			offset.left = left + this.cache.handle.width / 2 - this.cache.width.outer / 2;
			offset.left = Math.max(offset.left, this.cache.parent.offset.left);
			offset.left = Math.min(offset.left, this.cache.parent.offset.left + this.cache.parent.width - this.element.outerWidth())

			this.element.offset(offset);
		}
	});

})(jQuery);