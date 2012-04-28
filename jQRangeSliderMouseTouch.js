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

 		_mouseInit: function(){
 			var that = this;
 			$.ui.mouse.prototype._mouseInit.apply(this);
 			this._mouseDownEvent = false;

 			this.element.bind('touchstart.' + this.widgetName, function(event) {
				return that._touchStart(event);
			});
 		},

 		_mouseDestroy: function(){
 			$(document)
 				.unbind('touchmove.' + this.widgetName, this._touchMoveDelegate)
				.unbind('touchend.' + this.widgetName, this._touchEndDelegate);
 			
 			$.ui.mouse.prototype._mouseDestroy.apply(this);
 		},

 		_touchStart: function(event){
 			event.which = 1;
 			event.preventDefault();

 			this._fillTouchEvent(event);

 			if (typeof event.originalEvent !== "undefined"){
 				event.pageX = event.originalEvent.pageX;
 				event.pageY = event.originalEvent.pageY;
 			}

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
					.bind('touchmove.' + this.widgetName, this._touchMoveDelegate)
					.bind('touchend.' + this.widgetName, this._touchEndDelegate);
 			}

			return result;
 		},

 		_touchEnd: function(event){
 			this._fillTouchEvent(event);
 			this._mouseUp(event);

 			$(document)
				.unbind('touchmove.' + this.widgetName, this._touchMoveDelegate)
				.unbind('touchend.' + this.widgetName, this._touchEndDelegate);

			this._mouseDownEvent = false;

			$(document).trigger("mouseup");

			return result;
 		},

 		_touchMove: function(event){
 			event.preventDefault();
 			this._fillTouchEvent(event);

 			return this._mouseMove(event);
 		},

 		_fillTouchEvent: function(event){
 			var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

 			event.pageX = touch.pageX;
 			event.pageY = touch.pageY;
 		}

 	});
 })(jQuery);