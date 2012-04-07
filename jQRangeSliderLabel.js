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
				.css("position", "absolute")
				.css("display", "block");

			this.options.handle
				.bind("moving update", $.proxy(this._onMoving, this));
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
			}else{
				this.CacheWidth(this.label1, this.cache.label1);
				this.CacheWidth(this.label2, this.cache.label2);
				this.CacheHeight(this.label1, this.cache.label1);
				this.CacheHeight(this.label2, this.cache.label2);
			}
		}

		this.CacheElement = function(label, cache){
			this.CacheWidth(label, cache);
			cache.offset = label.offset();
			cache.margin = {
				left: this.ParsePixels("marginLeft", label),
				right: this.ParsePixels("marginRight", label)
			};

			cache.border = {
				left: this.ParsePixels("borderLeftWidth", label),
				right: this.ParsePixels("borderRightWidth", label)
			};

			cache.outerWidth = cache.width + cache.margin.left + cache.margin.right + cache.border.left + cache.border.right;
		}

		this.CacheWidth = function(label, cache){
			cache.width = label.width();
			cache.outerWidth = label.outerWidth();
		}

		this.CacheHeight = function(label, cache){
			cache.outerHeightMargin = label.outerHeight(true);
		},

		this.ParsePixels = function(name, element){
			return parseInt(element.css(name), 10) || 0;
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
			if (pos1.center < pos2.center && pos1.outerRight > pos2.outerLeft){
				pos1 = this.getLeftPosition(pos1, pos2);
				pos2 = this.getRightPosition(pos1, pos2);
			}else if (pos1.center > pos2.center && pos2.outerRight > pos1.outerLeft){
				pos2 = this.getLeftPosition(pos2, pos1);
				pos1 = this.getRightPosition(pos2, pos1);
			}
		}

		this.getLeftPosition = function(left, right){
			var center = (right.center + left.center) / 2,
				leftPos = center - left.cache.outerWidth - left.cache.margin.right + left.cache.border.left;

			left.left = leftPos;

			return left;
		}

		this.getRightPosition = function(left, right){
			var center = (right.center + left.center) / 2;

			right.left = center + right.cache.margin.left + right.cache.border.left;

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
			var handleCenter = handleCache.offset.left + handleCache.outerWidth / 2,
				labelLeft = handleCenter - labelCache.outerWidth / 2,
				labelRight = labelLeft + labelCache.outerWidth - labelCache.border.left - labelCache.border.right,
				outerLeft = labelLeft - labelCache.margin.left - labelCache.border.left,
				top = handleCache.offset.top - labelCache.outerHeightMargin;

			return {
				left: labelLeft,
				outerLeft: outerLeft,
				top: top,
				right: labelRight,
				outerRight: outerLeft + labelCache.outerWidth + labelCache.margin.left + labelCache.margin.right,
				cache: labelCache,
				center: handleCenter
			}
		}

		this.Init();
	}

})(jQuery);


