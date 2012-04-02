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
		_positionner: null,

		_create: function(){
			var left = this.options.handle.rangeSliderHandle("option", "isLeft");

			this.element
				.addClass("ui-rangeSlider-label")
				.toggleClass("ui-rangeSlider-leftLabel", left)
				.toggleClass("ui-rangeSlider-rightLabel", !left)
				.css("position", "absolute");

			this.options.handle.bind("moving", $.proxy(this._onMoving, this));
		},

		_initPosition: function(){
			this._cache();
			this._position();
		},

		_display: function(value){
			if (this.options.formatter == false){
				this.element.text(Math.round(value));
			}else{
				this.element.text(this.options.formatter(value));
			}
		},

		/*
		 * Event binding
		 */
		_onMoving: function(event, ui){
			this._display(ui.value);
		},


		/*
		 * Label pair
		 */
		pair: function(label){
			this._positionner = new LabelPositioner(this.element, label);
			label.rangeSliderLabel("positionner", this._positionner);
		},

		positionner: function(pos){
			if (typeof pos !== "undefined"){
				this.positionner = pos;
			}

			return this.positionner;
		}
	});

	function LabelPositioner(label1, label2){
		this.label1 = label1;
		this.label2 = label2;
		this.handle1 = this.label1.rangeSliderLabel("option", "handle");
		this.handle2 = this.label2.rangeSliderLabel("option", "handle");
		this.cache = null;
		this.left = label1;
		this.right = label2;

		this.Init = function(){
			this.BindHandle(this.handle1);
			this.BindHandle(this.handle2);

			setTimeout($.proxy(this.PositionLabels, this), 200);
		}

		this.Cache = function(){
			this.cache = {};
			this.cache.label1 = {};
			this.cache.label2 = {};
			this.cache.handle1 = {};
			this.cache.handle2 = {};

			this.CacheElement(this.label1, this.cache.label1);
			this.CacheElement(this.label2, this.cache.label2);
			this.CacheElement(this.handle1, this.cache.handle1);
			this.CacheElement(this.handle2, this.cache.handle2);
		}

		this.CacheIfNecessary = function(){
			if (this.cache === null){
				this.Cache();
			}
		}

		this.CacheElement = function(label, cache){
			cache.width = label.outerWidth(true);
			cache.offset = label.offset();
		}

		this.getMargins = function(element){

		}

		this.BindHandle = function(handle){
			handle.bind("moving", $.proxy(this.onHandleMoving, this));
		}

		this.PositionLabels = function(){
			this.CacheIfNecessary();

			var label1Pos = this.GetRawPosition(this.cache.label1, this.cache.handle1),
				label2Pos = this.GetRawPosition(this.cache.label2, this.cache.handle2);

			this.ConstraintPositions(label1Pos, label2Pos);

			this.label1.offset(label1Pos);
			this.label2.offset(label2Pos);
		}

		this.ConstraintPositions = function(pos1, pos2){
			if (pos1.center < pos2.center && pos1.right > pos2.left){
				pos1 = this.getLeftPosition(pos1, pos2);
				pos2 = this.getRightPosition(pos1, pos2);
			}else if (pos1.center > pos2.center && pos2.right > pos1.left){
				pos2 = this.getLeftPosition(pos2, pos1);
				pos1 = this.getRightPosition(pos2, pos1);
			}
		}

		this.getLeftPosition = function(left, right){
			var center = (right.center + left.center) / 2,
				leftPos = center - left.width;

			left.left = leftPos;
			left.right = leftPos + left.width;

			return left;
		}

		this.getRightPosition = function(left, right){
			var center = (right.center + left.center) / 2;

			right.left = center;
			right.right = center + right.width;

			return right;
		}

		this.onHandleMoving = function(event, ui){
			this.CacheIfNecessary();
			this.UpdateHandlePosition(ui);

			this.PositionLabels();
		}

		this.UpdateHandlePosition = function(ui){
			if (ui.element[0] == this.handle1[0]){
				this.UpdatePosition(ui, this.cache.handle1);
			}else{
				this.UpdatePosition(ui, this.cache.handle2);
			}
		}

		this.UpdatePosition = function(element, cache){
			cache.offset = element.offset;
		}

		this.GetRawPosition = function(labelCache, handleCache){
			var handleCenter = handleCache.offset.left + handleCache.width / 2,
				labelLeft = handleCenter - labelCache.width / 2,
				labelRight = labelLeft + labelCache.width;

			console.log("" + handleCache.offset.left + " " + handleCache.width);

			return {
				left: labelLeft,
				right: labelRight,
				top: labelCache.offset.top,
				center: handleCenter,
				width: labelCache.width
			}
		}

		this.Init();
	}

})(jQuery);


