/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

(function($, undefined){

	"use strict";

	$.widget("ui.rangeSliderMouseTouch", $.ui.mouse, {
		enabled: true,

		_mouseInit: function(){
			var that = this;
			this._super();
			this._mouseDownEvent = false;

			this.element.on('touchstart.' + this.widgetName, function(event) {
				return that._touchStart(event);
			});
		},

		_mouseDestroy: function(){
			$(document)
				.off('touchmove.' + this.widgetName, this._touchMoveDelegate)
				.off('touchend.' + this.widgetName, this._touchEndDelegate);

				this._super();
		},

		enable: function(){
			this.enabled = true;
		},

		disable: function(){
			this.enabled = false;
		},

		destroy: function(){
			this._mouseDestroy();

			this._super();

			this._mouseInit = null;
		},

		_touchStart: function(event){
			if (!this.enabled) return false;

			event.which = 1;
			event.preventDefault();

			this._fillTouchEvent(event);

			var that = this,
				downEvent = this._mouseDownEvent;

			this._mouseDown(event);

			if (downEvent !== this._mouseDownEvent){

				this._touchEndDelegate = function(event){
					that._touchEnd(event);
				}

				this._touchMoveDelegate = function(event){
					that._touchMove(event);
				}

				$(document)
				.on('touchmove.' + this.widgetName, this._touchMoveDelegate)
				.on('touchend.' + this.widgetName, this._touchEndDelegate);
			}
		},

		_mouseDown: function(event){
			if (!this.enabled) return false;

			return this._super(event);
		},

		_touchEnd: function(event){
			this._fillTouchEvent(event);
			this._mouseUp(event);

			$(document)
			.off('touchmove.' + this.widgetName, this._touchMoveDelegate)
			.off('touchend.' + this.widgetName, this._touchEndDelegate);

		this._mouseDownEvent = false;

		// No other choice to reinitialize mouseHandled
		$(document).trigger("mouseup");
		},

		_touchMove: function(event){
			event.preventDefault();
			this._fillTouchEvent(event);

			return this._mouseMove(event);
		},

		_fillTouchEvent: function(event){
			var touch;

			if (typeof event.targetTouches === "undefined" && typeof event.changedTouches === "undefined"){
				touch = event.originalEvent.targetTouches[0] || event.originalEvent.changedTouches[0];
			} else {
				touch = event.targetTouches[0] || event.changedTouches[0];
			}

			event.pageX = touch.pageX;
			event.pageY = touch.pageY;

			event.which = 1; // [~] fixes touch events for jquery-ui.1.11.x.mouse
		}
	});
}(jQuery));
