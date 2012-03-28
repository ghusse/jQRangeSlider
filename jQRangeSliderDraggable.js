/**!
 * @license jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

 (function($, undefined){
 	"use strict";

 	$.widget("ui.rangeSliderDraggable", $.ui.mouse, {
 		cache: {},

 		options: {
 			containment: null
 		},

 		_create: function(){
 			setTimeout($.proxy(this._initElement, this), 10);
 		},

 		_initElement: function(){
 			this._mouseInit();
 			this._cache();
 		},

 		_setOption: function(key, value){
 			if (key == "containment"){
 				if (value === null || $(value).length == 0){
 					this.options.containment = null
 				}else{
 					this.options.containment = $(value);
 				}
 			}
 		},

 		/*
 		 * UI mouse widget
 		 */

 		_mouseStart: function(event){
 			this._cache();
 			this.cache.click = {
 					left: event.pageX,
 					top: event.pageY
 			};

 			this._triggerMouseEvent("mousestart");

 			return true;
 		},

 		_mouseDrag: function(event){
 			var position = event.pageX - this.cache.click.left;

 			if (position == 0){
 				return false;
 			}

 			this.cache.click.left = event.pageX;

 			position = this._constraintPosition(position + this.cache.offset.left);

 			this._applyPosition(position);

 			this._triggerMouseEvent("drag");

 			return false;
 		},

 		_mouseStop: function(event){
 			this._triggerMouseEvent("stop");
 		},

 		/*
 		 * To be overriden
 		 */

 		_constraintPosition: function(position){
 			if (this.options.containment !== null){
 				position = Math.min(position, 
 					this.cache.containment.offset.left + this.cache.containment.width - this.cache.width.outer);
 				position = Math.max(position, this.cache.containment.offset.left);
 			}

 			return position;
 		},

 		_applyPosition: function(position){
 			var offset = {
 				top: this.cache.offset.top,
 				left: position
 			}

 			this.element.offset(offset);

 			this.cache.offset = offset;
 		},

 		/*
 		 * Private utils
 		 */

 		_cache: function(){
 			this.cache = {};

 			this._cacheMargins();
 			this._cacheContainment();
 			this._cacheDimensions();

 			this.cache.offset = this.element.offset();
 		},

 		_cacheMargins: function(){
 			this.cache.margin = {
 				left: this._parsePixels(this.element, "marginLeft"),
 				right: this._parsePixels(this.element, "marginRight"),
 				top: this._parsePixels(this.element, "marginTop"),
 				bottom: this._parsePixels(this.element, "marginBottom")
 			};
 		},

 		_cacheContainment: function(){
 			if (this.options.containment !== null){
 				var container = this.options.containment;

	 			this.cache.containment = {
	 				offset: this.options.containment.offset(),
	 				width: this.options.containment.width()
	 			}
 			}else{
 				this.cache.containment = null;
 			}
 		},

 		_cacheDimensions: function(){
 			this.cache.width = {
 				outer: this.element.outerWidth(),
 				inner: this.element.width()
 			}
 		},

 		_parsePixels: function(element, string){
 			return parseInt(element.css(string), 10) || 0;
 		},

 		_triggerMouseEvent: function(event){
 			var data = this._prepareEventData();

 			this.element.trigger(event, data);
 		},

 		_prepareEventData: function(){
 			return {
 				element: this.element,
 				offset: this.cache.offset || null
 			};
 		}
 	});
	
 })(jQuery);