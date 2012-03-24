/**!
 * @license jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */


 (function($, undefined){
	
	$.widget("ui.rangeSliderHandle", $.ui.mouse, {
		currentMove: null,
		margin: 0,
		parent: null,

		options: {
			drag: function(){},
			stop: function(){},
			containment: null,
			isLeft: true,
			bounds: {min:0, max:100}
		},

		_create: function(){
			this._mouseInit();
			this.parent = $(this.element[0].parent);
		},

		_mouseStart: function(event){
			this.margin = {
				left: parseInt(this.element.css("marginLeft"), 10) || 0,
				right: parseInt(this.element.css("marginRight"), 10) || 0
			}
			
			this.width = {
				outer: this.element.outerWidth(true),
				inner: this.element.width()
			}
			
			this.containment = {
				offset: this.options.containment.offset(),
				width: this.options.containment.width()
			}

			this.offset = this.element.offset();
			this.clickPosition = event.pageX - this.margin.left - this.offset.left;

			return true;
		},

		_mouseDrag: function(event){
			var position = event.pageX - this.clickPosition,
				offset = {top: this.offset.top};

			offset.left = position;
			offset.left = Math.max(offset.left, this.containment.offset.left);
			offset.left = Math.min(offset.left + this.width.outer,
					this.containment.offset.left + this.containment.width)
					- this.width.outer;

			this.element.offset(offset);

			this.options.drag(event, {
				element:this.element
			});

			return false;
		},

		_mouseStop: function(event){
			this.options.stop(event, {
				element: this.element
			});
		}
	});
 })(jQuery);