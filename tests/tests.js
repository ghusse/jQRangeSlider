/* jQRangeSlider
 * A javascript slider selector that supports dates
 * 
 * Copyright (C) Guillaume Gautreau 2010
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * jQRangeSlider
 */
 
var el = null;

var setUp = new TestCase(
	"Setup",
	function(){
		el = $("#test");
	},
	null
);

var defaultCtorTest = new TestCase(
	"Default ctor",
	function(){
		el.rangeSlider();
	},
	function() {
		// Default values tests
		deepEqual(el.rangeSlider("option", "bounds"), { min:0, max:100 }, "Default bounds should be 0-100");
		deepEqual(el.rangeSlider("option", "defaultValues"), {min:20, max:50}, "Default values should be 20-50");
		same(el.rangeSlider("option", "wheelMode"), null, "Default wheel mode should be empty");
		same(el.rangeSlider("option", "wheelSpeed"), 4, "Default wheel mode should be empty");
		ok(el.rangeSlider("option", "arrows"), "Arrows should be activated by default");
		same(el.rangeSlider("option", "valueLabels"), "show", "Value labels should be activated on value 'show' by default");
		same(el.rangeSlider("option", "formatter"), null, "Default formatter should be used (null value)");
		same(el.rangeSlider("option", "durationIn"), 0, "Default duration for showing labels is 0ms");
		same(el.rangeSlider("option", "durationOut"), 400, "Default duration for hiding labels is 400ms");
		same(el.rangeSlider("option", "delayOut"), 200, "Default delay before hiding labels is 200ms");
		
		// Created elements
		same($(".ui-rangeSlider-handle.ui-rangeSlider-leftHandle").length, 1, "Left handle should have been created");
		same($(".ui-rangeSlider-handle.ui-rangeSlider-rightHandle").length, 1, "Right handle should have been created");
		same($(".ui-rangeSlider-label.ui-rangeSlider-leftLabel").length, 1, "Left label should have been created");
		same($(".ui-rangeSlider-label.ui-rangeSlider-rightLabel").length, 1, "Right label should have been created");
		
		// Arrows
		same($(".ui-rangeSlider-arrow.ui-rangeSlider-leftArrow").length, 1, "Left arrow should have been created");
		same($(".ui-rangeSlider-arrow.ui-rangeSlider-rightArrow").length, 1, "Right arrow should have been created");
		same($(".ui-rangeSlider-arrow.ui-rangeSlider-leftArrow").css("display"), "block", "Left arrow should have been created");
		same($(".ui-rangeSlider-arrow.ui-rangeSlider-rightArrow").css("display"), "block", "Arrows should be visible");
		ok(el.hasClass("ui-rangeSlider-withArrows"), "ui-rangeSlider-withArrows should be applied to the parent element");
		
		// Bars
		same($(".ui-rangeSlider-innerBar").length, 1, "The inner bar should have been created");
		same($(".ui-rangeSlider-bar").length, 1, "The bar should have been created");
		
		same($(".ui-rangeSlider-container").outerWidth(true), el.innerWidth(), "Container");
		
		// Values
		same(this.min(), 20, "Values should be equal to the default values");
		same(this.max(), 50, "Values should be equal to the default values");
		
	}
);

var defaultSetup = new TestCase(
	"Default setup without assertions",
	function(){
		el.rangeSlider("destroy");
		el.rangeSlider();
	},
	null
);

var destroyTest = new TestCase(
	"Destroy",
	function(){
		el.rangeSlider("destroy");
	},
	function(){	
		same(el.children().length, 0, "Parent element should be empty");
		same(el.attr("class"), "", "Class attribute on parent element should be empty");
	}
);

var destroy = new TestCase(
	"Destroy",
	function(){
		el.rangeSlider("destroy");
	},
	null
);

var customCtorTest = new TestCase(
	"Custom ctor",
	function(){
		el.rangeSlider("destroy");
		this.defaultValues = {min:150, max:500};
		this.bounds = {min:-10, max:1000};
		
		el.rangeSlider(
			{
				defaultValues : this.defaultValues,
				bounds: this.bounds,
			}
		);
	},
	function(){
		var bounds = el.rangeSlider("option", "bounds");
		var defaultValues = el.rangeSlider("option", "defaultValues");
		var values = el.rangeSlider("values");
		
		same(bounds.min, this.bounds.min, "Bounds min value should have been correctly set");
		same(bounds.max, this.bounds.max, "Bounds max value should have been correctly set");
		same(defaultValues.min, this.defaultValues.min, "Default min value should have been correctly set");
		same(defaultValues.max, this.defaultValues.max, "Default max value should have been correctly set");
		same(values.min, this.defaultValues.min, "Min value should have been correctly set");
		same(values.max, this.defaultValues.max, "Max value should have been correctly set");
	}
);

var hideLabelsTest = new TestCase(
	"Hide labels",
	function(){
		el.rangeSlider("option", "valueLabels", "hide");
	},
	function(){
		same($(".ui-rangeSlider-label").length, 0, "Value labels should have been detached");
		same(el.rangeSlider("option", "valueLabels"), "hide", "Option value should be 'hidden'");
	}
);

var showLabelsTest = new TestCase(
	"Show labels",
	function(){
		el.rangeSlider("option", "valueLabels", "show");
	},
	function(){
		same($(".ui-rangeSlider-label").length, 2, "Value labels should have been detached");
		same(el.rangeSlider("option", "valueLabels"), "show", "Option value should be 'hidden'");
	}
);

var changeBoundsTest = new TestCase(
	"Change bounds",
	function(){
		var bounds = { min:30, max:40 };
		this.getPositions();
		
		el.rangeSlider("option", "bounds", bounds);
	},
	function(){
		var bounds = { min:30, max:40 };
		
		same(el.rangeSlider("option", "bounds").min, bounds.min, "Bounds setter should have worked");
		same(el.rangeSlider("option", "bounds").max, bounds.max, "Bounds setter should have worked");
		same(this.min(), bounds.min, "As the old values were outside the new bounds, values should have been updated");
		same(this.max(), bounds.max, "As the old values were outside the new bounds, values should have been updated");
		
		this.assertDifferentPositions();
	}
);

var wheelModeZoomTest = new TestCase(
	"Zoom wheel mode",
	function(){
		el.rangeSlider("option", "wheelMode", "zoom");
		this.getPositions();
		this.getValues();
		$(".ui-rangeSlider-bar").trigger("mousewheel", [-10, 0, -10]);
	},
	function(){
		same(el.rangeSlider("option", "wheelMode"), "zoom", "Wheelmode setter should have worked");
		ok($(".ui-rangeSlider-leftHandle").offset().left > this.minHandlerPos, "Left handle should have been moved");
		ok($(".ui-rangeSlider-rightHandle").offset().left < this.maxHandlerPos, "Right handle should have been moved");
		ok($(".ui-rangeSlider-leftLabel").offset().left > this.minLabelPos, "Left label should have been moved");
		ok($(".ui-rangeSlider-rightLabel").offset().left < this.maxLabelPos, "Right label should have been moved");
		
		ok(this.min() > this.values.min, "Zoom should have worked");
		ok(this.max() < this.values.max, "Zoom should have worked");
	}
);

var wheelModeScrollTest = new TestCase(
	"Scroll wheel mode",
	function(){
		el.rangeSlider("option", "wheelMode", "scroll");
		this.getValues();
		this.getPositions();
		el.find(".ui-rangeSlider-container").trigger("mousewheel", [-10, 0, -10]);
	},
	function(){
		same(el.rangeSlider("option", "wheelMode"), "scroll", "Wheelmode setter should have worked");
		
		ok($(".ui-rangeSlider-leftHandle").offset().left > this.minHandlerPos, "Left handle should have been moved");
		ok($(".ui-rangeSlider-rightHandle").offset().left > this.maxHandlerPos, "Right handle should have been moved");
		ok($(".ui-rangeSlider-leftLabel").offset().left > this.minLabelPos, "Left label should have been moved");
		ok($(".ui-rangeSlider-rightLabel").offset().left > this.maxLabelPos, "Right label should have been moved");
		
		ok(this.min() > this.values.min, "Scroll should have worked");
		ok(this.max() > this.values.max, "Scroll should have worked");
		same(this.min() - this.values.min, this.max() - this.values.max, "Scrolling must add or remove the same value on both ends");
	}
);

var wheelModeSetterTest = new TestCase(
	"Wheel mode setter test",
	function(){},
	function(){
		el.rangeSlider("option", "wheelMode", "badValue");
		same(el.rangeSlider("option", "wheelMode"), "scroll", "Wheelmode setter with a bad value should not have worked");
		
		el.rangeSlider("option", "wheelMode", null);
		same(el.rangeSlider("option", "wheelMode"), null, "Wheelmode setter with a bad value should not have worked");
	}
);

var wheelSpeedSetterTest = new TestCase(
	"Wheel speed setter",
	function(){},
	function(){
		el.rangeSlider("option", "wheelSpeed", 2);
		same(el.rangeSlider("option", "wheelSpeed"), 2, "Wheelspeed setter should have worked");	
		
		el.rangeSlider("option", "wheelSpeed", null);
		same(el.rangeSlider("option", "wheelSpeed"), 2, "Wheelspeed setter should not have worked");	

		el.rangeSlider("option", "wheelSpeed", "badValue");
		same(el.rangeSlider("option", "wheelSpeed"), 2, "Wheelspeed setter should not have worked");	
	}
);

/**
 *  Arrows
 */
var noArrowsSetterTest = new TestCase(
	"Arrows property setter",
	function(){
		el.rangeSlider("option", "arrows", false);
	},
	function(){
		ok(!el.hasClass("ui-rangeSlider-withArrows"), "The parent element should not have the class withArrows");
		ok(el.hasClass("ui-rangeSlider-noArrow"), "The parent element should have the class noArrows");
		
		var arrows = el.find(".ui-rangeSlider-arrow");
		ok(arrows.length, 2, "2 arrows should be present");
		same($(arrows[0]).css("display"), "none", "Arrows should not be displayed");
		same($(arrows[1]).css("display"), "none", "Arrows should not be displayed");
	}
);

var arrowsScrollingMouseUpTest = new TestCase(
	"Mouseup on another element than arrows",
	function(){
		el.rangeSlider("max", el.rangeSlider("option", "bounds").max - 0.2);
		el.find(".ui-rangeSlider-rightArrow").trigger("mousedown");
		$(document).trigger("mouseup");
		this.delay = 500;
	},
	function(){
		// mouseup on another element than the clicked arrow should stop scrolling
		ok(this.max() != el.rangeSlider("option", "bounds").max, "mouseup on another element than the clicked arrow should stop scrolling");
	}
);

/*
 * Public methods
 */
var valuesSetter = new TestCase(
	"Values setter",
	function(){
		this.previousResult = el.rangeSlider("values", 21, 22);
	},
	function(){
		same(this.previousResult.min, 21, "Method should have returned the good min value");
		same(this.previousResult.max, 22, "Method should have returned the good max value");
		
		var values = el.rangeSlider("values");
		same(values.min, 21, "Min value should have been set");
		same(values.max, 22, "Max value should have been set");
	}
);

var minMaxSetter = new TestCase(
	"Min & max setters",
	function(){
		this.min = 5;
		this.max = 42;
		
		this.minResult = el.rangeSlider("min", this.min);
		this.maxResult = el.rangeSlider("max", this.max);
	},
	function(){
		same(this.minResult, this.min, "Min setter should return the new value");
		same(this.maxResult, this.max, "Max setter should return the new value");
		
		same(el.rangeSlider("min"), this.min, "Min getter should return the new value");
		same(el.rangeSlider("max"), this.max, "Max getter should return the new value");
	}
);

var zoomInTest = new TestCase(
	"Zoom In",
	function(){
		this.getValues();
		el.rangeSlider("zoomIn", 2);
	},
	function(){
		ok(this.min() > this.values.min, "Min value should have been increased");
		ok(this.max() < this.values.max, "Min value should have been decreased");
	}
);

var zoomOutTest = new TestCase(
	"Zoom Out",
	function(){
		this.getValues();
		el.rangeSlider("zoomOut", 2);
	},
	function(){
		ok(this.min() < this.values.min, "Min value should have been decreased");
		ok(this.max() > this.values.max, "Min value should have been increased");
	}
);

var scrollLeftTest = new TestCase(
	"Scroll left",
	function(){
		this.getValues();
		el.rangeSlider("scrollLeft", 2);
	},
	function(){
		ok(this.min() < this.values.min, "Min value should have been decreased");
		ok(this.max() < this.values.max, "Min value should have been decreased");

	}
);

var scrollRightTest = new TestCase(
	"Scroll right",
	function(){
		this.getValues();
		el.rangeSlider("scrollRight", 2);
	},
	function(){
		ok(this.min() > this.values.min, "Min value should have been increased");
		ok(this.max() > this.values.max, "Min value should have been increased");
	}
);

testRunner.add("jQRangeSlider", [setUp,
			defaultCtorTest, hideLabelsTest, showLabelsTest, changeBoundsTest,
			wheelModeZoomTest, wheelModeScrollTest, wheelModeSetterTest, wheelSpeedSetterTest,
			noArrowsSetterTest, arrowsScrollingMouseUpTest,
			defaultSetup,
			customCtorTest,
			destroy,
			defaultCtorTest,
			valuesSetter, minMaxSetter,
			zoomInTest, zoomOutTest, scrollLeftTest, scrollRightTest,
			destroyTest]);

