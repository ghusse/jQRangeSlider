(function($){
	"use strict";

	var defaultOptions = {
		bounds: {min: 0, max: 100},
		value: 50,
		percentageToValue: function(percentage){
			return percentage * (this.bounds.max - this.bounds.min) / 100 + this.bounds.min;
		},
		valueToPercentage: function(value){
			return 100 * (value - this.bounds.min) / (this.bounds.max - this.bounds.min);
		},
		constrainValue: function(value){
			return value;
		}
	};

	var SingleSlider = function(element, options){
		this.element = element;
		this.options = $.extend({}, defaultOptions, options);
	};

	function init(slider){
		createElements(slider);
		bindEvents(slider);	
	}

	function createElements(slider){
		slider.element
			.css({
				position: "relative"
			})
			.addClass("singleSlider slider-noArrow");

		var container = $("<div class='slider-container' />")
				.css({
					position: "relative"
				}),
			handle = $("<div class='slider-handle' />")
				.css({
					position: "absolute",
					top: 0,
					left: 0
				})
				.appendTo(container);

		slider.handle = handle;

		slider.element.append(container);
	}

	function bindEvents(slider){
		slider.handle.on("mousedown touchdown", function(e){
			var parentOffset = slider.element.parent().offset(),
				parentWidth = slider.element.parent().width(),
				elementPosition = slider.handle.position(),
				clickPosition = e.pageX - parentOffset.left,
				random = "" + Math.round(1000000 * Math.random()) + "" + Math.round(1000000 * Math.random()),
				mouseUpEvent = "mouseup." + random + " touchup." + random,
				mouseMoveEvent = "mousemove." + random + "touchmove." + random,
				$doc = $(document);

			$doc.on(mouseMoveEvent, function(e){
				var handleWidth = slider.handle.width(),
					newClickPos = e.pageX - parentOffset.left,
					valuePercentage = 100 * (elementPosition.left - (clickPosition - newClickPos)) / (parentWidth - handleWidth),
					positionPercentage,
					value, position;

				valuePercentage = Math.min(100, Math.max(0, valuePercentage));

				value = getValueFromPercentage(valuePercentage, slider);
				value = getConstrainedValue(value, slider);
				positionPercentage = getPositionFromValue(value, slider);

				position = positionPercentage * (parentWidth - handleWidth) / parentWidth;

				slider.handle.css("left", position + "%");
			});

			$doc.on(mouseUpEvent, function(e){
				$doc.off(mouseMoveEvent);
				$doc.off(mouseUpEvent);
			})
		});
	}

	function getValueFromPercentage(percentage, slider){
		return slider.options.percentageToValue.call(slider.options, percentage);
	}

	function getConstrainedValue(value, slider){
		return slider.options.constrainValue.call(slider.options, value);
	}

	function getPositionFromValue(value, slider){
		return slider.options.valueToPercentage.call(slider.options, value);
	}

	SingleSlider.prototype.destroy = function(){
		this.element.removeClass("singleSlider");
		this.element.empty();
	}

	function callMember(args, data){
		if (typeof data[args[0]] === "function"){
			var argsArray = Array.prototype.slice.call(args, 0, args.length);
			return data.prototype[args[0]].apply(data, argsArray);
		}

		return data;
	}
	
	$.fn.singleSlider = function(name){
		var data = this.data("singleSlider");

		if (!data){
			// Not constructed
			data = new SingleSlider(this, arguments[0] || {});
			init(data);
			this.data("singleSlider", data);
		}else if (name && name === "destroy"){
			// destroy
			this.removeData("singleSlider");
			data.destroy();
		}else if (typeof name === "string" && name){
			return callMember(arguments, data) || this;
		}

		return this;
	};

}(jQuery));